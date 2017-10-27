import { DefaultMetadata } from './default.metadata';

export interface EnumValueMetadata extends DefaultMetadata {
  value?: any;
}

export interface EnumTypeMetadata extends DefaultMetadata {
  values: EnumValueMetadata[];
}
