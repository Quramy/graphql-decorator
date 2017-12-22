import { Argument } from './argument';

export enum EntryType {
  Query         = <any>'Query',
  Mutation      = <any>'Mutation',
  Subscription  = <any>'Subscription',
}

export interface EntryTypeArg extends Argument {
  type: EntryType;
  property: string;
}
