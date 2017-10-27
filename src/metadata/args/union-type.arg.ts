export interface UnionTypeArgs {
  target: any;
  name: string;
  types: any[];
  description?: string;
  resolver: (obj: any, context: any, info: any) => Promise<string> | string | null;
}
