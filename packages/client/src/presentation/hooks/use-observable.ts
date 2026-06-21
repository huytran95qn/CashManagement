import { useEffect, useState } from "react";
import { distinctUntilChanged, Observable, Subject, takeUntil } from "rxjs";

export function useObservable<T>(instance: Observable<T>) {
    const [value, setValue] = useState<T>();

    useEffect(() => {
        const destroy$ = new Subject<void>();

        instance.pipe(
            distinctUntilChanged(),
            takeUntil(destroy$)
        ).subscribe(d => setValue(d))
    }, [instance])

    return value
}