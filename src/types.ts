export interface Points {
  _id: string;
  student: string;
  points: number;
  reason: string;
  section: string;
  date: Date;
}

export interface Student {
  _id: string;
  name: string;
  classSection: string;
  email: string;
  role: string;
  // ... other fields
} 