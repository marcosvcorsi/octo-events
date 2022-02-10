export type Event = {
  id: string;
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
  externalId: number;
};
