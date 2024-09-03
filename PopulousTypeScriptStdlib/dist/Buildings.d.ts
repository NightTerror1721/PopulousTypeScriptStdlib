import "./PopModules";
import { Location } from "./Location";
import { BuildingModel } from "./Things";
import { MapCell } from "./Map";
import { Marker } from "./Markers";
export declare namespace InternalBuildingModel {
    function of(model: BuildingModel | undefined): PopScriptBuildingModel | undefined;
}
export declare const enum BuildingOrientation {
    North = 2,
    East = 3,
    South = 0,
    West = 1
}
/** @compileMembersOnly */
export declare const enum PlaceDownBuildingShapeMode {
    /** @customName SHME_MODE_SET_TMP */ SetTemporary = 0,
    /** @customName SHME_MODE_REMOVE_TMP */ RemoveTemporary = 1,
    /** @customName SHME_MODE_SET_PERM */ SetPermanent = 2,
    /** @customName SHME_MODE_REMOVE_PERM */ RemovePermanent = 3,
    /** @customName SHME_MODE_CONVERT_TO_BLDG */ ConvertToBuilding = 4
}
export declare function isValidBuildingOrientation(orientation: BuildingOrientation): boolean;
export type ForEachBuildingAction = (this: void, person: Thing) => ForEachBuildingActionResult | undefined;
export declare const enum ForEachBuildingActionResult {
    Stop = 0,
    Continue = 1
}
export interface TribeLikeWithBuildings {
}
export declare class Building {
    readonly tribe: TribeID;
    readonly model: BuildingModel;
    private readonly _player;
    private readonly _playerThings;
    constructor(tribe: TribeID, model: BuildingModel);
    get numInWorld(): number;
    get isEnabled(): boolean;
    set isEnabled(value: boolean);
    get hasOnceShot(): boolean;
    set hasOnceShot(value: boolean);
    get isLevelEnabled(): boolean;
    set isLevelEnabled(value: boolean);
    forEachInWorld(action: ForEachBuildingAction): void;
    createNewInWorld(location: Location, orientation?: BuildingOrientation): Thing;
    placeDownShape(location: Location, orientation: BuildingOrientation, mode: PlaceDownBuildingShapeMode): void;
    placeDownShape(mapCell: MapCell, orientation: BuildingOrientation, mode: PlaceDownBuildingShapeMode): void;
    placeDownShape(marker: Marker, orientation: BuildingOrientation, mode: PlaceDownBuildingShapeMode): void;
    canPlaceDownShape(location: Location, orientation: BuildingOrientation, mode: PlaceDownBuildingShapeMode): boolean;
    canPlaceDownShape(mapCell: MapCell, orientation: BuildingOrientation, mode: PlaceDownBuildingShapeMode): boolean;
    canPlaceDownShape(marker: Marker, orientation: BuildingOrientation, mode: PlaceDownBuildingShapeMode): boolean;
    findAtPos(x: number, z: number, radius: number): Thing | undefined;
    findAtPos(loc: Location, radius: number): Thing | undefined;
    isNear(x: number, z: number, radius: number): boolean;
    isNear(location: Location, radius: number): boolean;
    static getTribeBuildingCount(tribe: TribeID): number;
    static forEachBuilding(this: void, tribe: TribeID, models: BuildingModel[], action: ForEachBuildingAction): void;
    static forEachBuilding(this: void, tribe: TribeID, models: BuildingModel, action: ForEachBuildingAction): void;
    static forEachBuilding(this: void, tribe: TribeID, action: ForEachBuildingAction): void;
    static forEachBuilding(this: void, models: BuildingModel[], action: ForEachBuildingAction): void;
    static forEachBuilding(this: void, models: BuildingModel, action: ForEachBuildingAction): void;
    static forEachBuilding(this: void, action: ForEachBuildingAction): void;
    private static _autoBuild;
    static get autoBuild(): boolean;
    static set autoBuild(value: boolean);
    private static _autoHouse;
    static get autoHouse(): boolean;
    static set autoHouse(value: boolean);
}
