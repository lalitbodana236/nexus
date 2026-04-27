import { QuestionTrack } from '../models/practice.models';

export interface TrackDefinition {
  id: QuestionTrack;
  label: string;
  path: string;
  group: 'topics' | 'backend';
  summary: string;
  sampleTopic: string;
  learningTopics: string[];
  conceptTitle: string;
  conceptSummary: string;
  conceptPoints: string[];
}

export const TOPIC_TRACKS: TrackDefinition[] = [
  {
    id: 'coding',
    label: 'DSA',
    path: '/feed/track/coding',
    group: 'topics',
    summary: 'Concepts, patterns, problems',
    sampleTopic: 'Arrays & Hashing',
    learningTopics: ['Arrays', 'Hashing', 'Two Pointers', 'Sliding Window', 'Trees', 'Graphs', 'Dynamic Programming'],
    conceptTitle: 'Concept First: DSA Patterns',
    conceptSummary:
      'Start with arrays, hashing, two pointers, sliding window, recursion, trees, graphs, dynamic programming, and complexity analysis.',
    conceptPoints: ['Arrays & Hashing', 'Two Pointers & Sliding Window', 'Trees, Graphs, Dynamic Programming']
  },
  {
    id: 'system-design',
    label: 'System Design',
    path: '/feed/track/system-design',
    group: 'topics',
    summary: 'Architecture rounds',
    sampleTopic: 'Requirements & APIs',
    learningTopics: ['Requirements', 'APIs', 'Data Modeling', 'Caching', 'Queues', 'Consistency', 'Reliability'],
    conceptTitle: 'Concept First: System Design Thinking',
    conceptSummary:
      'Understand requirements, APIs, data models, capacity estimates, caching, queues, consistency, and failure handling.',
    conceptPoints: ['Requirements and APIs', 'Capacity, Data Modeling, Caching', 'Reliability, Scale, and Trade-offs']
  },
  {
    id: 'low-level-design',
    label: 'Low Level Design',
    path: '/feed/track/low-level-design',
    group: 'topics',
    summary: 'OOP and SOLID',
    sampleTopic: 'Entities & SOLID',
    learningTopics: ['Entities', 'Responsibilities', 'Interfaces', 'SOLID', 'Design Patterns', 'Workflow Modeling'],
    conceptTitle: 'Concept First: Low Level Design',
    conceptSummary:
      'Learn entities, responsibilities, interfaces, SOLID, design patterns, and how to convert requirements into clean object models.',
    conceptPoints: ['Entities and Responsibilities', 'Interfaces, SOLID, and Patterns', 'Modeling Real Workflows']
  }
];

export const BACKEND_ROADMAP_TRACKS: TrackDefinition[] = [
  {
    id: 'backend-java',
    label: 'Java',
    path: '',
    group: 'backend',
    summary: 'Core, JVM, concurrency',
    sampleTopic: 'Core Java',
    learningTopics: [],
    conceptTitle: 'Java Foundations',
    conceptSummary: 'Core language, collections, concurrency, and JVM internals.',
    conceptPoints: []
  },
  {
    id: 'backend-spring-boot',
    label: 'Spring Boot',
    path: '',
    group: 'backend',
    summary: 'APIs, JPA, security',
    sampleTopic: 'REST API Basics',
    learningTopics: [],
    conceptTitle: 'Spring Boot Fundamentals',
    conceptSummary: 'Build APIs, data layer, auth, and production-ready services.',
    conceptPoints: []
  },
  {
    id: 'backend-docker-k8s',
    label: 'Docker & Kubernetes',
    path: '',
    group: 'backend',
    summary: 'Deploy, scale, operate',
    sampleTopic: 'Container Fundamentals',
    learningTopics: [],
    conceptTitle: 'Container & Orchestration Basics',
    conceptSummary: 'Containerize apps, deploy safely, and scale with orchestration.',
    conceptPoints: []
  }
];

export const DEFAULT_TRACK_ID: QuestionTrack = TOPIC_TRACKS[0].id;

export const TRACK_CATALOG = [...TOPIC_TRACKS, ...BACKEND_ROADMAP_TRACKS];

export function getTrackDefinition(trackId: string | null | undefined): TrackDefinition | undefined {
  if (!trackId) {
    return undefined;
  }

  return TRACK_CATALOG.find((track) => track.id === trackId);
}

export function getTopicTrackDefinition(trackId: string | null | undefined): TrackDefinition | undefined {
  if (!trackId) {
    return undefined;
  }

  return TOPIC_TRACKS.find((track) => track.id === trackId);
}
