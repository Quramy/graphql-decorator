import { Metadata } from './metadata';
import { InterfaceTypeMetadata } from './interface.metadata';

export interface ObjectTypeMetadata extends Metadata {
  isInput: boolean;
  interfaces: InterfaceTypeMetadata[];
}
