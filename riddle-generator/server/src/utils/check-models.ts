import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

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
        const name = model.name.replace('models/', '');
        console.log(`--> ${name}`);
        console.log(`   Методи: ${model.supportedGenerationMethods.join(', ')}`);
        console.log(`   Опис: ${model.description}\n`);
      }
    });
  } catch (error: any) {
    console.error('Помилка:', error.message);
  }
}

listAvailableModels();
