/** @noSelfInFile */

export namespace StringUtils
{
    export function dump(obj: object, sameLine: boolean = true): string
    {
        const sb: string[] = []
        for(let [key, value] of Object.entries(obj))
        {
            const property = `"${key}": ${value}`
            sb.push(property)
        }

        if(sameLine)
            return `{ ${sb.join("; ")} }`
        return `{ \n\t${sb.join(";\n\t")}\n}`
    }
}
