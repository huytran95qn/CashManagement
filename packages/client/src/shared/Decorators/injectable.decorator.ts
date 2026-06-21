import { DESIGN_PARAM_TYPES } from "../DI/injectKey";
import { InjectionToken } from "./InjectToken";

export function Injectable(type?: "singleton" | "viewModel") {
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
        const params = Reflect.getMetadata(
            DESIGN_PARAM_TYPES,
            constructor
        ) as Array<InjectionToken<any>>;

        Reflect.defineMetadata(
            DESIGN_PARAM_TYPES,
            [
                ...params,
                type ?? "singleton"
            ],
            constructor
        );

        return constructor;
    };
}