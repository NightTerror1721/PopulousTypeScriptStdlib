import "./PopModules"

/*declare namespace table
{
    function remove<T>(this: void, list: T[], pos?: number): T | undefined
}*/

export type LocalDataArray = LocalDataValue[]
export type LocalDataObject = { [key: string]: LocalDataValue }
export type LocalDataValue = number | boolean | string | LocalDataArray | LocalDataObject

const enum LocalDataValueType
{
    INTEGER,
    FLOAT,
    BOOLEAN,
    STRING,
    ARRAY,
    OBJECT
}

type LocalDataEntry = { type: LocalDataValueType, value: number | boolean | string }

class LocalDataEntryStack
{
    private readonly stack: LocalDataEntry[]

    public constructor()
    {
        this.stack = []
    }

    public get length() { return this.stack.length }
    public get isEmpty() { return this.stack.length <= 0 }

    public pushInteger(value: number): void
    {
        if(!Number.isInteger(value))
            value = Math.floor(value)
        this.stack.push({ type: LocalDataValueType.INTEGER, value: value })
    }

    public pushFloat(value: number): void
    {
        this.stack.push({ type: LocalDataValueType.FLOAT, value: value })
    }

    public pushNumber(value: number): void
    {
        if(Number.isInteger(value))
            this.pushInteger(value)
        else
            this.pushFloat(value)
    }

    public pushBoolean(value: boolean): void
    {
        this.stack.push({ type: LocalDataValueType.BOOLEAN, value: value })
    }

    public pushString(value: string): void
    {
        this.stack.push({ type: LocalDataValueType.STRING, value: value })
    }

    public pushArrayLength(value: number): void
    {
        if(!Number.isInteger(value))
            value = Math.floor(value)
        this.stack.push({ type: LocalDataValueType.ARRAY, value: value })
    }

    public pushObjectLength(value: number): void
    {
        if(!Number.isInteger(value))
            value = Math.floor(value)
        this.stack.push({ type: LocalDataValueType.OBJECT, value: value })
    }

    public pop() { return this.stack.pop() }

    public clear(): void
    {
        while (this.stack.length > 0)
            this.stack.pop()
    }

    public write(writer: Script4SaveData): void
    {
        let count = 0
        for (const entry of this.stack)
        {
            switch(entry.type)
            {
                case LocalDataValueType.INTEGER:
                    writer.push_int(<number>entry.value)
                    writer.push_int(LocalDataValueType.INTEGER)
                    count++
                    break

                case LocalDataValueType.FLOAT:
                    writer.push_float(<number>entry.value)
                    writer.push_int(LocalDataValueType.FLOAT)
                    count++
                    break

                case LocalDataValueType.BOOLEAN:
                    writer.push_bool(<boolean>entry.value)
                    writer.push_int(LocalDataValueType.BOOLEAN)
                    count++
                    break

                case LocalDataValueType.STRING:
                    writer.push_string(<string>entry.value)
                    writer.push_int(LocalDataValueType.STRING)
                    count++
                    break

                case LocalDataValueType.ARRAY:
                    writer.push_int(<number>entry.value)
                    writer.push_int(LocalDataValueType.ARRAY)
                    count++
                    break

                case LocalDataValueType.OBJECT:
                    writer.push_int(<number>entry.value)
                    writer.push_int(LocalDataValueType.OBJECT)
                    count++
                    break

                default: break
            }
        }

        writer.push_int(count)
    }

    public read(reader: Script4LoadData): void
    {
        this.clear()
        let count = reader.pop_int()
        for (let i = 0; i < count; i++)
        {
            const type: LocalDataValueType = reader.pop_int()
            switch(type)
            {
                case LocalDataValueType.INTEGER:
                    this.pushInteger(reader.pop_int())
                    break

                case LocalDataValueType.FLOAT:
                    this.pushFloat(reader.pop_float())
                    break

                case LocalDataValueType.BOOLEAN:
                    this.pushBoolean(reader.pop_bool())
                    break

                case LocalDataValueType.STRING:
                    this.pushString(reader.pop_string())
                    break

                case LocalDataValueType.ARRAY:
                    this.pushArrayLength(reader.pop_int())
                    break

                case LocalDataValueType.OBJECT:
                    this.pushObjectLength(reader.pop_int())
                    break

                default: break
            }
        }
    }
}

