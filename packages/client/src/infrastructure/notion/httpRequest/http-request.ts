import { Observable, from, switchMap, throwError } from "rxjs";

export interface IHttpRequest {
    get<T>(url: string): Observable<T>
}

export class HttpRequest implements IHttpRequest {
    private get base(): string {
        const url = import.meta.env.VITE_API_BASE_URL;

        if (url) {
            return url.replace(/\/$/, "");
        }

        throw new Error("Missing setup env base");
    }

    public get<T>(url: string): Observable<T> {
        return from(fetch(`${this.base}${url}`)).pipe(
            switchMap(res => {
                if (res.ok) {
                    return from(res.json())
                }

                return from(res.text()).pipe(
                    switchMap(text => throwError(() => new Error(`HTTP ${res.status}: ${text}`)))
                );
            })
        );
    }
}