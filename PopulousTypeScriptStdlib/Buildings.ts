import "./PopModules"
import { Flags } from "./Flags"
import { Coord, Location } from "./Location"
import { BuildingModel, ThingType, createBuilding } from "./Things"
import { Map, MapCell } from "./Map"
import { Marker } from "./Markers"

const _gsi = gsi()

export namespace InternalBuildingModel
{
    const Mapper: Record<number, PopScriptBuildingModel> = {
        [BuildingModel.None]: PopScriptBuildingModel.INT_NO_SPECIFIC_BUILDING,
        [BuildingModel.Tepee]: PopScriptBuildingModel.INT_TEPEE,
        [BuildingModel.Hut]: PopScriptBuildingModel.INT_HUT,
        [BuildingModel.Farm]: PopScriptBuildingModel.INT_FARM,
        [BuildingModel.DrumTower]: PopScriptBuildingModel.INT_DRUM_TOWER,
        [BuildingModel.Temple]: PopScriptBuildingModel.INT_TEMPLE,
        [BuildingModel.SpyTrain]: PopScriptBuildingModel.INT_SPY_TRAIN,
        [BuildingModel.WarriorTrain]: PopScriptBuildingModel.INT_WARRIOR_TRAIN,
        [BuildingModel.SuperTrain]: PopScriptBuildingModel.INT_SUPER_TRAIN,
        [BuildingModel.Reconversion]: PopScriptBuildingModel.INT_RECONVERSION,
        [BuildingModel.WallPiece]: PopScriptBuildingModel.INT_WALL_PIECE,
        [BuildingModel.Gate]: PopScriptBuildingModel.INT_GATE,
        [BuildingModel.BoatHut1]: PopScriptBuildingModel.INT_BOAT_HUT_1,
        [BuildingModel.BoatHut2]: PopScriptBuildingModel.INT_BOAT_HUT_2,
        [BuildingModel.AirshipHut1]: PopScriptBuildingModel.INT_AIRSHIP_HUT_1,
        [BuildingModel.AirshipHut2]: PopScriptBuildingModel.INT_AIRSHIP_HUT_2,
    }

    export function of(model: BuildingModel|undefined): PopScriptBuildingModel|undefined { return model ? Mapper[model] : undefined }
}

export const enum BuildingOrientation
{
    North = 2,
    East = 3,
    South = 0,
    West = 1
}

/** @compileMembersOnly */
export const enum PlaceDownBuildingShapeMode
{
    /** @customName SHME_MODE_SET_TMP */ SetTemporary = Constant.SHME_MODE_SET_TMP,
    /** @customName SHME_MODE_REMOVE_TMP */ RemoveTemporary = Constant.SHME_MODE_REMOVE_TMP,
    /** @customName SHME_MODE_SET_PERM */ SetPermanent = Constant.SHME_MODE_SET_PERM,
    /** @customName SHME_MODE_REMOVE_PERM */ RemovePermanent = Constant.SHME_MODE_REMOVE_PERM,
    /** @customName SHME_MODE_CONVERT_TO_BLDG */ ConvertToBuilding = Constant.SHME_MODE_CONVERT_TO_BLDG
}

const ValidOrientations = {
    [BuildingOrientation.North]: BuildingOrientation.North,
    [BuildingOrientation.East]: BuildingOrientation.East,
    [BuildingOrientation.South]: BuildingOrientation.South,
    [BuildingOrientation.West]: BuildingOrientation.West
}
export function isValidBuildingOrientation(orientation: BuildingOrientation)
{
    return orientation in ValidOrientations
}

export type ForEachBuildingAction = (this: void, person: Thing) => ForEachBuildingActionResult | undefined
export const enum ForEachBuildingActionResult
{
    Stop = 0,
    Continue = 1
}

export interface TribeLikeWithBuildings
{

}


export class Building
{
    public readonly tribe: TribeID
    public readonly model: BuildingModel
    private readonly _player: Player
    private readonly _playerThings: PlayerThings

