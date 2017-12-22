import { BeforeMiddleware } from '../middleware';
import { BeforeOption } from '../metadata';
import { getMetadataArgsStorage } from '../metadata-builder';

/**
 * Adding ability to declarative override function resolution on schemas with an implementation analog to an express middleware.
 *
 * Usage example:
 * ```
 * let middleware: BeforeMiddleware = (context: any, args: { [key: string]: any }, next: (error?: Error, value?: any) => any): any => {
 *   if(context.user.role != 'any role') {
 *     // can use context and resolve/return value as `1000`, for example, regardless of what resolve function actually implements
 *     next(null, 1000);
 *   } else {
 *     // keeps regular resolution flow
 *     next();
 *   }
 * };
 *
 * ...
 *
 * class ObjType {
 *   @Field()
 *   @Before(middleware)
 *   myFunction(input: number): number {
 *     return input * 2;
 *   }
 * }
 *
 * ```
 * @param option Options for an Schema
 */
export function Before(option: BeforeOption | BeforeMiddleware) {
  return function (target: any, propertyKey: any, index: number) {
    getMetadataArgsStorage().befores.push({
      target: target,
      name: target.name || propertyKey,
      description: option && (option as BeforeOption).description ? (option as BeforeOption).description : null,
      index: index,
      property: propertyKey,
      middleware: option && (option as BeforeOption).middleware ? (option as BeforeOption).middleware : option as BeforeMiddleware,
    });
  } as Function;
}
