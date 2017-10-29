import { Metadata } from './metadata';

export interface UnionTypeMetadata extends Metadata {
    types: any[];
    resolver: (obj: any, context: any, info: any) => Promise<string> | string | null;
}
