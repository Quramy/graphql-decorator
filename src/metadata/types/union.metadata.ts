import { DefaultMetadata } from './default.metadata';

export interface UnionTypeMetadata extends DefaultMetadata {
    types: any[];
    resolver: (obj: any, context: any, info: any) => Promise<string> | string | null;
}
