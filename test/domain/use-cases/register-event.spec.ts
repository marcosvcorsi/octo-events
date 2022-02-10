import { mock, MockProxy } from 'jest-mock-extended';

import { SaveEventRepository } from '@/domain/contracts/repositories/save-event';
import {
  RegisterEvent,
  RegisterEventParams,
} from '@/domain/use-cases/register-event';

describe('RegisterEvent', () => {
  let saveEventRepository: MockProxy<SaveEventRepository>;
  let params: RegisterEventParams;
  let sut: RegisterEvent;

  beforeAll(() => {
    saveEventRepository = mock();
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
      externalId: 1,
    };

    sut = new RegisterEvent(saveEventRepository);
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
});
