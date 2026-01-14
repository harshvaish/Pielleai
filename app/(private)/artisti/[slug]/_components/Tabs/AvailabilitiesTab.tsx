import { TabsContent } from '@/components/ui/tabs';
import AvailabilitiesView from '../AvailabilitiesCalendar/AvailabilitiesView';
import { UserRole } from '@/lib/types';

type AvailabilitiesTabProps = { userRole: UserRole; tabValue: string };

export default function AvailabilitiesTab({ userRole, tabValue }: AvailabilitiesTabProps) {
  return (
    <TabsContent
      value={tabValue}
      className='w-full bg-white py-4 px-6 rounded-2xl overflow-hidden'
    >
      <AvailabilitiesView userRole={userRole} />
    </TabsContent>
  );
}
