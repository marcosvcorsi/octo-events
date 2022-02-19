import { mock, MockProxy } from 'jest-mock-extended';

import { SaveEventRepository } from '@/domain/contracts/repositories/save-event';
import { SendMailNotification } from '@/domain/contracts/send-mail-notification';
import {
  RegisterEvent,
  RegisterEventParams,
} from '@/domain/use-cases/register-event';

describe('RegisterEvent', () => {
  let saveEventRepository: MockProxy<SaveEventRepository>;
  let sendMailNotification: MockProxy<SendMailNotification>;
  let params: RegisterEventParams;
  let sut: RegisterEvent;

  beforeAll(() => {
    saveEventRepository = mock();
    sendMailNotification = mock();
  });

  beforeEach(() => {
    params = {
      action: 'any_action',
      issue: {
        url: 'any_url',
        number: 1,
      },
      repository: {
        fullName: 'any_full_name',
        id: 1,
      },
      sender: {
        id: 1,
        login: 'any_login',
      },
    };

    saveEventRepository.save.mockResolvedValue({
      ...params,
      id: 'any_id',
    });

    sut = new RegisterEvent(saveEventRepository, sendMailNotification);
  });

  it('should call SaveEventRepository save with correct params', async () => {
    await sut.execute(params);

    expect(saveEventRepository.save).toHaveBeenCalledWith(params);
    expect(saveEventRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw if SaveEventRepository save throws', async () => {
    saveEventRepository.save.mockRejectedValue(new Error('any_error'));

    await expect(sut.execute(params)).rejects.toThrow();
  });

  it('should call SendMailNotification send with correct params', async () => {
    await sut.execute(params);

    expect(sendMailNotification.send).toHaveBeenCalledWith({
      to: 'marcos.corsi@hotmail.com',
      subject: 'New event',
      body: `New event: ${params.action} ${params.repository.fullName}#${params.issue.number}`,
    });
    expect(sendMailNotification.send).toHaveBeenCalledTimes(1);
  });

  it('should return event on success', async () => {
    const result = await sut.execute(params);

    expect(result).toEqual({
      ...params,
      id: 'any_id',
    });
  });
});
