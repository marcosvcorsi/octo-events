/* eslint-disable indent */
import { ArgsType, Field, ID, InputType, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Issue {
  @Field()
  number: number;

  @Field()
  url: string;
}

@InputType()
export class IssueInput {
  @Field()
  number: number;

  @Field()
  url: string;
}

@ObjectType()
export class Repository {
  @Field()
  id: number;

  @Field()
  fullName: string;
}

@InputType()
export class RepositoryInput {
  @Field()
  id: number;

  @Field()
  fullName: string;
}

@ObjectType()
export class Sender {
  @Field()
  id: number;

  @Field()
  login: string;
}

@InputType()
export class SenderInput {
  @Field()
  id: number;

  @Field()
  login: string;
}

@ObjectType()
export class Event {
  @Field(() => ID)
  id: string;

  @Field()
  action: string;

  @Field(() => Issue)
  issue: Issue;

  @Field(() => Repository)
  repository: Repository;

  @Field(() => Sender)
  sender: Sender;

  @Field()
  externalId: number;
}

@ArgsType()
export class EventsArgs {
  @Field(() => Int)
  issueNumber: number;
}

@InputType()
export class SaveEventInput {
  @Field()
  id: number;

  @Field()
  action: string;

  @Field(() => IssueInput)
  issue: IssueInput;

  @Field(() => RepositoryInput)
  repository: RepositoryInput;

  @Field(() => SenderInput)
  sender: SenderInput;
}
