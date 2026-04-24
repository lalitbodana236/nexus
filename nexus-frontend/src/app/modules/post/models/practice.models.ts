export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionTrack = 'coding' | 'system-design' | 'low-level-design';

export interface PracticeMenuItem {
  id: string;
  label: string;
  path: string;
  active?: boolean;
}

export interface PracticeMenuSection {
  id: string;
  title: string;
  items: PracticeMenuItem[];
}

export interface Question {
  id: string;
  title: string;
  track: QuestionTrack;
  difficulty: Difficulty;
  status: 'Todo' | 'Done';
  favorite: boolean;
  prompt: string;
  explanation: string;
  solutions?: QuestionSolution[];
  tags: string[];
  createdAt: string;
}

export interface QuestionSolution {
  language: 'java' | 'python' | 'javascript';
  label: string;
  code: string;
}

export interface CreateQuestionPayload {
  title: string;
  track: QuestionTrack;
  difficulty: Difficulty;
  prompt: string;
  explanation: string;
  tags: string[];
}
