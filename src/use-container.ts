import { IoCContainer } from './ioc-container';

/**
 *  Sets the IoC container to be used in order to instantiate the decorated classes
 * @param container A [typedi]{@link https://github.com/pleerock/typedi} container
 */
export function useContainer(container: any): void {
  IoCContainer.INSTANCE = container;
}
