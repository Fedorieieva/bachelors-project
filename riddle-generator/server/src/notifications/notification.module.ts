import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const isTest = process.env.NODE_ENV === 'test' || config.get('IS_TEST') === 'true';
        return {
          transport: isTest
            ? {
                // Логування замість відправлення
                jsonTransport: true, // Запис email у JSON (запише у консоль/файл)
              }
            : {
                host: 'smtp.sendgrid.net',
                port: 587,
                secure: false,
                auth: {
                  user: 'apikey',
                  pass: config.get('SENDGRID_API_KEY'),
                },
              },
          defaults: {
            from: `"Lullaby App" <${config.get('MAIL_FROM') ?? 'no-reply@lullaby.app'}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
