import { Event } from '../../entities/event';

export type SaveEventData = {
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
  save(data: SaveEventData): Promise<Event>;
}
