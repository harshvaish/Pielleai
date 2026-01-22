export function buildEventProtocolNumber(masterId: number, revisionNumber: number): string {
  const padded = String(revisionNumber).padStart(2, '0');
  return `EVT-${masterId}-${padded}`;
}
