/** @noSelfInFile */

export namespace Flags
{
    export function set(base: number, values: number) { return base | values }

    export function setBit(base: number, bitIdx: number) { return base | (0x1 << bitIdx) }

    export function clear(base: number, values: number) { return base & ~values }

    export function clearBit(base: number, bitIdx: number) { return base & ~(0x1 << bitIdx) }

    export function isSet(base: number, flags: number) { return (base & flags) === flags }

    export function isBitSet(base: number, bitIdx: number) { return (base & (0x1 << bitIdx)) !== 0 }
}