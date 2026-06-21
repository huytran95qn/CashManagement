import { Observable, from, switchMap, throwError } from "rxjs";

export interface IHttpRequest {
    get<T>(url: string): Observable<T>
    post<T>(url: string, body?: unknown): Observable<T>
    patch<T>(url: string, body?: unknown): Observable<T>
    delete(url: string): Observable<void>
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
        return this.request<T>(url, "GET");
    }

    public post<T>(url: string, body?: unknown): Observable<T> {
        return this.request<T>(url, "POST", body);
    }

    public patch<T>(url: string, body?: unknown): Observable<T> {
        return this.request<T>(url, "PATCH", body);
    }

    public delete(url: string): Observable<void> {
        return this.request<void>(url, "DELETE");
    }

    private request<T>(url: string, method: string, body?: unknown): Observable<T> {
        return from(fetch(`${this.base}${url}`, {
            method,
            headers: body == null ? undefined : { "Content-Type": "application/json" },
            body: body == null ? undefined : JSON.stringify(body),
        })).pipe(
            switchMap(res => {
                if (!res.ok) {
                    return from(res.text()).pipe(
                        switchMap(text => throwError(() => new Error(`HTTP ${res.status}: ${text}`)))
                    );
                }

                if (res.status === 204) {
                    return from(Promise.resolve(undefined as T));
                }

                const contentType = res.headers.get("content-type") ?? "";
                if (contentType.includes("application/json")) {
                    return from(res.json() as Promise<T>);
                }

                return from(Promise.resolve(undefined as T));
            })
        );
    }
}