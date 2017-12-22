export type AfterMiddleware = (
  context: any,
  args: { [key: string]: any },
  result: Promise<any> | any,
  next: (error?: Error, value?: any) => any,
) => Promise<any> | any;
