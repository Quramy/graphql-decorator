/**
 * Arguments for an Enum type on graphql schema
 */
export interface EnumOption {
  /**
   * (Optional) Description
   */
  description?: string;
}

/**
 * Arguments for an Enum value on graphql schema
 */
export interface EnumValueOption extends EnumOption {
}
