export const spatialOpenings = {
  'Ruy Lopez': ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
  "King's Indian": ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'],
  "Queen's Gambit": ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6'],
} as const;

export const verbalOpenings = {
  'Ruy Lopez': ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'd6', 'c3', 'O-O', 'h3', 'Nb8', 'd4', 'Nbd7'],
  "King's Indian": ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'Nf3', 'O-O', 'Be2', 'e5', 'O-O', 'Nc6', 'd5', 'Ne7', 'b4', 'Nh5', 'Re1', 'f5'],
  "Queen's Gambit": ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'cxd5', 'exd5', 'Bg5', 'Be7', 'e3', 'O-O', 'Bd3', 'Nbd7', 'Qc2', 'Re8', 'Nf3', 'Nf8', 'O-O', 'c6'],
} as const;

export type OpeningName = keyof typeof spatialOpenings;
