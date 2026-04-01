export const spatialDifficulty = {
  beginner: { studyTime: 10000, animationSpeed: 1200, label: 'Beginner' },
  club: { studyTime: 8000, animationSpeed: 1000, label: 'Club' },
  expert: { studyTime: 6000, animationSpeed: 800, label: 'Expert' },
  master: { studyTime: 4000, animationSpeed: 600, label: 'Master' },
} as const;

export const coordinateDifficulty = {
  beginner: { timePerSquare: 5000, label: 'Beginner' },
  club: { timePerSquare: 3000, label: 'Club' },
  expert: { timePerSquare: 2000, label: 'Expert' },
  master: { timePerSquare: 1000, label: 'Master' },
} as const;

export const verbalDifficulty = {
  beginner: { studyTime: 10000, label: 'Beginner' },
  club: { studyTime: 7000, label: 'Club' },
  expert: { studyTime: 5000, label: 'Expert' },
  master: { studyTime: 3000, label: 'Master' },
} as const;

export type DifficultyLevel = 'beginner' | 'club' | 'expert' | 'master';
