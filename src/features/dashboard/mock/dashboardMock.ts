// Mock data only. No real patient information.
export const dashboardStats = [
  {id: 'appointments', label: "Today's appointments", value: '8'},
  {id: 'patients', label: 'Active patients', value: '42'},
  {id: 'sessions', label: 'Sessions today', value: '5'},
  {id: 'followups', label: 'Pending follow-ups', value: '3'},
];

export type ScheduleStatus = 'Confirmed' | 'Pending';

export const todaySchedule: {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  status: ScheduleStatus;
}[] = [
  {
    id: '1',
    time: '09:30',
    title: 'Individual session',
    subtitle: 'Patient 001 - Room 2',
    status: 'Confirmed',
  },
  {
    id: '2',
    time: '11:00',
    title: 'Group session',
    subtitle: '6 patients - Hall A',
    status: 'Confirmed',
  },
  {
    id: '3',
    time: '14:15',
    title: 'Follow-up consultation',
    subtitle: 'Patient 014 - Room 1',
    status: 'Pending',
  },
];