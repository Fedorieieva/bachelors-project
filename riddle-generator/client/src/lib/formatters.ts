import { Message } from '../types/riddle';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return dateString;

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const parseMessageContent = (msg: Message): string => {
  if (msg.is_initial && msg.role === 'model') {
    try {
      const parsed = JSON.parse(msg.content);
      return parsed.content || msg.content;
    } catch {
      return msg.content;
    }
  }
  return msg.content;
};