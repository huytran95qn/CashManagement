import { Newable } from "inversify";
import { InjectionToken } from "../Decorators/InjectToken";
import { defaultDIStorage } from "./DIContainer";

export function bindInstance<T>(
    identifier: InjectionToken<T>
): void;
export function bindInstance<T>(
    identifier: Newable<T>
): void;
export function bindInstance<T>(
    identifier: any
): void {
    defaultDIStorage.bind(identifier);
}