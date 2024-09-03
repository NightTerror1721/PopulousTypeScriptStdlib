import "./PopModules";
declare const _IntegerType: unique symbol;
type Opaque<T, K> = T & {
    [_IntegerType]: K;
};
export type integer = Opaque<number, "Int">;
/** @noSelf */
export declare namespace IMath {
    function isInteger(n: number): n is integer;
    function toInteger(n: number): number;
    function imax(a: number, b: number): number;
    function imin(a: number, b: number): number;
    function inatural(n: number): number;
    function iclamp(n: number, min: number, max: number): number;
}
export {};
