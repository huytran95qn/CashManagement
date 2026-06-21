import { Newable } from "../DI/newAble";

export class InjectionToken<T = any> {
    constructor(
        public readonly description: string,
        private _implementation?: Newable<T>
    ) {}

    public get implementation(): Newable<T> | undefined {
        return this._implementation;
    }

    public withImplementation(impl: new (...args: any[]) => T): this {
        this._implementation = impl;
        return this;
    }
}