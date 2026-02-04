import { RiddleMetadata } from './riddle-persistence.dto';


export enum ChatResponseType {
  NEW_RIDDLE = 'NEW_RIDDLE',
  REFINE_RIDDLE = 'REFINE_RIDDLE',
  SYSTEM_MESSAGE = 'SYSTEM_MESSAGE',
}

export interface ChatResponseDto {
  type: ChatResponseType;
  data: {
    content: string;
    answer?: string;
    prompt_context?: RiddleMetadata;
  };
}
