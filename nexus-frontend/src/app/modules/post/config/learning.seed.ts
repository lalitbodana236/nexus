import { LearningLesson } from '../models/learning.models';

export const LEARNING_SEED: LearningLesson[] = [
  {
    id: 'lesson-dsa-arrays-hashing',
    track: 'coding',
    title: 'Arrays & Hashing Foundations',
    summary: 'Build pattern intuition for lookup, counting, prefix transforms, and trade-offs.',
    order: 1,
    tags: ['Arrays', 'Hashing', 'Complexity'],
    blocks: [
      {
        id: 'dsa-theory-1',
        type: 'theory',
        title: 'Core Concept',
        content:
          'Use arrays for indexed access and hashing for constant-time lookup. Most FAANG warm-up questions become easier after you map input into fast lookup structures.'
      },
      {
        id: 'dsa-step-1',
        type: 'step',
        title: 'Step-by-Step Thinking',
        content: 'Identify repeated checks, choose map/set, scan once, and validate edge cases.'
      },
      {
        id: 'dsa-code-1',
        type: 'code',
        title: 'Reference Pattern',
        language: 'java',
        code: `Map<Integer, Integer> freq = new HashMap<>();
for (int value : nums) {
    freq.put(value, freq.getOrDefault(value, 0) + 1);
}`
      },
      {
        id: 'dsa-check-1',
        type: 'checklist',
        title: 'Interview Checklist',
        items: ['Time complexity stated', 'Space trade-off justified', 'Edge cases covered']
      }
    ]
  },
  {
    id: 'lesson-system-api-scaling',
    track: 'system-design',
    title: 'Requirement to API to Scale',
    summary: 'Translate product requirements into APIs, data model, and scaling strategy.',
    order: 1,
    tags: ['Requirements', 'APIs', 'Scale'],
    blocks: [
      {
        id: 'sys-theory-1',
        type: 'theory',
        title: 'Start with Requirements',
        content:
          'Clarify scope and SLAs first. Unknown traffic and consistency expectations create weak designs if not resolved early.'
      },
      {
        id: 'sys-component-1',
        type: 'component-diagram',
        title: 'Component View',
        content: 'Client -> API Gateway -> Service -> Cache -> Database -> Queue -> Worker'
      },
      {
        id: 'sys-note-1',
        type: 'note',
        title: 'Why Queue?',
        content: 'Queue smooths spikes and protects core write paths from downstream latency.'
      }
    ]
  },
  {
    id: 'lesson-lld-entities-solid',
    track: 'low-level-design',
    title: 'Entities, Responsibilities, SOLID',
    summary: 'Break a problem into classes with clean boundaries and extensibility.',
    order: 1,
    tags: ['Entities', 'SOLID', 'Patterns'],
    blocks: [
      {
        id: 'lld-theory-1',
        type: 'theory',
        title: 'Identify Entities First',
        content:
          'Extract nouns from requirements and assign one clear responsibility per class. This prevents god objects.'
      },
      {
        id: 'lld-class-1',
        type: 'class-diagram',
        title: 'Class Outline',
        content: 'ParkingLot -> Floor -> Spot\nVehicle hierarchy\nTicket and Payment strategies'
      },
      {
        id: 'lld-step-1',
        type: 'step',
        title: 'Why this structure?',
        content:
          'It isolates behavior changes (pricing, slot assignment, payment) and keeps each class testable.'
      }
    ]
  }
];
