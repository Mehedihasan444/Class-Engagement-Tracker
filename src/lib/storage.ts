// Types
export type Role = 'admin' | 'user';

export type Student = {
  id: string;
  studentId: string;
  name: string;
  classSection: string;
  email: string;
  role: Role;
};

export type EngagementPoint = {
  id: string;
  studentId: string;
  points: number;
  comment: string;
  date: string;
};

// Local storage keys
const STUDENTS_KEY = 'classroom-students';
const POINTS_KEY = 'classroom-points';
const CURRENT_USER_KEY = 'classroom-current-user';

// Helper functions
const getStoredData = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setStoredData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Auth functions
export const getCurrentUser = (): Student | null => {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const signIn = (email: string, password: string): Student | null => {
  const students = getStoredData<Student>(STUDENTS_KEY);
  const student = students.find(s => s.email === email);
  
  if (student) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(student));
    return student;
  }
  return null;
};

export const signUp = (studentData: Omit<Student, 'id' | 'role'>): Student => {
  const students = getStoredData<Student>(STUDENTS_KEY);
  
  // Check if email or student ID already exists
  if (students.some(s => s.email === studentData.email || s.studentId === studentData.studentId)) {
    throw new Error('Student with this email or ID already exists');
  }
  
  const newStudent = {
    ...studentData,
    id: crypto.randomUUID(),
    role: students.length === 0 ? 'admin' : 'user' as Role, // First user is admin
  };
  
  students.push(newStudent);
  setStoredData(STUDENTS_KEY, students);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newStudent));
  
  return newStudent;
};

export const signOut = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Admin functions
export const isAdmin = (): boolean => {
  const currentUser = getCurrentUser();
  return currentUser?.role === 'admin';
};

export const deleteStudent = (studentId: string): void => {
  if (!isAdmin()) throw new Error('Only admins can delete students');
  
  const students = getStoredData<Student>(STUDENTS_KEY);
  const points = getStoredData<EngagementPoint>(POINTS_KEY);
  
  // Remove student's points
  const filteredPoints = points.filter(p => p.studentId !== studentId);
  setStoredData(POINTS_KEY, filteredPoints);
  
  // Remove student
  const filteredStudents = students.filter(s => s.id !== studentId);
  setStoredData(STUDENTS_KEY, filteredStudents);
};

export const updateStudent = (studentId: string, updates: Partial<Omit<Student, 'id' | 'role'>>): void => {
  if (!isAdmin()) throw new Error('Only admins can update student information');
  
  const students = getStoredData<Student>(STUDENTS_KEY);
  const studentIndex = students.findIndex(s => s.id === studentId);
  
  if (studentIndex === -1) throw new Error('Student not found');
  
  // Update student data
  students[studentIndex] = {
    ...students[studentIndex],
    ...updates,
  };
  
  setStoredData(STUDENTS_KEY, students);
};

export const deletePoints = (pointId: string): void => {
  if (!isAdmin()) throw new Error('Only admins can delete points');
  
  const points = getStoredData<EngagementPoint>(POINTS_KEY);
  const filteredPoints = points.filter(p => p.id !== pointId);
  setStoredData(POINTS_KEY, filteredPoints);
};

export const updatePoints = (pointId: string, updates: { points: number; comment: string }): void => {
  if (!isAdmin()) throw new Error('Only admins can update points');
  
  const points = getStoredData<EngagementPoint>(POINTS_KEY);
  const pointIndex = points.findIndex(p => p.id === pointId);
  
  if (pointIndex === -1) throw new Error('Points entry not found');
  
  // Update points data
  points[pointIndex] = {
    ...points[pointIndex],
    ...updates,
  };
  
  setStoredData(POINTS_KEY, points);
};

// Points functions
export const addPoints = (points: number, comment: string): void => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('No user logged in');
  
  // Admin can add points for anyone, users can only add for themselves
  if (!isAdmin()) {
    // Validate points range for regular users
    if (points < 1 || points > 10) {
      throw new Error('Points must be between 1 and 10');
    }
    
    const pointsData = getStoredData<EngagementPoint>(POINTS_KEY);
    
    // Check daily points limit for regular users
    const today = new Date().toDateString();
    const todayPoints = pointsData
      .filter(p => p.studentId === currentUser.id && new Date(p.date).toDateString() === today)
      .reduce((sum, p) => sum + p.points, 0);
      
    if (todayPoints + points > 20) {
      throw new Error('Daily points limit exceeded (maximum 20 points per day)');
    }
  }
  
  const newPoint = {
    id: crypto.randomUUID(),
    studentId: currentUser.id,
    points,
    comment,
    date: new Date().toISOString(),
  };
  
  const pointsData = getStoredData<EngagementPoint>(POINTS_KEY);
  pointsData.push(newPoint);
  setStoredData(POINTS_KEY, pointsData);
};

export const getLeaderboard = (): Array<{
  id: string;
  studentId: string;
  name: string;
  classSection: string;
  totalPoints: number;
  rank: number;
  isCurrentUser: boolean;
}> => {
  const students = getStoredData<Student>(STUDENTS_KEY);
  const points = getStoredData<EngagementPoint>(POINTS_KEY);
  const currentUser = getCurrentUser();
  
  const leaderboard = students.map(student => {
    const studentPoints = points
      .filter(p => p.studentId === student.id)
      .reduce((sum, p) => sum + p.points, 0);
      
    return {
      id: student.id,
      studentId: student.studentId,
      name: student.name,
      classSection: student.classSection,
      totalPoints: studentPoints,
      isCurrentUser: currentUser?.id === student.id,
      rank: 0, // Will be set after sorting
    };
  }).sort((a, b) => b.totalPoints - a.totalPoints);
  
  // Add ranks (handling ties)
  let currentRank = 1;
  let currentPoints = leaderboard[0]?.totalPoints;
  
  return leaderboard.map((entry, index) => {
    if (entry.totalPoints < currentPoints) {
      currentRank = index + 1;
      currentPoints = entry.totalPoints;
    }
    return { ...entry, rank: currentRank };
  });
};

export const getPointsHistory = (): Array<{
  id: string;
  points: number;
  comment: string;
  date: string;
  student: {
    id: string;
    name: string;
    studentId: string;
  };
  isCurrentUser: boolean;
}> => {
  const students = getStoredData<Student>(STUDENTS_KEY);
  const points = getStoredData<EngagementPoint>(POINTS_KEY);
  const currentUser = getCurrentUser();
  
  return points.map(point => {
    const student = students.find(s => s.id === point.studentId)!;
    return {
      id: point.id,
      points: point.points,
      comment: point.comment,
      date: point.date,
      student: {
        id: student.id,
        name: student.name,
        studentId: student.studentId,
      },
      isCurrentUser: currentUser?.id === point.studentId,
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};