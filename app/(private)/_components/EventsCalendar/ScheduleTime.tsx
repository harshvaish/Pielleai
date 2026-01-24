type ScheduleTimeProps = {
  label?: string;
};

export default function ScheduleTime({ label }: ScheduleTimeProps) {
  if (!label) return null;
  return <span className='schedule-time'>{label}</span>;
}
