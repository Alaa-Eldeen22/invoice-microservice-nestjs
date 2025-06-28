import { DomainEvent } from 'src/domain/events/DomainEvent';

export abstract class EventBus {
  abstract publish(events: DomainEvent[]): Promise<void>;
}
