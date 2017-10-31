import { IoCContainer } from '../ioc-container';

/**
 *  Sets the IoC container to be used in order to instantiate the decorated class
 *
 * @param container a [typedi]{@link https://github.com/pleerock/typedi} container
 */
export function UseContainer(container: any) {
  return function (target: Function) {
      IoCContainer.INSTANCE = container;
  };
}
