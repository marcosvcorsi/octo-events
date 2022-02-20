import { Transporter } from 'nodemailer';

import { SendMail, SendMailParams } from '../contracts/send-mail';

export class NodeMailerSendMail implements SendMail {
  constructor(private readonly transporter: Transporter) {}

  async send({ to, body, subject }: SendMailParams): Promise<void> {
    return this.transporter.sendMail({
      from: '"Octo Events" <no-reply@octoevents.com',
      to,
      subject,
      html: body,
    });
  }
}
