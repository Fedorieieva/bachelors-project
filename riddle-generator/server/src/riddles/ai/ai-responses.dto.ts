import { RiddleType } from '@prisma/client';


export interface AiRiddleResponse {
  reasoning: string;
  content: string;
  answer: string;
}

export interface RiddleIntentAnalysis {
  intent: 'NEW' | 'REFINE' | 'OFF_TOPIC' | 'INAPPROPRIATE'| 'GIVE_UP';
  type?: RiddleType;
  style?: string;
  topic?: string;
  reason?: string;
}

export interface EvaluationResult {
  is_good: boolean;
  is_safe: boolean;
  reason?: string;
}

export interface AiHintResponse {
  reasoning: string;
  content: string;
  is_solved: boolean;
}
