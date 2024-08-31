import "./PopModules";
import { Location } from "./Location";
import { PersonModel } from "./Things";
import { RawMarker } from "./Markers";
export declare namespace InternalPersonModel {
    function of(model: PersonModel | undefined): PopScriptFollowerModel | undefined;
}
export declare const enum PersonOrientation {
    North = 1000,
    NorthEast = 1250,
    East = 1500,
    SouthEast = 1750,
    South = 0,
    SouthWest = 250,
    West = 500,
    NorthWest = 750
}
export declare function isValidPersonOrientation(orientation: PersonOrientation): boolean;
export type ForEachPersonAction = (this: void, person: Thing) => ForEachPersonActionResult | undefined;
export declare const enum ForEachPersonActionResult {
    Stop = 0,
    Continue = 1
}
export declare class Person {
    readonly tribe: TribeID;
    readonly model: PersonModel;
    private readonly _player;
    constructor(tribe: TribeID, model: PersonModel);
    get numInWorld(): number;
    get numInBoats(): number;
    get numInBalloons(): number;
    forEachInWorld(action: ForEachPersonAction): void;
    createNewInWorld(location: Location, orientation?: PersonOrientation): Thing;
    static forEachPerson(this: void, tribe: TribeID, models: PersonModel[], action: ForEachPersonAction): void;
    static forEachPerson(this: void, tribe: TribeID, models: PersonModel, action: ForEachPersonAction): void;
    static forEachPerson(this: void, tribe: TribeID, action: ForEachPersonAction): void;
    static forEachPerson(this: void, models: PersonModel[], action: ForEachPersonAction): void;
    static forEachPerson(this: void, models: PersonModel, action: ForEachPersonAction): void;
    static forEachPerson(this: void, action: ForEachPersonAction): void;
    getListOrderedByIdleFirst(requiredPeople: number): [list: Thing[], minimumRequired: boolean];
    static readonly Count = PersonModel.Angel;
}
export declare class Shaman extends Person {
    constructor(tribe: TribeID);
    get thing(): Thing | undefined;
    get isAlive(): boolean;
    get isSelected(): boolean;
    clearShamanLeftClick(): void;
    clearShamanRightClick(): void;
    get isShamanIconLeftClicked(): boolean;
    get isShamanIconRightClicked(): boolean;
    get isAvailableForAttack(): boolean;
    trackToAngle(angle: number): void;
    moveToMarker(marker: RawMarker): void;
}
