import { TabsContent } from '@/components/ui/tabs';
import AvailabilitiesCalendar from '../AvailabilitiesCalendar/AvailabilitiesCalendar';
import { UserRole } from '@/lib/types';

type AvailabilitiesTabProps = { userRole: UserRole; tabValue: string };

export default function AvailabilitiesTab({ userRole, tabValue }: AvailabilitiesTabProps) {
  return (
    <TabsContent
      value={tabValue}
      className='w-full bg-white py-4 px-6 rounded-2xl overflow-hidden'
    >
      <AvailabilitiesCalendar userRole={userRole} />
    </TabsContent>
  );
}
