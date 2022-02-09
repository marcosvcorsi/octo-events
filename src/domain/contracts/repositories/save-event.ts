import { Event } from '../../entities/event';

export type SaveEventParams = {
  id: number;
  action: string;
  issue: {
    number: number;
    url: string;
  };
  repository: {
    id: number;
    fullName: string;
  };
  sender: {
    id: number;
    login: string;
  };
};

export interface SaveEventRepository {
  save(params: SaveEventParams): Promise<Event>;
}
