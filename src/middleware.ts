export type Middleware = (context: any, args: { [key: string]: any }, next: (error?: Error, value?: any) => any) => Promise<any> | any;

export type AfterMiddleware = (
  context: any,
  args: { [key: string]: any },
  result: Promise<any> | any,
  next: (error?: Error, value?: any) => any,
) => Promise<any> | any;
