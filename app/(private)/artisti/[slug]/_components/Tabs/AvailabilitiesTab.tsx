import { TabsContent } from '@/components/ui/tabs';
import AvailabilitiesCalendar from '../AvailabilitiesCalendar/AvailabilitiesCalendar';

type AvailabilitiesTabProps = { tabValue: string };

export default function AvailabilitiesTab({ tabValue }: AvailabilitiesTabProps) {
  return (
    <TabsContent
      value={tabValue}
      className='w-full bg-white py-4 px-6 rounded-2xl overflow-hidden'
    >
      <AvailabilitiesCalendar />
    </TabsContent>
  );
}
