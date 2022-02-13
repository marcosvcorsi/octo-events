import { container } from 'tsyringe';
import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';

import { adaptGraphqlRouter } from '@/main/adapters/graphql';

import { Event, EventsArgs, SaveEventInput } from '../schema/event';

@Resolver()
export class EventResolver {
  @Mutation(() => Event)
  async saveEvent(@Arg('input') input: SaveEventInput): Promise<Event> {
    const result = await adaptGraphqlRouter(
      container.resolve('RegisterEventController'),
      input,
    );

    return result;
  }

  @Query(() => [Event])
  async events(@Args() args: EventsArgs): Promise<Event[]> {
    const result = await adaptGraphqlRouter(
      container.resolve('FindIssueEventsController'),
      args,
    );

    return result;
  }
}
