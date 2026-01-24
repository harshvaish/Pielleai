type ScheduleTimeProps = {
  label: string;
};

export default function ScheduleTime({ label }: ScheduleTimeProps) {
  return <span className='schedule-time'>{label}</span>;
}
