import { UnionTypeMetadata } from '../metadata/types/union.metadata';

const unionMetadata: UnionTypeMetadata[] = [];

const MetadataStorage = {

    addUnionMetadata: function(metadata: UnionTypeMetadata) {
        unionMetadata.push(metadata);
    },
    getUnionMetadata: function(): UnionTypeMetadata[] {
        return unionMetadata;
    },
    containsUnionMetadata: function(name: string) {
      return unionMetadata.some(metadata => metadata.name === name);
    },
};

export { MetadataStorage };
