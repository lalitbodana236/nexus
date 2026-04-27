import { QuestionTrack } from './practice.models';

export type LearningBlockType =
  | 'theory'
  | 'step'
  | 'example'
  | 'code'
  | 'checklist'
  | 'class-diagram'
  | 'component-diagram'
  | 'note'
  | 'image';

export interface LearningBlock {
  id: string;
  type: LearningBlockType;
  title: string;
  content?: string;
  language?: 'java' | 'python' | 'javascript' | 'text';
  code?: string;
  items?: string[];
  imageUrl?: string;
}

export interface LearningLesson {
  id: string;
  track: QuestionTrack;
  title: string;
  summary: string;
  order: number;
  tags: string[];
  blocks: LearningBlock[];
}

export interface CreateLearningLessonPayload {
  track: QuestionTrack;
  title: string;
  summary: string;
  tags: string[];
  blocks: LearningBlock[];
}
