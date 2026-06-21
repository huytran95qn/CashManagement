export type Newable<
    TInstance = unknown,
    TArgs extends unknown[] = any[]
> = new (...args: TArgs) => TInstance;