import { PracticeMenuSection, Question } from '../models/practice.models';
import { TOPIC_TRACKS } from './track.config';

export const PRACTICE_MENU_SEED: PracticeMenuSection[] = TOPIC_TRACKS.map((track) => ({
  id: track.id,
  title: track.label,
  items: [{ id: `${track.id}-default`, label: `${track.label} Practice`, path: track.path, active: track.id === TOPIC_TRACKS[0].id }]
}));

const CODING_BASE_TITLES = [
  'Two Sum',
  'Contains Duplicate',
  'Valid Anagram',
  'Group Anagrams',
  'Top K Frequent Elements',
  'Product of Array Except Self',
  'Valid Sudoku',
  'Encode and Decode Strings',
  'Longest Consecutive Sequence',
  'Best Time to Buy and Sell Stock',
  'Longest Substring Without Repeating Characters',
  'Longest Repeating Character Replacement',
  'Permutation in String',
  'Minimum Window Substring',
  'Valid Palindrome',
  '3Sum',
  'Container With Most Water',
  'Trapping Rain Water',
  'Binary Search',
  'Search in Rotated Sorted Array',
  'Find Minimum in Rotated Sorted Array',
  'Koko Eating Bananas',
  'Time Based Key-Value Store',
  'Median of Two Sorted Arrays',
  'Reverse Linked List',
  'Merge Two Sorted Lists',
  'Reorder List',
  'Remove Nth Node From End of List',
  'Copy List with Random Pointer',
  'Linked List Cycle'
];

function buildCodingQuestions(): Question[] {
  return Array.from({ length: 250 }, (_, index) => {
    const baseTitle = CODING_BASE_TITLES[index] ?? `Most Asked Coding Question ${index + 1}`;
    const n = index + 1;
    const difficulty = n % 13 === 0 ? 'Hard' : n % 4 === 0 ? 'Medium' : 'Easy';

    return {
      id: `coding-${n}`,
      title: baseTitle,
      track: 'coding',
      difficulty,
      status: n <= 41 ? 'Done' : 'Todo',
      favorite: n % 9 === 0,
      prompt: `Solve ${baseTitle} using an optimal approach and explain time/space complexity.`,
      explanation:
        `Break the problem into a pattern-recognition step, choose the right data structure, and validate with edge cases for ${baseTitle}.`,
      solutions: buildSolutions(baseTitle),
      tags: difficulty === 'Hard' ? ['Patterns', 'Optimization'] : ['Array', 'Hashing'],
      createdAt: new Date(Date.UTC(2026, 0, 1 + (n % 28))).toISOString()
    };
  });
}

function buildSolutions(title: string): Question['solutions'] {
  const methodName = title.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr: string) => chr.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '');

  return [
    {
      language: 'java',
      label: 'Java',
      code: `import java.util.*;

class Solution {
    public int solve${methodName}(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (seen.containsKey(need)) {
                return i;
            }
            seen.put(nums[i], i);
        }
        return -1;
    }
}`
    },
    {
      language: 'python',
      label: 'Python',
      code: `class Solution:
    def solve(self, nums: list[int], target: int) -> int:
        seen: dict[int, int] = {}
        for index, value in enumerate(nums):
            need = target - value
            if need in seen:
                return index
            seen[value] = index
        return -1`
    },
    {
      language: 'javascript',
      label: 'JS',
      code: `export function solve(nums, target) {
  const seen = new Map();

  for (let index = 0; index < nums.length; index += 1) {
    const need = target - nums[index];
    if (seen.has(need)) {
      return index;
    }
    seen.set(nums[index], index);
  }

  return -1;
}`
    }
  ];
}

function buildSystemDesignQuestions(): Question[] {
  const titles = [
    'Design URL Shortener',
    'Design Instagram Feed',
    'Design Rate Limiter',
    'Design Notification Service',
    'Design Chat System',
    'Design Video Streaming Service',
    'Design API Gateway',
    'Design Search Autocomplete',
    'Design Distributed Cache',
    'Design Job Scheduler'
  ];

  return titles.map((title, index) => ({
    id: `system-${index + 1}`,
    title,
    track: 'system-design',
    difficulty: index > 6 ? 'Hard' : 'Medium',
    status: 'Todo',
    favorite: false,
    prompt: `Design ${title} with scale assumptions, data flow, APIs, and reliability considerations.`,
    explanation:
      `Start with requirements, define APIs and data model, then discuss scaling, consistency, and failure recovery for ${title}.`,
    solutions: buildSolutions(title),
    tags: ['Scalability', 'Architecture'],
    createdAt: new Date(Date.UTC(2026, 1, index + 1)).toISOString()
  }));
}

function buildLowLevelDesignQuestions(): Question[] {
  const titles = [
    'Design Parking Lot',
    'Design Library Management System',
    'Design Elevator System',
    'Design Splitwise',
    'Design BookMyShow',
    'Design Tic-Tac-Toe',
    'Design Vending Machine',
    'Design Logger Framework',
    'Design ATM',
    'Design Ride Sharing System'
  ];

  return titles.map((title, index) => ({
    id: `lld-${index + 1}`,
    title,
    track: 'low-level-design',
    difficulty: index > 6 ? 'Hard' : 'Medium',
    status: 'Todo',
    favorite: false,
    prompt: `Design classes, interfaces, and interactions for ${title}.`,
    explanation:
      `Identify entities, assign responsibilities, apply SOLID principles, and model key workflows for ${title}.`,
    solutions: buildSolutions(title),
    tags: ['OOP', 'Design Patterns'],
    createdAt: new Date(Date.UTC(2026, 2, index + 1)).toISOString()
  }));
}

export const QUESTION_SEED: Question[] = [
  ...buildCodingQuestions(),
  ...buildSystemDesignQuestions(),
  ...buildLowLevelDesignQuestions()
];
