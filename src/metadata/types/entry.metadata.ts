import { DefaultMetadata } from './default.metadata';

export interface EntryTypeMetadata extends DefaultMetadata {
  property: string;
  isSubscription: boolean;
}