/** @noSelf */
namespace LocalDataParser
{
    const ValueType = {
        number: true,
        boolean: true,
        string: true,
        object: true
    }

    function isValidType(value: LocalDataValue) { return (typeof value) in ValueType }

    function extractObjectEntries(obj: LocalDataObject): [string, LocalDataValue][]
    {
        const entries: [string, LocalDataValue][] = []
        for (const [key, value] of Object.entries(obj))
        {
            if(typeof key === "string" && isValidType(value))
            {
                entries.push([key, value])
            }
        }
        return entries
    }

    export function writeValue(data: LocalDataEntryStack, value: LocalDataValue): void
    {
        const vtype = typeof value
        switch(vtype)
        {
            case "number":
                data.pushNumber(<number>value)
                break

            case "boolean":
                data.pushBoolean(<boolean>value)
                break

            case "string":
                data.pushString(<string>value)
                break

            case "object":
                if(Array.isArray(value))
                {
                    const array = <LocalDataArray>value
                    data.pushArrayLength(array.length)
                    for (const val of array)
                        writeValue(data, val)
                }
                else
                {
                    const entries = extractObjectEntries(<LocalDataObject>value)
                    for(const [key, value] of entries)
                    {
                        data.pushString(key)
                        writeValue(data, value)
                    }
                }
                break
        }
    }

    export function readValue(data: LocalDataEntryStack): LocalDataValue
    {
        const entry = data.pop()
        if(entry === undefined) return false

        if(entry.type === LocalDataValueType.ARRAY)
        {
            const array: LocalDataArray = []
            const size = <number>entry.value
            for(let i = 0; i < size; i++)
                array.push(readValue(data))

            return array
        }

        if(entry.type === LocalDataValueType.OBJECT)
        {
            const obj: LocalDataObject = {}
            const size = <number>entry.value
            for(let i = 0; i < size; i++)
            {
                const key = data.pop()
                const value = readValue(data)
                if(key && key.type === LocalDataValueType.STRING)
                    obj[<string>key.value] = value
            }

            return obj
        }

        return entry.value
    }
}



export class LocalDataSaver
{
    private readonly writer: Script4SaveData
    private readonly data: LocalDataObject

    public constructor(writer: Script4SaveData)
    {
        this.writer = writer
        this.data = {}
    }

    public put(name: string, value: LocalDataValue): LocalDataSaver
    {
        this.data[name] = value
        return this
    }

    public putAll(obj: LocalDataValue): LocalDataSaver
    {
        for (const [key, value] of Object.entries(obj))
            this.data[key] = value
        return this
    }

    public save(): void { LocalDataSaver.saveObject(this.writer, this.data) }

    private static saveObject(this: void, writer: Script4SaveData, obj: LocalDataObject): void
    {
        const data = new LocalDataEntryStack()
        LocalDataParser.writeValue(data, obj)
        data.write(writer)
        data.clear()
    }
}

export class LocalDataLoader
{
    private readonly reader: Script4LoadData
    private data: LocalDataObject

    public constructor(reader: Script4LoadData)
    {
        this.reader = reader
        this.data = {}
    }

    public get(name: string, defaultValue?: LocalDataValue): LocalDataValue
    {
        if(!(name in this.data))
            return defaultValue !== undefined ? defaultValue : 0

        return this.data[name]
    }

    public forEach(action: (this: void, key: string, value: LocalDataValue) => void)
    {
        for (const [key, value] of Object.entries(this.data))
            action(key, value)
    }

    public load(): void { this.data = LocalDataLoader.loadObject(this.reader) }

    private static loadObject(reader: Script4LoadData): LocalDataObject
    {
        const data = new LocalDataEntryStack()
        data.read(reader)
        const value = LocalDataParser.readValue(data)
        data.clear()
        if ((typeof value) !== "object" || Array.isArray(value))
            return {}

        return <LocalDataObject>value
    }
}
