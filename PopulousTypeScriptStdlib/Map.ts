/** @noSelfInFile */

import "./PopModules"
import { Coord, Location } from "./Location"
import { ThingType } from "./Things"

const _gsi = gsi()

export type MapCell = [x: number, z: number]

export namespace Map
{
    export function getCellComponentsFromLocation(location: Location): LuaMultiReturn<[number, number]>
    {
        const c2 = location.coord2D
        return $multi(c2.Xpos, c2.Zpos)
    }
    export function getCellComponents(cell: MapCell | Location): LuaMultiReturn<[number, number]>
    {
        if(cell instanceof Location)
            return getCellComponentsFromLocation(cell)
        return $multi(cell[0], cell[1])
    }
    export function toCell(location: Location): MapCell
    {
        const [x, z] = getCellComponentsFromLocation(location)
        return [x, z]
    }
    export function cellToLocation(cell: MapCell) { return Location.make2D(cell[0], cell[1]) }

    export function isLand(location: Location) { return is_map_point_land(location.coord2D) != 0 }
    export function isSea(location: Location) { return is_map_point_sea(location.coord2D) != 0 }

    export function isSubCellWalkableInDirection(cell: MapCell|Location, direction: number): boolean
    export function isSubCellWalkableInDirection(x: number, z: number, direction: number): boolean
    export function isSubCellWalkableInDirection(xOrCell: MapCell|Location|number, zOrDirection: number, direction?: number): boolean
    {
        if(direction)
            return is_sub_cell_walkable_in_direction(xOrCell as number, zOrDirection as number, direction) != 0

        const [x, z] = getCellComponents(xOrCell as MapCell|Location)
        return is_sub_cell_walkable_in_direction(x, z, zOrDirection) != 0
    }

    export function isCellFlatAndLand(cellIdx: number) { return is_map_cell_flat_and_land(cellIdx) != 0 }
    export function isCellFlat(cellIdx: number) { return is_map_cell_flat(cellIdx) != 0 }
    export function isCellLand(cellIdx: number) { return is_map_cell_land(cellIdx) != 0 }

    export function isCellNearCost(cellIdx: number, radius: number)
    {
        return is_map_cell_near_coast(cellIdx, radius) != 0
    }

    export function getWorldDistance<T extends Location | number>(loc1: T, loc2: T): number
    {
        if(typeof loc1 === "number")
            return get_world_dist_xz_cell(loc1, loc2 as number)

        switch(loc1.coordType)
        {
            case Coord.PopCoordType.COORD_2D:
                return get_world_dist_xz(loc1.coord2D, (loc2 as Location).coord2D)

            case Coord.PopCoordType.COORD_3D:
                return get_world_dist_xyz(loc1.coord3D, (loc2 as Location).coord3D)

            default:
            case Coord.PopCoordType.COORD_3D:
                return get_world_dist_xz_cell(loc1.mapPosXZ.Pos, (loc2 as Location).mapPosXZ.Pos)
        }
    }

    export function getMaxAltitudeDifferenceFor(loc: Location | number)
    {
        if(typeof loc === "number")
            return get_max_alt_diff_for_cell(loc)
        return get_max_alt_diff_for_coord2d(loc.coord2D)
    }

    export function getElement(loc: Location|MapCell): MapElement
    export function getElement(x: number, z: number): MapElement
    export function getElement(x: number|Location|MapCell, z?: number): MapElement
    {
        if(!z)
        {
            if(typeof x === "number")
                return _gsi.Level.MapElements[x - 1]

            if(x instanceof Location)
            {
                switch(x.coordType)
                {
                    default:
                    case Coord.PopCoordType.COORD_2D:
                        return world_coord2d_to_map_ptr(x.coord2D)

                    case Coord.PopCoordType.COORD_3D:
                        return world_coord3d_to_map_ptr(x.coord3D)
                }
            }

            return world_coord2d_to_map_ptr(Coord.make2D(x[0], x[1]))
        }

        return world_coord2d_to_map_ptr(Coord.make2D(x as number, z))
    }


    export function asLoc2D(elem: MapElement): Location
    export function asLoc2D(idx: number): Location
    export function asLoc2D(elemOrIdx: MapElement|number): Location
    {
        const coords = Coord.makeEmpty2D()
        if(typeof elemOrIdx === "number")
            map_idx_to_world_coord2d(elemOrIdx, coords)
        else
            map_ptr_to_world_coord2d(elemOrIdx, coords)
        return Location.make2D(coords)
    }

