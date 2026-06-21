import { Newable } from "../DI/newAble";
import { INJECT_KEY } from "../DI/injectKey";
import { InjectionToken } from "./InjectToken";

export function Inject<T>(
    token: Newable<T>
): (target: object, propertyKey?: string | symbol, parameterIndex?: number) => void;
export function Inject<T>(
    token: InjectionToken<T>
): (target: object, propertyKey?: string | symbol, parameterIndex?: number) => void;
export function Inject<T>(
    token: any
): (target: object, propertyKey?: string | symbol, parameterIndex?: number) => void {
    return (
        target: object,
        _propertyKey?: string | symbol,
        parameterIndex?: number
    ) => {
        if (parameterIndex == null) {
            throw new Error("@Inject decorator can only be used on constructor parameters.");
        }
        
        const params = Reflect.getMetadata(INJECT_KEY, target) ?? [];
        params[parameterIndex] = token;
        Reflect.defineMetadata(INJECT_KEY, params, target);
    }
}