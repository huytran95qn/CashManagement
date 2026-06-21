import "reflect-metadata";
import { Container } from "inversify"
import { INJECT_KEY } from "./injectKey";
import { Newable } from "./newAble";
import { InjectionToken } from "../Decorators/InjectToken";

class DIContainer {
    private readonly container = new Container();

    public get<T>(token: Newable<T>): T;
    public get<T>(token: InjectionToken<T>): T
    public get<T>(token: any): T {
        if (!this.container.isBound(token)) {
            this.bind<T>(token);
        }

        if (this.isInjectionToken(token)) {
            return this.container.get<T>(token.description);
        }

        return this.container.get<T>(token);
    }

    public bind<T>(token: InjectionToken<T>, implementation: Newable<T>): void;
    public bind<T>(token: Newable<T>): void;
    public bind<T>(token: any, implementation?: Newable<T>): void {
        if (this.isInjectionToken(token)) {
            const injectToken = token as InjectionToken<T>;

            if (this.container.isBound(injectToken.description)) {
                return;
            }

            if (token.implementation == null) {
                throw new Error(`No implementation provided for token: ${token.description}`);
            }

            this.container.bind<T>(token.description).toConstantValue(
                this.resolveDependencies(token.implementation as Newable<T>)
            );
        } else if (typeof token === "function") {
            const newAbleToken = token as Newable<T>;

            this.container.bind<T>(newAbleToken).toConstantValue(
                this.resolveDependencies(implementation == null ? newAbleToken : implementation)
            );
        }
    }

    public unbind<T>(identifier: InjectionToken<T>): void;
    public unbind<T>(identifier: Newable<T>): void;
    public unbind<T>(identifier: any): void {
        if (this.isInjectionToken(identifier)) {
            this.container.unbind(identifier.description);
            return;
        }
        
        if (this.container.isBound(identifier)) {
            this.container.unbind(identifier);
        }
    }

    public unbindAll(): void {
        this.container.unbindAll();
    }

    private resolveDependencies<T>(identifier: Newable<T>): T {
        const params: Newable<T>[] = Reflect.getMetadata(INJECT_KEY, identifier) || [];
        
        return new identifier(...params.map(param => this.get(param)));
    }

    private isInjectionToken<T>(token: any): token is InjectionToken<T> {
        return token instanceof InjectionToken;
    }
}

export const defaultDIStorage = new DIContainer();