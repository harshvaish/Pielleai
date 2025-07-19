import { TabsContent } from '@/components/ui/tabs';
import AvailabilitiesCalendar from '../AvailabilitiesCalendar/AvailabilitiesCalendar';

export default function AvailabilitiesTab({ tabValue }: { tabValue: string }) {
  return (
    <TabsContent
      value={tabValue}
      className='bg-white py-4 px-6 rounded-2xl'
    >
      <AvailabilitiesCalendar />
    </TabsContent>
  );
}
