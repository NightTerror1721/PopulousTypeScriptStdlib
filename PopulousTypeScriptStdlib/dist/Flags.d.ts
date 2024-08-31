/** @noSelfInFile */
export declare namespace Flags {
    function set(base: number, values: number): number;
    function setBit(base: number, bitIdx: number): number;
    function clear(base: number, values: number): number;
    function clearBit(base: number, bitIdx: number): number;
    function isSet(base: number, flags: number): boolean;
    function isBitSet(base: number, bitIdx: number): boolean;
}
