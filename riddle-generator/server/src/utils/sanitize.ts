export const sanitize = (text: string) => text.replace(/<[^>]*>?/gm, '').trim();
