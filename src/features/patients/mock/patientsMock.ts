export type PatientStatus = 'Active' | 'Discharged' | 'On Hold';

export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  therapist: string;
  status: PatientStatus;
  nextSession: string;
  sessionsCompleted: number;
  totalSessions: number;
}

export const mockPatients: Patient[] = [
  {
    id: 'p-001',
    name: 'Margaret Osei',
    age: 67,
    condition: 'Post-stroke rehabilitation',
    therapist: 'Dr. Priya Nair',
    status: 'Active',
    nextSession: 'Today, 10:00 AM',
    sessionsCompleted: 14,
    totalSessions: 24,
  },
  {
    id: 'p-002',
    name: 'Carlos Reyes',
    age: 54,
    condition: 'Knee replacement recovery',
    therapist: 'Dr. James Whitfield',
    status: 'Active',
    nextSession: 'Today, 2:30 PM',
    sessionsCompleted: 8,
    totalSessions: 16,
  },
  {
    id: 'p-003',
    name: 'Anika Sharma',
    age: 32,
    condition: 'Spinal cord injury rehab',
    therapist: 'Dr. Priya Nair',
    status: 'Active',
    nextSession: 'Tomorrow, 9:00 AM',
    sessionsCompleted: 20,
    totalSessions: 36,
  },
  {
    id: 'p-004',
    name: 'Thomas Brennan',
    age: 41,
    condition: 'Traumatic brain injury',
    therapist: 'Dr. Lena Hoffmann',
    status: 'On Hold',
    nextSession: 'Wed, 26 Nov, 11:00 AM',
    sessionsCompleted: 5,
    totalSessions: 30,
  },
  {
    id: 'p-005',
    name: 'Yuki Tanaka',
    age: 73,
    condition: "Parkinson's disease management",
    therapist: 'Dr. Lena Hoffmann',
    status: 'Active',
    nextSession: 'Tomorrow, 3:00 PM',
    sessionsCompleted: 18,
    totalSessions: 20,
  },
  {
    id: 'p-006',
    name: 'Fatima Al-Rashid',
    age: 46,
    condition: 'Shoulder surgery recovery',
    therapist: 'Dr. James Whitfield',
    status: 'Active',
    nextSession: 'Today, 4:15 PM',
    sessionsCompleted: 6,
    totalSessions: 12,
  },
  {
    id: 'p-007',
    name: 'Liam Okonkwo',
    age: 9,
    condition: 'Cerebral palsy therapy',
    therapist: 'Dr. Sunita Kapoor',
    status: 'Active',
    nextSession: 'Thu, 27 Nov, 10:30 AM',
    sessionsCompleted: 32,
    totalSessions: 48,
  },
  {
    id: 'p-008',
    name: 'Sandra Meier',
    age: 58,
    condition: 'Lower back pain management',
    therapist: 'Dr. Sunita Kapoor',
    status: 'Discharged',
    nextSession: '—',
    sessionsCompleted: 10,
    totalSessions: 10,
  },
];
