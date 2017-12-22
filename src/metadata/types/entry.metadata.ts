import { Metadata } from './metadata';

export interface EntryTypeMetadata extends Metadata {
  property: string;
  isSubscription: boolean;
}
