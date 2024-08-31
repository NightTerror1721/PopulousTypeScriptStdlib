import "./PopModules";
export type LocalDataArray = LocalDataValue[];
export type LocalDataObject = {
    [key: string]: LocalDataValue;
};
export type LocalDataValue = number | boolean | string | LocalDataArray | LocalDataObject;
export declare class LocalDataSaver {
    private readonly writer;
    private readonly data;
    constructor(writer: Script4SaveData);
    put(name: string, value: LocalDataValue): LocalDataSaver;
    putAll(obj: LocalDataValue): LocalDataSaver;
    save(): void;
    private static saveObject;
}
export declare class LocalDataLoader {
    private readonly reader;
    private data;
    constructor(reader: Script4LoadData);
    get(name: string, defaultValue?: LocalDataValue): LocalDataValue;
    forEach(action: (this: void, key: string, value: LocalDataValue) => void): void;
    load(): void;
    private static loadObject;
}
