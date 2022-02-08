type Issue = {
  number: number;
  url: string;
};

type Repository = {
  id: number;
  fullName: string;
};

type Sender = {
  id: number;
  login: string;
};

export type Event = {
  action: string;
  issue: Issue;
  repository: Repository;
  sender: Sender;
};
