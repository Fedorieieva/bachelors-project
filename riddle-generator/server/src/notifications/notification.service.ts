import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  // constructor(
  //   private mailerService: MailerService,
  //   @InjectRepository(Subscription)
  //   private subscriptionRepo: Repository<Subscription>,
  //   private configService: ConfigService,
  //   private stripeService: StripeService,
  // ) {}
  //
  // async sendBillingNotification(
  //   user: User,
  //   title: string,
  //   message: string,
  //   amount: number = 0,
  //   currency: string = 'USD',
  //   template: string = 'billing-notification',
  //   extraContext?: Record<string, any>,
  // ): Promise<void> {
  //   try {
  //     const context = {
  //       title,
  //       message,
  //       amount: amount.toFixed(2),
  //       currency: currency.toUpperCase(),
  //       userName: user.name || 'User',
  //       appName: 'Lullaby App',
  //       ...extraContext,
  //     };
  //
  //     await this.mailerService.sendMail({
  //       to: user.email,
  //       subject: title,
  //       template: `./${template}`,
  //       context,
  //     });
  //
  //     this.logger.log(`Billing notification sent to ${!user.email}: ${title}`);
  //   } catch (error: any) {
  //     this.logger.error(`Failed to send email to ${!user.email}: ${error.message}`, error.stack);
  //   }
  // }
  //
  // async sendPaymentReminder(
  //   user: User,
  //   title: string,
  //   message: string,
  //   dueDate: Date,
  //   amount: number,
  //   currency: string,
  // ): Promise<void> {
  //   const reminderMessage = `${message} Due: ${dueDate.toLocaleDateString()}. Amount: ${amount.toFixed(2)} ${currency.toUpperCase()}.`;
  //   await this.sendBillingNotification(
  //     user,
  //     title,
  //     reminderMessage,
  //     amount,
  //     currency,
  //     'payment-reminder',
  //   );
  // }
  //
  // async sendWelcomeSubscription(user: User, plan: string): Promise<void> {
  //   const title = 'Welcome to Your Subscription!';
  //   const message = `Thank you for subscribing to the **${plan}** plan. Enjoy unlimited personalized lullabies and fairy tales!`;
  //   await this.sendBillingNotification(user, title, message, 0, 'USD', 'welcome-subscription');
  // }
  //
  // async sendRenewalReminder(user: User, plan: string, endDate: Date): Promise<void> {
  //   const title = 'Your Subscription is Renewing Soon';
  //   const formattedDate = endDate.toLocaleDateString('en-US', {
  //     weekday: 'long',
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //   });
  //
  //   await this.sendBillingNotification(user, title, '', 0, 'USD', 'renewal-reminder', {
  //     plan,
  //     endDate: formattedDate,
  //   });
  // }
  //
  // async sendOverdueReminder(
  //   user: User,
  //   amount: number,
  //   currency: string,
  //   plan: string,
  // ): Promise<void> {
  //   const title = 'Action Required: Payment Overdue';
  //   const message = `Your payment of **${amount.toFixed(2)} ${currency.toUpperCase()}** is overdue. Please update your payment method to avoid service interruption.`;
  //   await this.sendBillingNotification(user, title, message, amount, currency, 'payment-overdue', {
  //     plan,
  //   });
  // }
  //
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // async sendDailyPaymentReminders(): Promise<void> {
  //   this.logger.log('Running daily payment reminders...');
  //
  //   const overdueSubs = await this.subscriptionRepo.find({
  //     where: {
  //       status: In(['past_due', 'unpaid']),
  //       stripe_subscription_id: Not(IsNull()),
  //     },
  //     relations: ['user'],
  //   });
  //
  //   for (const sub of overdueSubs) {
  //     if (!sub.user?.email || !sub.stripe_subscription_id) continue;
  //
  //     let overdueAmount = 0;
  //     let currency = 'usd';
  //
  //     try {
  //       const invoice = await this.stripeService.retrieveLatestInvoice(sub.stripe_subscription_id);
  //
  //       if (invoice.status === 'open') {
  //         overdueAmount = invoice.amount_due / 100;
  //         currency = invoice.currency;
  //       }
  //
  //       if (overdueAmount > 0) {
  //         await this.sendOverdueReminder(sub.user, overdueAmount, currency, sub.plan);
  //       }
  //     } catch (error: any) {
  //       this.logger.error(`Failed to get overdue amount for sub ${sub.id}: ${error.message}`);
  //     }
  //   }
  //
  //   const threeDaysFromNow = addDays(new Date(), 3);
  //   const renewSoonSubs = await this.subscriptionRepo.find({
  //     where: {
  //       status: 'active',
  //       end_date: LessThanOrEqual(threeDaysFromNow),
  //     },
  //     relations: ['user'],
  //   });
  //
  //   for (const sub of renewSoonSubs) {
  //     if (!sub.user?.email || !sub.end_date) continue;
  //
  //     const daysLeft = Math.ceil(
  //       (sub.end_date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  //     );
  //     if (daysLeft !== 3) continue;
  //
  //     await this.sendRenewalReminder(sub.user, sub.plan, sub.end_date);
  //   }
  //
  //   this.logger.log(
  //     `Daily reminders completed. Overdue: ${overdueSubs.length}, Renew soon: ${renewSoonSubs.length}`,
  //   );
  // }
  //
  // async sendSubscriptionCanceled(user: User, plan: string): Promise<void> {
  //   const title = 'Your Subscription Has Been Canceled';
  //
  //   await this.sendBillingNotification(user, title, '', 0, 'USD', 'subscription-canceled', {
  //     plan: plan.charAt(0).toUpperCase() + plan.slice(1),
  //   });
  // }
}
