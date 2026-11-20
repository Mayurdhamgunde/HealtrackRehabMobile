export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
export type AppointmentType = 'Individual' | 'Group' | 'Assessment' | 'Follow-up';

export interface Appointment {
  id: string;
  patientName: string;
  type: AppointmentType;
  date: string;
  time: string;
  duration: string;
  room: string;
  therapist: string;
  status: AppointmentStatus;
  notes?: string;
}

export const mockAppointments: Appointment[] = [
  // ── Today ──
  {
    id: 'a-001',
    patientName: 'Margaret Osei',
    type: 'Individual',
    date: 'Today',
    time: '10:00 AM',
    duration: '45 min',
    room: 'Room 3',
    therapist: 'Dr. Priya Nair',
    status: 'Confirmed',
    notes: 'Focus on left-arm motor exercises and gait training.',
  },
  {
    id: 'a-002',
    patientName: 'Fatima Al-Rashid',
    type: 'Follow-up',
    date: 'Today',
    time: '11:30 AM',
    duration: '30 min',
    room: 'Room 1',
    therapist: 'Dr. James Whitfield',
    status: 'Confirmed',
    notes: 'Review range-of-motion progress post shoulder surgery.',
  },
  {
    id: 'a-003',
    patientName: 'Carlos Reyes',
    type: 'Assessment',
    date: 'Today',
    time: '02:30 PM',
    duration: '60 min',
    room: 'Assessment Suite',
    therapist: 'Dr. James Whitfield',
    status: 'Pending',
    notes: 'Mid-program knee flexion and strength assessment.',
  },

  // ── Tomorrow ──
  {
    id: 'a-004',
    patientName: 'Anika Sharma',
    type: 'Individual',
    date: 'Tomorrow',
    time: '09:00 AM',
    duration: '60 min',
    room: 'Room 2',
    therapist: 'Dr. Priya Nair',
    status: 'Confirmed',
    notes: 'Continue spinal mobility and core stabilisation programme.',
  },
  {
    id: 'a-005',
    patientName: 'Yuki Tanaka',
    type: 'Group',
    date: 'Tomorrow',
    time: '10:30 AM',
    duration: '45 min',
    room: 'Hall A',
    therapist: 'Dr. Lena Hoffmann',
    status: 'Confirmed',
    notes: "Parkinson's balance and coordination group session.",
  },
  {
    id: 'a-006',
    patientName: 'Liam Okonkwo',
    type: 'Individual',
    date: 'Tomorrow',
    time: '03:00 PM',
    duration: '45 min',
    room: 'Room 4',
    therapist: 'Dr. Sunita Kapoor',
    status: 'Pending',
  },

  // ── Future dates ──
  {
    id: 'a-007',
    patientName: 'Thomas Brennan',
    type: 'Assessment',
    date: 'Wed, 26 Nov',
    time: '11:00 AM',
    duration: '75 min',
    room: 'Assessment Suite',
    therapist: 'Dr. Lena Hoffmann',
    status: 'Confirmed',
    notes: 'Cognitive and motor re-assessment after hold period.',
  },
  {
    id: 'a-008',
    patientName: 'Liam Okonkwo',
    type: 'Group',
    date: 'Thu, 27 Nov',
    time: '10:30 AM',
    duration: '45 min',
    room: 'Hall A',
    therapist: 'Dr. Sunita Kapoor',
    status: 'Confirmed',
    notes: 'Paediatric motor skills group.',
  },
  {
    id: 'a-009',
    patientName: 'Yuki Tanaka',
    type: 'Follow-up',
    date: 'Fri, 28 Nov',
    time: '02:00 PM',
    duration: '30 min',
    room: 'Room 1',
    therapist: 'Dr. Lena Hoffmann',
    status: 'Cancelled',
    notes: 'Patient requested rescheduling.',
  },
  {
    id: 'a-010',
    patientName: 'Margaret Osei',
    type: 'Individual',
    date: 'Mon, 01 Dec',
    time: '09:30 AM',
    duration: '45 min',
    room: 'Room 3',
    therapist: 'Dr. Priya Nair',
    status: 'Confirmed',
    notes: 'Week 4 stroke rehab — speech component added.',
  },
];
