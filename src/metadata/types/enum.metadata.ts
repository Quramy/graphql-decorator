export interface EnumValueMetadata {
  target: any;
  name: string;
  value?: any;
  description?: string;
}

export interface EnumTypeMetadata {
  target: any;
  name: string;
  description?: string;
  values: EnumValueMetadata[];
}
