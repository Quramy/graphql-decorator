import { Metadata } from './metadata';

export interface InterfaceTypeMetadata extends Metadata {
    resolver: (obj: any, context: any, info: any) => Promise<string> | string | null;
}
