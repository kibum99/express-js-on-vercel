import type { ReactNode } from 'react';

export interface ChecklistItem {
  id: string;
  text: string;
}

export interface Review {
  id: string;
  name: string;
  age: number;
  petType: 'dog' | 'cat';
  tag: string;
  tagColor: 'gold' | 'green' | 'blue';
  title: string;
  content: string;
}

export interface Feature {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
}

export interface DiffPoint {
  id: string;
  title: string;
  description: string;
  benefit: string;
}

export interface ProblemItem {
  id: string;
  text: string;
}

export interface ExampleData {
  name: string;
  breed: string;
  birthDate: string;
  analysis: string[];
  tips: string[];
}

export interface ReportCategory {
  id: string;
  title: string;
  questions: string[];
}

export interface ComparisonRow {
  label: string;
  existing: string;
  ours: string;
}
