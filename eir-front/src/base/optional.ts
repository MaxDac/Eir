export interface Optional<T> {
    isSome: boolean;
    get(): T;
}

export class Some<T> implements Optional<T> {
    constructor(private value: T) {}
    isSome = true;
    get() { return this.value; }
}

export class None<Q> implements Optional<Q> {
    isSome = false;
    get() { throw Error('Property does not exists'); return (null as unknown) as Q }
}

export class Optionals {
    static unit<T>(el: T) { return new Some(el); }

    private static switchSome<T, Q>(
        ifSome: (el: Some<T>) => Q,
        ifNone: (el: None<T>) => Q,
        o: Optional<T>): Q {
        if (o.isSome) {
            return ifSome(o as Some<T>);
        }
        else {
            return ifNone(o as None<T>);
        }
    }

    static flatMap<T, Q>(f: (e: T) => Optional<Q>): (o: Optional<T>) => Optional<Q> {
        return (oo: Optional<T>) => {
            return this.switchSome<T, Optional<Q>>(
                s => f(s.get()),
                _ => new None<Q>(),
                oo
            );
        }
    }

    static map<T, Q>(f: (e: T) => Q): (o: Optional<T>) => Optional<Q> {
        return this.flatMap(o => Optionals.unit(f(o)));
    }
}
