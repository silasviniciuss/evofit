export type MuscleGroup =
  | 'Peito'
  | 'Costas'
  | 'Bíceps'
  | 'Tríceps'
  | 'Ombros'
  | 'Pernas'
  | 'Abdômen'
  | 'Glúteos'
  | 'Cardio'
  | 'Outro';

export type WorkoutLocation = 'Academia' | 'Casa' | 'Todos';

export type WorkoutType = 'Academia' | 'Casa' | 'Cardio' | 'Outro';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  imageUrl: string;
  videoUrl?: string;
  location: WorkoutLocation;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  location: WorkoutLocation;
  equipmentId?: string;
  equipmentName?: string;
  imageUrl: string;
  videoUrl?: string;
  instructions: string;
  defaultSets: number;
  defaultReps: number;
  defaultWeight: number; // in kg
  defaultRest: number; // in seconds
  notes?: string;
}

export interface WorkoutExerciseItem {
  id: string;
  exerciseId: string;
  order: number;
  sets: number;
  reps: number;
  weight: number;
  rest: number;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  dayName: string; // SEGUNDA, TERÇA, etc.
  type: WorkoutType;
  estimatedDuration: number; // in minutes
  isRestDay?: boolean;
  notes?: string;
  exercises: WorkoutExerciseItem[];
}

export interface WorkoutDaySchedule {
  dayOfWeek: number;
  dayShort: string; // SEG, TER, QUA...
  dayName: string; // SEGUNDA, TERÇA...
  workoutId?: string;
  workoutName: string;
  isRestDay: boolean;
  estimatedDuration: number;
  type: WorkoutType;
}

export interface WeightRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  weight: number; // in kg
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSetLog {
  id: string;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  targetReps: number;
  targetWeight: number;
  actualReps: number;
  actualWeight: number;
  completed: boolean;
  completedAt?: string;
}

export interface WorkoutHistory {
  id: string;
  workoutId: string;
  workoutName: string;
  date: string; // YYYY-MM-DD
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  completedExercises: number;
  totalExercises: number;
  completedSets: number;
  totalSets: number;
  completed: boolean;
  notes?: string;
  logs: WorkoutSetLog[];
}

export interface ActiveWorkoutSession {
  workoutId: string;
  workoutName: string;
  startedAt: string;
  currentExerciseIndex: number;
  currentSetIndex: number;
  exercises: (WorkoutExerciseItem & { exercise: Exercise })[];
  completedSets: Record<string, { reps: number; weight: number; completed: boolean }[]>;
  isResting: boolean;
  restRemaining: number;
  totalRestDuration: number;
  elapsedSeconds: number;
  isPaused: boolean;
}
