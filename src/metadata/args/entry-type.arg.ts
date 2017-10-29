import { DefaultArg } from './default.arg';

export enum EntryType {
  Query         = <any>'Query',
  Mutation      = <any>'Mutation',
  Subscription  = <any>'Subscription',
}

export interface EntryTypeArg extends DefaultArg {
  type: EntryType;
  property: string;
}
