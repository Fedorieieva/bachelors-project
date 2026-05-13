export enum RiddleType {
  DANETKI = 'DANETKI',
  CLASSIC = 'CLASSIC',
  LOGIC = 'LOGIC',
  MATH = 'MATH',
}

export interface RiddleSettings {
  type: RiddleType;
  complexity: number;
  language: 'ukrainian' | 'english' | 'spanish' | 'french' | 'german';
  is_interactive?: boolean;
  model?: string;
}

export const GEMINI_MODELS = [
  { label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash' },
  { label: 'Gemini 2.0 Flash Lite', value: 'gemini-2.0-flash-lite' },
  { label: 'Gemini 2.5 Flash Lite', value: 'gemini-2.5-flash-lite' },
  { label: 'Gemini Flash (latest)', value: 'gemini-flash-latest' },
  { label: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro' },
  { label: 'Gemini 2.0 Flash Exp', value: 'gemini-2.0-flash-exp' },
] as const;

export interface RiddleMetadata {
  message: string;
  complexity: number;
  language: string;
  type: RiddleType;
  style: string;
}

export enum ChatResponseType {
  NEW_RIDDLE = 'NEW_RIDDLE',
  REFINE_RIDDLE = 'REFINE_RIDDLE',
  SYSTEM_MESSAGE = 'SYSTEM_MESSAGE',
}

export interface ChatResponse {
  type: ChatResponseType;
  data: {
    content: string;
    answer?: string;
    prompt_context?: RiddleMetadata;
    xp_earned?: number;
    model_used?: string;
    fallback_occurred?: boolean;
  };
}

export interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'model';
  content: string;
  is_initial: boolean;
  createdAt: string;
}

export interface SolveResult {
  success: boolean;
  message: string;
  answer?: string;
  remaining_attempts?: number;
  is_blocked?: boolean;
  xp_earned?: number;
}

export interface RiddleAttempt {
  id: string;
  user_id: string;
  riddle_id: string;
  attempts: number;
  last_try: string;
  is_blocked: boolean;
}

export interface XpTransactionResponse {
  success: boolean;
  new_xp_balance?: number;
  hint?: string;
}

export interface ToggleResponse {
  saved?: boolean;
  is_public?: boolean;
  message?: string;
}

export interface SavedRiddle {
  id: string;
  content: string;
  answer: string;
  prompt_context: RiddleMetadata;
  is_public: boolean;
  is_verified: boolean;
  likes_count: number;
  comments_count: number;
  author_id: string;
  created_at: string;
}