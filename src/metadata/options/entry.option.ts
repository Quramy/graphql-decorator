import { Option } from './option';

export interface EntryTypeOption extends Option { }

/**
 * Arguments for a {@link Query} type on graphql schema
 */
export interface QueryOption extends EntryTypeOption { }

/**
 * Arguments for a {@link Mutation} type on graphql schema
 */
export interface MutationOption extends EntryTypeOption { }

/**
 * Arguments for a {@link Subscription} type on graphql schema
 */
export interface SubscriptionOption extends EntryTypeOption { }
