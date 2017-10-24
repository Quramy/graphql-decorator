import { UnionTypeMetadata } from './metadatas';

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

export default MetadataStorage;
