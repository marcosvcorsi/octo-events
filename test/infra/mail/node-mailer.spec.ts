import { mock, MockProxy } from 'jest-mock-extended';
import { Transporter } from 'nodemailer';

import { SendMailParams } from '@/infra/contracts/send-mail';
import { NodeMailerSendMail } from '@/infra/mail/node-mailer';

describe('NodeMailerSendMail', () => {
  let transporter: MockProxy<Transporter>;
  let params: SendMailParams;
  let nodeMailerSendMail: NodeMailerSendMail;

  beforeAll(() => {
    transporter = mock();
  });

  beforeEach(() => {
    params = {
      subject: 'any_subject',
      to: 'any_to',
      body: 'any_body',
    };

    nodeMailerSendMail = new NodeMailerSendMail(transporter);
  });

  it('should call transporter send mail with correct params', async () => {
    await nodeMailerSendMail.send(params);

    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: '"Octo Events" <no-reply@octoevents.com',
      to: params.to,
      subject: params.subject,
      html: params.body,
    });

    expect(transporter.sendMail).toHaveBeenCalledTimes(1);
  });

  it('should throw if transporter send mail throws', async () => {
    transporter.sendMail.mockRejectedValueOnce(new Error());

    await expect(nodeMailerSendMail.send(params)).rejects.toThrow();
  });
});
