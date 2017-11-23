import { AfterMiddleware } from '../middleware';
import { AfterOption } from '../metadata';
import { getMetadataArgsStorage } from '../metadata-builder';

/**
 * Adding ability to declarative override function resolution on schemas with an implementation analog to an express middleware.
 *
 * Usage example:
 * ```
 * let middleware: AfterMiddleware = (
 *   context: any,
 *   args: { [key: string]: any },
 *   result: Promise<any> | any,
 *   next: (error?: Error, value?: any) => any
 * ): any => {
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
 *   @After(middleware)
 *   myFunction(input: number): number {
 *     return input * 2;
 *   }
 * }
 *
 * ```
 * @param option Options for an Schema
 */
export function After(option: AfterOption | AfterMiddleware) {
  return function (target: any, propertyKey: any, index: number) {
    getMetadataArgsStorage().afters.push({
      target: target,
      name: target.name || propertyKey,
      description: option && (option as AfterOption).description ? (option as AfterOption).description : null,
      index: index,
      property: propertyKey,
      middleware: option && (option as AfterOption).middleware ? (option as AfterOption).middleware : option as AfterMiddleware,
    });
  } as Function;
}