    export function asLoc2DCenter(elem: MapElement): Location
    export function asLoc2DCenter(idx: number): Location
    export function asLoc2DCenter(elemOrIdx: MapElement|number): Location
    {
        const coords = Coord.makeEmpty2D()
        if(typeof elemOrIdx === "number")
            map_idx_to_world_coord2d_centre(elemOrIdx, coords)
        else
            map_ptr_to_world_coord2d_centre(elemOrIdx, coords)
        return Location.make2D(coords)
    }

    export function asLoc3D(elem: MapElement): Location
    export function asLoc3D(idx: number): Location
    export function asLoc3D(elemOrIdx: MapElement|number): Location
    {
        if(typeof elemOrIdx === "number")
        {
            const coords = Coord.makeEmpty3D()
            map_idx_to_world_coord3d(elemOrIdx, coords)
            return Location.make3D(coords)
        }
        return Location.make3D(Coord.from2DTo3D(asLoc2D(elemOrIdx).coord2D))
    }

    export function asLoc3DCenter(elem: MapElement): Location
    export function asLoc3DCenter(idx: number): Location
    export function asLoc3DCenter(elemOrIdx: MapElement|number): Location
    {
        if(typeof elemOrIdx === "number")
        {
            const coords = Coord.makeEmpty3D()
            map_idx_to_world_coord3d_centre(elemOrIdx, coords)
            return Location.make3D(coords)
        }
        return Location.make3D(Coord.from2DTo3D(asLoc2DCenter(elemOrIdx).coord2D))
    }

    export function isCoastElement(elem: MapElement) { return is_map_elem_coast(elem) != 0 }

    export function isAllLandElement(elem: MapElement) { return is_map_elem_all_land(elem) != 0 }

    export function isAllSeaElement(elem: MapElement) { return is_map_elem_all_sea(elem) != 0 }

    export function isSeaOrCoastElement(elem: MapElement) { return is_map_elem_sea_or_coast(elem) != 0 }

    export function isLandOrCoastElement(elem: MapElement) { return is_map_elem_land_or_coast(elem) != 0 }

    export function isAtCellCenter(loc: Location) { return is_coord2d_at_cell_centre(loc.coord2D) != 0 }

    export function isCellObstacleFree(cellIdx: number) { return is_map_cell_obstacle_free(cellIdx) != 0 }

    export function isThingOnGround(thing: Thing) { return is_thing_on_ground(thing) != 0 }

    export function isLocationOnGround(loc: Location) { return is_coord_on_ground(loc.coord3D) != 0 }

    export function isPointTooSteepForMovingThing(loc: Location, thing: Thing)
    {
        return is_point_too_steep_for_moving_thing(loc.coord2D, thing) != 0
    }

    export function areLocationsOnSameMapCell(loc1: Location, loc2: Location)
    {
        return are_coords_on_same_map_cell(loc1.coord2D, loc2.coord2D) != 0
    }

    export function setElementOwner(elem: MapElement, tribe: TribeID): void { set_map_elem_owner(elem, tribe) }

    export function validateThingLocation(loc: Location, thing: Thing): Location
    {
        const c3d = loc.coord3D
        validate_thing_coord(c3d, thing)
        return Location.make3D(c3d)
    }

    export function setElementLavaNum(elem: MapElement, num: number): void
    {
        set_map_elem_lava_num(elem, num)
    }

    export function getElementLavaNum(elem: MapElement)
    {
        return get_map_elem_lava_num(elem)
    }

    export function getAltitude(x: number, z: number): number
    export function getAltitude(loc: Location): number
    export function getAltitude(xOrLoc: Location|number, z?: number): number
    {
        const elem = z ? getElement(xOrLoc as number, z) : getElement(xOrLoc as Location)
        return elem.Alt
    }

    export function getAltitudeWithObjects(x: number, z: number): number
    export function getAltitudeWithObjects(loc: Location): number
    export function getAltitudeWithObjects(xOrLoc: Location|number, z?: number): number
    {
        if(z) return point_altitude_with_objects(xOrLoc as number, z)
        const c2d = (xOrLoc as Location).coord2D
        return point_altitude_with_objects(c2d.Xpos, c2d.Zpos)
    }