    constructor(tribe: TribeID, model: BuildingModel)
    {
        this.tribe = tribe
        this.model = model
        this._player = getPlayer(tribe)
        this._playerThings = _gsi.ThisLevelInfo.PlayerThings[tribe - 1]
    }

    get numInWorld(): number { return this._player.NumBuildingsOfType[this.model - 1] }

    get isEnabled(): boolean { return Flags.isBitSet(this._playerThings.BuildingsAvailable, this.model) }
    set isEnabled(value: boolean)
    {
        if(value)
            this._playerThings.BuildingsAvailable = Flags.setBit(this._playerThings.BuildingsAvailable, this.model)
        else
            this._playerThings.BuildingsAvailable = Flags.clearBit(this._playerThings.BuildingsAvailable, this.model)
    }

    get hasOnceShot(): boolean { return Flags.isBitSet(this._playerThings.BuildingsAvailableOnce, this.model) }
    set hasOnceShot(value: boolean)
    {
        if(value)
            this._playerThings.BuildingsAvailableOnce = Flags.setBit(this._playerThings.BuildingsAvailableOnce, this.model)
        else
            this._playerThings.BuildingsAvailableOnce = Flags.clearBit(this._playerThings.BuildingsAvailableOnce, this.model)
    }

    get isLevelEnabled(): boolean { return Flags.isBitSet(this._playerThings.BuildingsAvailableLevel, this.model) }
    set isLevelEnabled(value: boolean)
    {
        if(value)
            this._playerThings.BuildingsAvailableLevel = Flags.setBit(this._playerThings.BuildingsAvailableLevel, this.model)
        else
            this._playerThings.BuildingsAvailableLevel = Flags.clearBit(this._playerThings.BuildingsAvailableLevel, this.model)
    }

    forEachInWorld(action: ForEachBuildingAction): void { Building.forEachBuilding(this.tribe, this.model, action) }

    createNewInWorld(location: Location, orientation?: BuildingOrientation)
    {
        const building = createBuilding(this.model, this.tribe, location)
        if(building !== undefined)
        {
            if(orientation && isValidBuildingOrientation(orientation))
                building.AngleXZ = orientation
        }
        return building
    }

    placeDownShape(location: Location, orientation: BuildingOrientation, mode: PlaceDownBuildingShapeMode): void
    placeDownShape(mapCell: MapCell, orientation: BuildingOrientation, mode: PlaceDownBuildingShapeMode): void
    placeDownShape(marker: Marker, orientation: BuildingOrientation, mode: PlaceDownBuildingShapeMode): void
    placeDownShape(pos: Location|MapCell|Marker, orientation: BuildingOrientation, mode: PlaceDownBuildingShapeMode): void
    {
        let cell: number
        if(Marker.isMarker(pos))
            cell = pos.location.mapPosXZ.Pos
        else if("coordType" in pos)
            cell = pos.mapPosXZ.Pos
        else
            cell = Coord.makeXZ(pos[0], pos[1]).Pos

        process_shape_map_elements(cell, this.model, orientation, this.tribe, mode)
    }

    canPlaceDownShape(location: Location, orientation: BuildingOrientation, mode: PlaceDownBuildingShapeMode): boolean
    canPlaceDownShape(mapCell: MapCell, orientation: BuildingOrientation, mode: PlaceDownBuildingShapeMode): boolean
    canPlaceDownShape(marker: Marker, orientation: BuildingOrientation, mode: PlaceDownBuildingShapeMode): boolean
    canPlaceDownShape(pos: Location|MapCell|Marker, orientation: BuildingOrientation, mode: PlaceDownBuildingShapeMode): boolean
    {
        let cell: number
        if(Marker.isMarker(pos))
            cell = pos.location.mapPosXZ.Pos
        else if("coordType" in pos)
            cell = pos.mapPosXZ.Pos
        else
            cell = Coord.makeXZ(pos[0], pos[1]).Pos

        return is_shape_valid_at_map_pos(cell, this.model, orientation, this.tribe) !== 0
    }

