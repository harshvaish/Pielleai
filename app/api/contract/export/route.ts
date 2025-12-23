import { NextRequest, NextResponse } from 'next/server';
import { formatInTimeZone } from 'date-fns-tz';
import { unparse } from 'papaparse';
import { TIME_ZONE } from '@/lib/constants';
import getSession from '@/lib/data/auth/get-session';
import { getContracts } from '@/lib/data/contracts/get-contracts';
import { contractsExportFiltersSchema } from '@/lib/validation/contract-export-filters-schema';

type BackendContractStatus =
  | 'draft'
  | 'queued'
  | 'sent'
  | 'viewed'
  | 'signed'
  | 'voided'
  | 'declined'
  | 'all';

type CSVRow = {
  contract_id: number;
  contract_status: string;
  contract_date: string;
  contract_created_at: string;
  artist_id: number;
  artist_name: string;
  artist_stage_name: string;
  venue_id: number;
  venue_name: string;
  venue_address: string;
  event_id: number;
  event_type: string;
  event_start: string;
  event_end: string;
  tour_manager_email: string;
  payroll_consultant_email: string;
  file_name: string;
  file_url: string;
};

function mapUiStatusToApi(status: string): BackendContractStatus[] {
  switch (status) {
    case 'to-sign':
      return ['draft'];
    case 'signed':
      return ['signed'];
    case 'refused':
      return ['declined'];
    case 'error':
    case 'archived':
      return ['voided'];
    case 'all':
    default:
      return ['all'];
  }
}

function formatDateTime(value?: string | null): string {
  if (!value) return '';
  return formatInTimeZone(value, TIME_ZONE, 'dd/MM/yyyy HH:mm');
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Non sei autorizzato.', data: null },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validation = contractsExportFiltersSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Dati forniti non validi.', data: null },
        { status: 400 },
      );
    }

    const { s, a, m, v, sd, ed } = validation.data;
    const mappedStatuses = s.length
      ? s.flatMap(mapUiStatusToApi)
      : (['all'] as BackendContractStatus[]);

    const result = await getContracts(user, {
      currentPage: null,
      status: mappedStatuses,
      startDate: sd ?? '',
      endDate: ed ?? '',
      artistIds: a,
      artistManagerIds: m,
      venueIds: v,
      sort: 'desc',
    });

    const contracts = result?.data ?? [];

    const csvData: CSVRow[] = contracts.map((contract: any) => ({
      contract_id: contract.id,
      contract_status: contract.status ?? '',
      contract_date: contract.contractDate ?? '',
      contract_created_at: formatDateTime(contract.createdAt),
      artist_id: contract.artist?.id ?? 0,
      artist_name: `${contract.artist?.name ?? ''} ${contract.artist?.surname ?? ''}`.trim(),
      artist_stage_name: contract.artist?.stageName ?? '',
      venue_id: contract.venue?.id ?? 0,
      venue_name: contract.venue?.name ?? '',
      venue_address: contract.venue?.address ?? '',
      event_id: contract.event?.id ?? 0,
      event_type: contract.event?.eventType ?? '',
      event_start: formatDateTime(contract.availability?.startDate),
      event_end: formatDateTime(contract.availability?.endDate),
      tour_manager_email: contract.event?.tourManagerEmail ?? '',
      payroll_consultant_email: contract.event?.payrollConsultantEmail ?? '',
      file_name: contract.fileName ?? '',
      file_url: contract.fileUrl ?? '',
    }));

    const csv = unparse(csvData);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="contracts-export.csv"',
      },
    });
  } catch (error) {
    console.error('[contract-export] - Error:', error);
    return NextResponse.json(
      { success: false, message: 'Export fallito.', data: null },
      { status: 500 },
    );
  }
}
