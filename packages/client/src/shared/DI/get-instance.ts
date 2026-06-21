import { Newable } from "./newAble";
import { defaultDIStorage } from "./DIContainer";
import { InjectionToken } from "../Decorators/InjectToken";

export function getInstance<T>(
    identifier: InjectionToken<T>
): T;
export function getInstance<T>(
    identifier: Newable<T>
): T;
export function getInstance<T>(
    identifier: any
): T {
    const instance = defaultDIStorage.get(identifier);

    if (!instance) {
        throw new Error(`No binding found for identifier: ${identifier.name}`);
    }

    return instance as T
}