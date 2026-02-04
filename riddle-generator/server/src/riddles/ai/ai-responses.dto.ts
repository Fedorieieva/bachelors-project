import { RiddleType } from '../dto/riddle-settings.dto';


export interface AiRiddleResponse {
  content: string;
  answer: string;
}

export interface RiddleIntentAnalysis {
  intent: 'NEW' | 'REFINE' | 'OFF_TOPIC' | 'INAPPROPRIATE';
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
  content: string;
}
