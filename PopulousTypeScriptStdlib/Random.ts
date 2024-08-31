import "./PopModules"

/** @noSelf */
declare namespace math
{
    function random(min: number, max: number): number
    function random(max: number): number
    function random(): number
}

/** @noSelf */
namespace Random
{
    export function integer(min: number, max: number): number
    export function integer(min: number): number
    export function integer(minOrMax: number, max?: number): number
    {
        if(max)
        {
            if(minOrMax >= max - 1) return 0
            return math.random(minOrMax, max - 1)
        }
        if(minOrMax < 2) return 0
        return math.random(0, minOrMax - 1)
    }

    export function float(): number { return math.random() }

    export function element<T>(array: T[]): T
    {
        const len = array.length
        if(len < 1) error("Empty array on Random.element")
        if(len === 1) return array[0]
        return array[Random.integer(len)]
    }
}

export default Random