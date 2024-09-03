import "./PopModules"

declare const _IntegerType: unique symbol

type Opaque<T, K> = T & { [_IntegerType]: K };
export type integer = Opaque<number, "Int">

/** @noSelf */
export namespace IMath
{
    export function isInteger(n: number): n is integer { return Number.isInteger(n) }
    export function toInteger(n: number): number { return Math.floor(n) }

    export function imax(a: number, b: number): number { return toInteger(Math.max(a, b)) }
    export function imin(a: number, b: number): number { return toInteger(Math.min(a, b)) }

    export function inatural(n: number): number { return imax(0, n) }

    export function iclamp(n: number, min: number, max: number): number
    {
        return toInteger(Math.max(min, Math.min(max, n)))
    }
}
