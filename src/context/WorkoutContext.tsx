import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  User,
  Equipment,
  Exercise,
  Workout,
  WorkoutDaySchedule,
  WeightRecord,
  WorkoutHistory,
  ActiveWorkoutSession,
  WorkoutSetLog,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_EQUIPMENT,
  INITIAL_EXERCISES,
  INITIAL_WORKOUTS,
  INITIAL_SCHEDULE,
  INITIAL_WEIGHT_RECORDS,
  INITIAL_WORKOUT_HISTORY,
} from '../data/initialData';
import { getTodayDateString } from '../utils/formatters';
import { playRestCompleteSound, playSetCompleteSound, playWorkoutFinishSound } from '../utils/sound';
import confetti from 'canvas-confetti';

interface WorkoutContextType {
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  resetPassword: (email: string) => boolean;
  setAdminMode: (admin: boolean) => void;

  // Data
  equipment: Equipment[];
  exercises: Exercise[];
  workouts: Workout[];
  schedule: WorkoutDaySchedule[];
  weightRecords: WeightRecord[];
  workoutHistory: WorkoutHistory[];

  // Active Workout Session
  activeSession: ActiveWorkoutSession | null;
  startWorkout: (workoutId: string) => void;
  completeSet: (reps: number, weight: number) => void;
  skipRest: () => void;
  addRestSeconds: (delta: number) => void;
  finishWorkout: (notes?: string) => WorkoutHistory;
  cancelWorkout: () => void;

  // Weight Management
  todayWeightRecord: WeightRecord | undefined;
  getWeightForDate: (date: string) => WeightRecord | undefined;
  saveWeightRecord: (date: string, weight: number, overwrite?: boolean) => { success: boolean; existingRecord?: WeightRecord };
  updateWeightRecord: (id: string, weight: number, date?: string) => void;
  deleteWeightRecord: (id: string) => void;

  // Admin Management
  createWorkout: (workout: Omit<Workout, 'id'>) => Workout;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  reorderWorkoutExercises: (workoutId: string, startIndex: number, endIndex: number) => void;

  createExercise: (exercise: Omit<Exercise, 'id'>) => Exercise;
  updateExercise: (exercise: Exercise) => void;
  deleteExercise: (id: string) => void;

  createEquipment: (equipment: Omit<Equipment, 'id'>) => Equipment;
  updateEquipment: (equipment: Equipment) => void;
  deleteEquipment: (id: string) => void;

