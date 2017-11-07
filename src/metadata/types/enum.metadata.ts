import { Metadata } from './metadata';

export interface EnumValueMetadata extends Metadata {
  value?: any;
}

export interface EnumTypeMetadata extends Metadata {
  values: EnumValueMetadata[];
}