    export function getCellIndex(position: number): number
    export function getCellIndex(loc: Location): number
    export function getCellIndex(posOrLoc: Location|number): number
    {
        if(typeof posOrLoc === "number") return posOrLoc
        switch((posOrLoc as Location).coordType)
        {
            case Coord.PopCoordType.COORD_2D:
                return world_coord2d_to_map_idx((posOrLoc as Location).coord2D)

            case Coord.PopCoordType.COORD_3D:
                return world_coord3d_to_map_idx((posOrLoc as Location).coord3D)

            default:
            case Coord.PopCoordType.MAP_POS_XZ:
                return (posOrLoc as Location).mapPosXZ.Pos
        }
    }

    export function search(shape: SearchShapeType, radius: number, loc: Location, action: (this: void, elem: MapElement) => boolean): void
    export function search(shape: SearchShapeType, radius: number, elem: MapElement, action: (this: void, elem: MapElement) => boolean): void
    export function search(shape: SearchShapeType, radius: number, locOrElem: Location|MapElement, action: (this: void, elem: MapElement) => boolean): void
    {
        if(locOrElem instanceof Location)
        {
            const idx = getCellIndex(locOrElem)
            SearchMapCells(shape, 0, 0, radius, idx, action)
        }
        else
        {
            const idx = getCellIndex(asLoc2D(locOrElem))
            SearchMapCells(shape, 0, 0, radius, idx, action)
        }
    }

    export function findFirstThingOf(type: ThingType, model: number, x: number,     z: number,      radius?: number, shape?: SearchShapeType): Thing|undefined
    export function findFirstThingOf(type: ThingType, model: number, loc: Location, radius?: number, shape?: SearchShapeType): Thing|undefined
    export function findFirstThingOf(
        type: ThingType,
        model: number,
        xOrLoc: Location|number, 
        zOrRadius?: number,
        radiusOrShape?: SearchShapeType|number,
        shapeOrUndef?: SearchShapeType
    ): Thing|undefined
    {
        const predicate = (thing: Thing) => thing.Type !== type || (model !== 0 && thing.Model !== model)

        let x: number
        let z: number
        let radius: number|undefined
        let shape: SearchShapeType|undefined
        if(typeof xOrLoc === "number")
        {
            x = xOrLoc
            z = zOrRadius as number
            radius = radiusOrShape as number|undefined
            shape = shapeOrUndef as SearchShapeType|undefined
        }
        else
        {
            [x, z] = getCellComponentsFromLocation(xOrLoc)
            radius = zOrRadius as number|undefined
            shape = radiusOrShape as SearchShapeType|undefined
        }

        if(!radius || radius < 2)
        {
            const elem = getElement(x, z)
            return elem?.MapWhoList?.processList(predicate)
        }

        if(!shape) shape = SearchShapeType.CIRCULAR

        let result: Thing|undefined = undefined
        search(shape, radius, Location.makeXZ(x, z), elem => {
            const thing = elem.MapWhoList.processList(predicate)
            if(thing !== undefined)
            {
                result = thing
                return false
            }
            return true
        })
        return result
    }
}

export namespace FOW
{
    export function uncover(tribe: TribeID, radius: number, x: number, z: number): void
    export function uncover(tribe: TribeID, radius: number, elem: MapElement): void
    export function uncover(tribe: TribeID, radius: number, loc: Location): void
    export function uncover(tribe: TribeID, radius: number, xOrElemOrLoc: MapElement|Location|number, z?: number): void
    {
        let elem: MapElement|undefined
        if(z)
            elem = Map.getElement(xOrElemOrLoc as number, z)
        else if(xOrElemOrLoc instanceof Location)
            elem = Map.getElement(xOrElemOrLoc)
        else
            elem = xOrElemOrLoc as MapElement

        if(elem !== undefined)
        {
            Map.search(SearchShapeType.CIRCULAR, radius, elem, e => {
                _gsi.FogOfWar.uncover(tribe, e)
                return true
            })
        }
    }

