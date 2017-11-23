export type BeforeMiddleware = (
  context: any,
  args: { [key: string]: any },
  next: (error?: Error, value?: any) => any,
) => Promise<any> | any;