  updateScheduleDay: (dayOfWeek: number, updates: Partial<WorkoutDaySchedule>) => void;
  resetAllData: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | null>(null);

const STORAGE_KEYS = {
  USER: 'silas_user',
  EQUIPMENT: 'silas_equipment',
  EXERCISES: 'silas_exercises',
  WORKOUTS: 'silas_workouts',
  SCHEDULE: 'silas_schedule',
  WEIGHT: 'silas_weight_records',
  HISTORY: 'silas_history',
  ACTIVE_SESSION: 'silas_active_session',
  ADMIN_MODE: 'silas_admin_mode',
};

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Auth state - Unauthenticated by default until user logs in with Silas credentials
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const savedAdmin = localStorage.getItem(STORAGE_KEYS.ADMIN_MODE);
      return savedUser && savedAdmin ? JSON.parse(savedAdmin) : false;
    } catch {
      return false;
    }
  });

  // 2. Data state with LocalStorage
  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
      return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT;
    } catch {
      return INITIAL_EQUIPMENT;
    }
  });

  const [exercises, setExercises] = useState<Exercise[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXERCISES);
      return saved ? JSON.parse(saved) : INITIAL_EXERCISES;
    } catch {
      return INITIAL_EXERCISES;
    }
  });

  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
      return saved ? JSON.parse(saved) : INITIAL_WORKOUTS;
    } catch {
      return INITIAL_WORKOUTS;
    }
  });

  const [schedule, setSchedule] = useState<WorkoutDaySchedule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
    } catch {
      return INITIAL_SCHEDULE;
    }
  });

  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEIGHT);
      return saved ? JSON.parse(saved) : INITIAL_WEIGHT_RECORDS;
    } catch {
      return INITIAL_WEIGHT_RECORDS;
    }
  });

  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : INITIAL_WORKOUT_HISTORY;
    } catch {
      return INITIAL_WORKOUT_HISTORY;
    }
  });

  const [activeSession, setActiveSession] = useState<ActiveWorkoutSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Persist state updates
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, JSON.stringify(isAdmin));
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEIGHT, JSON.stringify(weightRecords));
  }, [weightRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(workoutHistory));
  }, [workoutHistory]);

  useEffect(() => {
    if (activeSession) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(activeSession));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    }
  }, [activeSession]);

  // Active workout timers (total elapsed + rest countdown)
  useEffect(() => {
    if (!activeSession || activeSession.isPaused) return;

    const interval = setInterval(() => {
      setActiveSession((prev) => {
        if (!prev) return null;
        let newRestRemaining = prev.restRemaining;
        let newIsResting = prev.isResting;

        if (prev.isResting) {
          if (newRestRemaining > 1) {
            newRestRemaining -= 1;
          } else {
            newRestRemaining = 0;
            newIsResting = false;
            playRestCompleteSound();
          }
        }

        return {
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
          restRemaining: newRestRemaining,
          isResting: newIsResting,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession?.isPaused]);

  // Auth operations
  const login = (usernameOrEmail: string, password?: string): boolean => {
    const userTrimmed = (usernameOrEmail || '').trim().toLowerCase();
    const passTrimmed = (password || '').trim();

    // Usuário: silas (ou silasvinicius.dev@gmail.com) | Senha: 060333
    const isUserValid = userTrimmed === 'silas' || userTrimmed === 'silasvinicius.dev@gmail.com';
    const isPassValid = passTrimmed === '060333';

    if (isUserValid && isPassValid) {
      const user: User = {
        id: 'usr-silas-1',
        name: 'Silas Vinícius',
        email: 'silasvinicius.dev@gmail.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(user);
      setIsAdmin(true);
      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, JSON.stringify(true));
      } catch {
        // Ignore localStorage error if quota or private mode
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_MODE);
    } catch {
      // Ignore
    }
  };

  const resetPassword = (_email: string) => {
    return true;
  };

  const setAdminMode = (admin: boolean) => {
    setIsAdmin(admin);
  };

  // Workout Session Execution
  const startWorkout = useCallback((workoutId: string) => {
    const wo = workouts.find((w) => w.id === workoutId) || workouts[0];
    if (!wo) return;

    // Resolve exercises
    const resolvedExercises = wo.exercises.map((item) => {
      const ex = exercises.find((e) => e.id === item.exerciseId) || {
        id: item.exerciseId,
        name: 'Exercício',
        muscleGroup: 'Peito',
        location: 'Academia',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
        instructions: 'Execute com postura controlada.',
        defaultSets: item.sets,
        defaultReps: item.reps,
        defaultWeight: item.weight,
        defaultRest: item.rest,
      };
      return {
        ...item,
        exercise: ex as Exercise,
      };
    });

    const initialCompletedSets: Record<string, { reps: number; weight: number; completed: boolean }[]> = {};
    resolvedExercises.forEach((item) => {
      initialCompletedSets[item.id] = [];
    });

    const session: ActiveWorkoutSession = {
      workoutId: wo.id,
      workoutName: wo.name,
      startedAt: new Date().toISOString(),
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      exercises: resolvedExercises,
      completedSets: initialCompletedSets,
      isResting: false,
      restRemaining: 0,
      totalRestDuration: 60,
      elapsedSeconds: 0,
      isPaused: false,
    };

    setActiveSession(session);
  }, [workouts, exercises]);

  const completeSet = useCallback((actualReps: number, actualWeight: number) => {
    setActiveSession((prev) => {
      if (!prev) return null;
      const currentItem = prev.exercises[prev.currentExerciseIndex];
      if (!currentItem) return prev;

      playSetCompleteSound();

      const existingSets = prev.completedSets[currentItem.id] || [];
      const updatedSets = [
        ...existingSets,
        { reps: actualReps, weight: actualWeight, completed: true },
      ];

      const newCompletedSets = {
        ...prev.completedSets,
        [currentItem.id]: updatedSets,
      };

      const restTime = currentItem.rest || currentItem.exercise.defaultRest || 60;
      const isLastSetOfExercise = updatedSets.length >= currentItem.sets;
      const isLastExercise = prev.currentExerciseIndex >= prev.exercises.length - 1;

      let nextExIdx = prev.currentExerciseIndex;
      let nextSetIdx = updatedSets.length;

      if (isLastSetOfExercise && !isLastExercise) {
        nextExIdx += 1;
        nextSetIdx = 0;
      }

      return {
        ...prev,
        completedSets: newCompletedSets,
        currentExerciseIndex: nextExIdx,
        currentSetIndex: nextSetIdx,
        isResting: true,
        restRemaining: restTime,
        totalRestDuration: restTime,
      };
    });
  }, []);

  const skipRest = useCallback(() => {
    setActiveSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        isResting: false,
        restRemaining: 0,
      };
    });
  }, []);

  const addRestSeconds = useCallback((delta: number) => {
    setActiveSession((prev) => {
      if (!prev) return null;
      const nextRemaining = Math.max(0, prev.restRemaining + delta);
      return {
        ...prev,
        restRemaining: nextRemaining,
        totalRestDuration: Math.max(prev.totalRestDuration, nextRemaining),
        isResting: nextRemaining > 0,
      };
    });
  }, []);

  const finishWorkout = useCallback((notes?: string): WorkoutHistory => {
    if (!activeSession) {
      throw new Error('No active workout session');
    }

    playWorkoutFinishSound();
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1677FF', '#4DA3FF', '#22C55E', '#FFFFFF'],
      });
    } catch {
      // safe fallback if confetti fails
    }

    const now = new Date();
    const today = getTodayDateString();

    const logs: WorkoutSetLog[] = [];
    let completedSetsCount = 0;
    let completedExercisesCount = 0;
    let totalSetsPlanned = 0;

    activeSession.exercises.forEach((item) => {
      totalSetsPlanned += item.sets;
      const done = activeSession.completedSets[item.id] || [];
      if (done.length >= item.sets && item.sets > 0) {
        completedExercisesCount += 1;
      }
      done.forEach((s, idx) => {
        if (s.completed) completedSetsCount += 1;
        logs.push({
          id: `log-${Date.now()}-${item.id}-${idx}`,
          exerciseId: item.exerciseId,
          exerciseName: item.exercise.name,
          setNumber: idx + 1,
          targetReps: item.reps,
          targetWeight: item.weight,
          actualReps: s.reps,
          actualWeight: s.weight,
          completed: s.completed,
          completedAt: now.toISOString(),
        });
      });
    });

    const newHistoryItem: WorkoutHistory = {
      id: `wh-${Date.now()}`,
      workoutId: activeSession.workoutId,
      workoutName: activeSession.workoutName,
      date: today,
      startedAt: activeSession.startedAt,
      finishedAt: now.toISOString(),
      durationSeconds: activeSession.elapsedSeconds,
      completedExercises: completedExercisesCount,
      totalExercises: activeSession.exercises.length,
      completedSets: completedSetsCount,
      totalSets: totalSetsPlanned,
      completed: true,
      notes: notes || 'Treino finalizado com sucesso!',
      logs,
    };

    setWorkoutHistory((prev) => [newHistoryItem, ...prev]);
    setActiveSession(null);
    return newHistoryItem;
  }, [activeSession]);

  const cancelWorkout = useCallback(() => {
    setActiveSession(null);
  }, []);

  // Weight Management
  const todayDate = getTodayDateString();
  const todayWeightRecord = useMemo(() => {
    return weightRecords.find((r) => r.date === todayDate);
  }, [weightRecords, todayDate]);

  const getWeightForDate = useCallback((date: string) => {
    return weightRecords.find((r) => r.date === date);
  }, [weightRecords]);

  const saveWeightRecord = useCallback((date: string, weight: number, overwrite = false) => {
    const existing = weightRecords.find((r) => r.date === date);
    if (existing && !overwrite) {
      return { success: false, existingRecord: existing };
    }

    const now = new Date().toISOString();
    if (existing && overwrite) {
      setWeightRecords((prev) =>
        prev.map((r) => (r.id === existing.id ? { ...r, weight, updatedAt: now } : r))
      );
      return { success: true };
    }

    const newRecord: WeightRecord = {
      id: `w-${Date.now()}`,
      userId: currentUser?.id || 'usr-silas-1',
      date,
      weight,
      createdAt: now,
      updatedAt: now,
    };

    setWeightRecords((prev) => {
      const filtered = prev.filter((r) => r.date !== date);
      const updated = [...filtered, newRecord];
      return updated.sort((a, b) => a.date.localeCompare(b.date));
    });

    return { success: true };
  }, [weightRecords, currentUser]);

  const updateWeightRecord = useCallback((id: string, weight: number, date?: string) => {
    setWeightRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            weight,
            date: date || r.date,
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      }).sort((a, b) => a.date.localeCompare(b.date))
    );
  }, []);

  const deleteWeightRecord = useCallback((id: string) => {
    setWeightRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Admin CRUD operations
  const createWorkout = useCallback((data: Omit<Workout, 'id'>) => {
    const newWorkout: Workout = {
      ...data,
      id: `wo-${Date.now()}`,
    };
    setWorkouts((prev) => [...prev, newWorkout]);
    return newWorkout;
  }, []);

  const updateWorkout = useCallback((updated: Workout) => {
    setWorkouts((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  }, []);

  const deleteWorkout = useCallback((id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const reorderWorkoutExercises = useCallback((workoutId: string, startIndex: number, endIndex: number) => {
    setWorkouts((prev) =>
      prev.map((w) => {
        if (w.id !== workoutId) return w;
        const result = Array.from(w.exercises);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        // re-index orders
        const reordered = result.map((item, idx) => ({ ...item, order: idx + 1 }));
        return { ...w, exercises: reordered };
      })
    );
  }, []);

  const createExercise = useCallback((data: Omit<Exercise, 'id'>) => {
    const newEx: Exercise = {
      ...data,
      id: `ex-${Date.now()}`,
    };
    setExercises((prev) => [...prev, newEx]);
    return newEx;
  }, []);

  const updateExercise = useCallback((updated: Exercise) => {
    setExercises((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  }, []);

  const deleteExercise = useCallback((id: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const createEquipment = useCallback((data: Omit<Equipment, 'id'>) => {
    const newEq: Equipment = {
      ...data,
      id: `eq-${Date.now()}`,
    };
    setEquipment((prev) => [...prev, newEq]);
    return newEq;
  }, []);

  const updateEquipment = useCallback((updated: Equipment) => {
    setEquipment((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  }, []);

  const deleteEquipment = useCallback((id: string) => {
    setEquipment((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateScheduleDay = useCallback((dayOfWeek: number, updates: Partial<WorkoutDaySchedule>) => {
    setSchedule((prev) =>
      prev.map((day) => (day.dayOfWeek === dayOfWeek ? { ...day, ...updates } : day))
    );
  }, []);

  const resetAllData = useCallback(() => {
    setEquipment(INITIAL_EQUIPMENT);
    setExercises(INITIAL_EXERCISES);
    setWorkouts(INITIAL_WORKOUTS);
    setSchedule(INITIAL_SCHEDULE);
    setWeightRecords(INITIAL_WEIGHT_RECORDS);
    setWorkoutHistory(INITIAL_WORKOUT_HISTORY);
    setActiveSession(null);
    setCurrentUser(INITIAL_USER);
    setIsAdmin(true);
    localStorage.clear();
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        currentUser,
        isAdmin,
        login,
        logout,
        resetPassword,
        setAdminMode,
        equipment,
        exercises,
        workouts,
        schedule,
        weightRecords,
        workoutHistory,
        activeSession,
        startWorkout,
        completeSet,
        skipRest,
        addRestSeconds,
        finishWorkout,
        cancelWorkout,
        todayWeightRecord,
        getWeightForDate,
        saveWeightRecord,
        updateWeightRecord,
        deleteWeightRecord,
        createWorkout,
        updateWorkout,
        deleteWorkout,
        reorderWorkoutExercises,
        createExercise,
        updateExercise,
        deleteExercise,
        createEquipment,
        updateEquipment,
        deleteEquipment,
        updateScheduleDay,
        resetAllData,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
