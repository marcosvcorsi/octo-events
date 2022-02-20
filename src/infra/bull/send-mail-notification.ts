import BullQueue, { Queue } from 'bull';

import {
  SendMailNotification,
  SendMailNotificationParams,
} from '@/domain/contracts/send-mail-notification';

import { SendMail } from '../contracts/send-mail';

export class SendMailNotificationBull implements SendMailNotification {
  private sendMailQueue: Queue<SendMailNotificationParams>;

  constructor(
    private readonly sendMail: SendMail,
    private readonly attempts = 3,
  ) {
    this.sendMailQueue = new BullQueue('sendMailNotification');

    this.sendMailQueue.process(this.process.bind(this));
  }

  async process(job: BullQueue.Job<SendMailNotificationParams>): Promise<void> {
    return this.sendMail.send(job.data);
  }

  async send(params: SendMailNotificationParams): Promise<void> {
    await this.sendMailQueue.add(params, { attempts: this.attempts });
  }
}
