import { Signal } from "@preact/signals-core";
export { isObservable } from "nu-observables";
export declare const graph: import("nu-observables").Graph;
export declare type PreactObservable<T> = T extends Function ? T : T extends Map<infer K, infer V> ? Map<K, PreactObservable<V>> : T extends Array<infer V> ? Array<PreactObservable<V>> : T extends Set<infer V> ? Set<PreactObservable<V>> : T extends WeakSet<infer V> ? WeakSet<PreactObservable<V>> : T extends WeakMap<infer K, infer V> ? WeakMap<K, PreactObservable<V>> : {
    [key in keyof T]: T[key] extends object ? PreactObservable<T[key]> : T[key];
} & {
    readonly [key in keyof T as T[key] extends object ? never : `$${string & key}`]?: Signal<T[key]>;
};
export declare function observable<T>(obj: T): PreactObservable<T>;
export declare function source<T>(obj: PreactObservable<T> | T): T;
export declare class Observable {
    constructor();
}
export declare function reportChanged<T extends object>(obj: T): T;
export declare function reportObserved<T extends object>(obj: T, opts?: {
    deep?: boolean;
}): T;
export declare function getSignal<T extends object>(obj: T, key: keyof T): Signal<T[keyof T]>;
