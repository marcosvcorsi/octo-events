import BullQueue, { Queue } from 'bull';
import { mocked } from 'jest-mock';
import { mock, MockProxy } from 'jest-mock-extended';

import { SendMailNotificationBull } from '@/infra/bull/send-mail-notification';
import { SendMail, SendMailParams } from '@/infra/contracts/send-mail';

jest.mock('bull');

describe('SendMailNotificationBull', () => {
  let fakeBullQueue: MockProxy<Queue<SendMailParams>>;
  let sendMail: MockProxy<SendMail>;
  let params: SendMailParams;
  let sendMailNotificationBull: SendMailNotificationBull;

  beforeAll(() => {
    sendMail = mock();
    fakeBullQueue = mock();

    mocked(BullQueue).mockImplementation(() => fakeBullQueue);
  });

  beforeEach(() => {
    params = {
      subject: 'any_subject',
      to: 'any_to',
      body: 'any_body',
    };

    sendMailNotificationBull = new SendMailNotificationBull(sendMail);
  });

  describe('send', () => {
    it('should call BullQueue add with correct and default params', async () => {
      await sendMailNotificationBull.send(params);

      expect(fakeBullQueue.add).toHaveBeenCalledWith(params, { attempts: 3 });
    });

    it('should call BullQueue add with correct and custom attempts params', async () => {
      const attempts = 5;

      sendMailNotificationBull = new SendMailNotificationBull(
        sendMail,
        attempts,
      );

      await sendMailNotificationBull.send(params);

      expect(fakeBullQueue.add).toHaveBeenCalledWith(params, { attempts: 5 });
    });

    it('should throw if BullQueue add with throws', async () => {
      fakeBullQueue.add.mockRejectedValueOnce(new Error());

      await expect(sendMailNotificationBull.send(params)).rejects.toThrow();
    });
  });

  describe('process', () => {
    it('should call sendMail with correct params', async () => {
      await sendMailNotificationBull.process({
        data: params,
      } as BullQueue.Job);

      expect(sendMail.send).toHaveBeenCalledWith(params);
    });

    it('should throw if sendMail throws', async () => {
      sendMail.send.mockRejectedValueOnce(new Error());

      await expect(
        sendMailNotificationBull.process({
          data: params,
        } as BullQueue.Job),
      ).rejects.toThrow();
    });
  });
});
