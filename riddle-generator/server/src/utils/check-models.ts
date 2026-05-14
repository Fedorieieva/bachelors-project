import * as dotenv from 'dotenv';

dotenv.config();

const sanitizeLog = (value: string): string =>
  String(value).replaceAll('\r', '').replaceAll('\n', '');

async function listAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('Помилка: GEMINI_API_KEY не знайдено в .env');
    return;
  }

  try {
    console.log('🔍 Запит до API для отримання списку моделей...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );

    const data = (await response.json()) as any;

    if (data.error) {
      throw new Error(data.error.message);
    }

    console.log('\n--- Доступні вам моделі ---');

    data.models.forEach((model: any) => {
      if (model.supportedGenerationMethods.includes('generateContent')) {
        const name = sanitizeLog(model.name.replace('models/', ''));
        const methods = sanitizeLog(model.supportedGenerationMethods.join(', '));
        const description = sanitizeLog(String(model.description ?? '').trim());
        console.log(`--> ${name}`);
        console.log(`   Методи: ${methods}`);
        console.log(`   Опис: ${description}\n`);
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Помилка:', sanitizeLog(message));
  }
}

listAvailableModels();