    findAtPos(x: number, z: number, radius: number): Thing|undefined
    findAtPos(loc: Location, radius: number): Thing|undefined
    findAtPos(xOrLoc: Location|number, zOrRadius: number, radiusOrUndef?: number): Thing|undefined
    {
        let x: number, z: number, radius: number
        if(radiusOrUndef)
        {
            x = xOrLoc as number
            z = zOrRadius as number
            radius = radiusOrUndef
        }
        else
        {
            [x, z] = Map.getCellComponentsFromLocation(xOrLoc as Location)
            radius = zOrRadius as number
        }

        const building = Map.findFirstThingOf(ThingType.Building, this.model, x, z, radius, SearchShapeType.CIRCULAR)
        if(building && building.Owner == this.tribe)
            return building

        return undefined
    }

    isNear(x: number, z: number, radius: number): boolean
    isNear(location: Location, radius: number): boolean
    isNear(xOrLoc: number|Location, zOrRadius: number, radiusOrUndef?: number): boolean
    {
        if(typeof xOrLoc === "number")
            return IS_BUILDING_NEAR(this.tribe, InternalBuildingModel.of(this.model)!!, xOrLoc, zOrRadius, radiusOrUndef as number) != 0
        const [x, z] = Map.getCellComponentsFromLocation(xOrLoc)
        return IS_BUILDING_NEAR(this.tribe, InternalBuildingModel.of(this.model)!!, x, z, radiusOrUndef as number) != 0
    }

    static getTribeBuildingCount(tribe: TribeID) { return getPlayer(tribe).NumBuildings }

    static forEachBuilding(this: void, tribe: TribeID,        models: BuildingModel[],  action: ForEachBuildingAction): void
    static forEachBuilding(this: void, tribe: TribeID,        models: BuildingModel,    action: ForEachBuildingAction): void
    static forEachBuilding(this: void, tribe: TribeID,        action: ForEachBuildingAction): void
    static forEachBuilding(this: void, models: BuildingModel[], action: ForEachBuildingAction): void
    static forEachBuilding(this: void, models: BuildingModel,   action: ForEachBuildingAction): void
    static forEachBuilding(this: void, action: ForEachBuildingAction): void
    static forEachBuilding(this: void,
        arg0: TribeID|BuildingModel[]|BuildingModel|ForEachBuildingAction,
        arg1?: BuildingModel[]|BuildingModel|ForEachBuildingAction,
        arg2?: ForEachBuildingAction
    ): void
    {
        const tribe = typeof arg0 === "number" ? arg0 as TribeID : undefined
        const models = arg2 ? arg1 as BuildingModel[]|BuildingModel
            : arg1 ? (tribe ? undefined : arg0 as BuildingModel[]|BuildingModel)
            : undefined
        const action = arg2 ? arg2 : arg1 ? arg1 as ForEachBuildingAction : arg0 as ForEachBuildingAction

        if(typeof models === "number")
        {
            ProcessGlobalTypeList(ThingType.Building, building => {
                if((tribe && building.Owner !== tribe) || building.Model !== models)
                    return true

                const result = action(building)
                return result === undefined || result !== ForEachBuildingActionResult.Stop
            })
        }
        else if(models === undefined || models.length < 1)
        {
            ProcessGlobalTypeList(ThingType.Building, building => {
                if(tribe && building.Owner !== tribe)
                    return true

                const result = action(building)
                return result === undefined || result !== ForEachBuildingActionResult.Stop
            })
        }
        else
        {
            ProcessGlobalTypeList(ThingType.Building, building => {
                if((tribe && building.Owner !== tribe) || !(building.Model in models))
                    return true

                const result = action(building)
                return result === undefined || result !== ForEachBuildingActionResult.Stop
            })
        }
    }


    private static _autoBuild = false
    public static get autoBuild(): boolean { return Building._autoBuild }
    public static set autoBuild(value: boolean) { SET_AUTO_BUILD(value ? 1 : 0); Building._autoBuild = value }

    private static _autoHouse = false
    public static get autoHouse(): boolean { return Building._autoHouse }
    public static set autoHouse(value: boolean) { SET_AUTO_HOUSE(value ? 1 : 0); Building._autoHouse = value }
}