    export function uncoverPermanent(tribe: TribeID, radius: number, x: number, z: number): void
    export function uncoverPermanent(tribe: TribeID, radius: number, elem: MapElement): void
    export function uncoverPermanent(tribe: TribeID, radius: number, loc: Location): void
    export function uncoverPermanent(tribe: TribeID, radius: number, xOrElemOrLoc: MapElement|Location|number, z?: number): void
    {
        let elem: MapElement|undefined
        if(z)
            elem = Map.getElement(xOrElemOrLoc as number, z)
        else if(xOrElemOrLoc instanceof Location)
            elem = Map.getElement(xOrElemOrLoc)
        else
            elem = xOrElemOrLoc as MapElement

        if(elem !== undefined)
        {
            Map.search(SearchShapeType.CIRCULAR, radius, elem, e => {
                _gsi.FogOfWar.perm_uncover(tribe, e)
                return true
            })
        }
    }

    export function clearUncoverPermanent(tribe: TribeID, radius: number, x: number, z: number): void
    export function clearUncoverPermanent(tribe: TribeID, radius: number, elem: MapElement): void
    export function clearUncoverPermanent(tribe: TribeID, radius: number, loc: Location): void
    export function clearUncoverPermanent(tribe: TribeID, radius: number, xOrElemOrLoc: MapElement|Location|number, z?: number): void
    {
        let elem: MapElement|undefined
        if(z)
            elem = Map.getElement(xOrElemOrLoc as number, z)
        else if(xOrElemOrLoc instanceof Location)
            elem = Map.getElement(xOrElemOrLoc)
        else
            elem = xOrElemOrLoc as MapElement

        if(elem !== undefined)
        {
            Map.search(SearchShapeType.CIRCULAR, radius, elem, e => {
                FogOfWar.clear_perm_uncover(tribe, e)
                return true
            })
        }
    }

    export function uncoverForAllPlayers(radius: number, x: number, z: number): void
    export function uncoverForAllPlayers(radius: number, elem: MapElement): void
    export function uncoverForAllPlayers(radius: number, loc: Location): void
    export function uncoverForAllPlayers(radius: number, xOrElemOrLoc: MapElement|Location|number, z?: number): void
    {
        let elem: MapElement|undefined
        if(z)
            elem = Map.getElement(xOrElemOrLoc as number, z)
        else if(xOrElemOrLoc instanceof Location)
            elem = Map.getElement(xOrElemOrLoc)
        else
            elem = xOrElemOrLoc as MapElement

        if(elem !== undefined)
        {
            Map.search(SearchShapeType.CIRCULAR, radius, elem, e => {
                _gsi.FogOfWar.uncover_for_all_players(e)
                return true
            })
        }
    }

    export function uncoverPermanentForAllPlayers(radius: number, x: number, z: number): void
    export function uncoverPermanentForAllPlayers(radius: number, elem: MapElement): void
    export function uncoverPermanentForAllPlayers(radius: number, loc: Location): void
    export function uncoverPermanentForAllPlayers(radius: number, xOrElemOrLoc: MapElement|Location|number, z?: number): void
    {
        let elem: MapElement|undefined
        if(z)
            elem = Map.getElement(xOrElemOrLoc as number, z)
        else if(xOrElemOrLoc instanceof Location)
            elem = Map.getElement(xOrElemOrLoc)
        else
            elem = xOrElemOrLoc as MapElement

        if(elem !== undefined)
        {
            Map.search(SearchShapeType.CIRCULAR, radius, elem, e => {
                _gsi.FogOfWar.perm_uncover_all_players(e)
                return true
            })
        }
    }

    export function clearUncoverPermanentForAllPlayers(radius: number, x: number, z: number): void
    export function clearUncoverPermanentForAllPlayers(radius: number, elem: MapElement): void
    export function clearUncoverPermanentForAllPlayers(radius: number, loc: Location): void
    export function clearUncoverPermanentForAllPlayers(radius: number, xOrElemOrLoc: MapElement|Location|number, z?: number): void
    {
        let elem: MapElement|undefined
        if(z)
            elem = Map.getElement(xOrElemOrLoc as number, z)
        else if(xOrElemOrLoc instanceof Location)
            elem = Map.getElement(xOrElemOrLoc)
        else
            elem = xOrElemOrLoc as MapElement

        if(elem !== undefined)
        {
            Map.search(SearchShapeType.CIRCULAR, radius, elem, e => {
                FogOfWar.clear_perm_uncover_all_players(e)
                return true
            })
        }
    }

    export function isElementUncovered(elem: MapElement) { return _gsi.FogOfWar.is_uncovered(elem) != 0 }
}
