export interface UnionTypeMetadata {
    name: string;
    description?: string;
    types: any[];
    resolver: (obj: any, context: any, info: any) => Promise<string> | string | null;
}
