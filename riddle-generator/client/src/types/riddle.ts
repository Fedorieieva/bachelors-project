export enum RiddleType {
  DANETKI = 'DANETKI',
  CLASSIC = 'CLASSIC',
  LOGIC = 'LOGIC',
  MATH = 'MATH',
  CROSSWORD = 'CROSSWORD',
}

export interface CrosswordWord {
  word: string;
  clue: string;
  x: number;
  y: number;
  direction: 'across' | 'down';
  number: number;
}

export interface CrosswordLayout {
  gridSize: { rows: number; cols: number };
  words: CrosswordWord[];
}

export interface CrosswordGenerateRequest {
  theme: string;
  customWords?: string[];
  language?: string;
}

export interface RiddleDetail {
  id: string;
  content: string;
  answer: string;
  type: RiddleType;
  complexity: number;
  image_url?: string | null;
  prompt_context?: Record<string, unknown> | null;
  is_solved?: boolean;
  crossword_progress?: Record<string, string> | null;
}

export const IMAGE_GENERATION_MODEL = 'pollinations-image' as const;

export interface RiddleSettings {
  type: RiddleType;
  complexity: number;
  language?: string;
  is_interactive?: boolean;
  model?: string;
  generate_image?: boolean;
  // Crossword-specific — only relevant when type === CROSSWORD
  crosswordTheme?: string;
  crosswordCustomWords?: string[];
}

export const GEMINI_MODELS = [
  { label: 'Gemini 2.5 Flash Lite', value: 'gemini-2.5-flash-lite' },
  { label: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
  { label: 'Gemini 3.1 Flash Lite', value: 'gemini-3.1-flash-lite' },
  { label: 'Gemini 3.5 Flash', value: 'gemini-3.5-flash' },
  { label: 'Gemini 3 Flash Preview', value: 'gemini-3-flash-preview' },
  { label: 'Gemini Flash (latest)', value: 'gemini-flash-latest' },
  { label: 'Pollinations AI (Image Riddle)', value: IMAGE_GENERATION_MODEL },
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
    image_url?: string;
    prompt_context?: RiddleMetadata;
    xp_earned?: number;
    model_used?: string;
    fallback_occurred?: boolean;
  };
}

export interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'model' | 'system';
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