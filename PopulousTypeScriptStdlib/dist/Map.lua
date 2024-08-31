local ____lualib = require("lualib_bundle")
local __TS__InstanceOf = ____lualib.__TS__InstanceOf
local ____exports = {}
require("PopModules")
local ____Location = require("Location")
local Coord = ____Location.Coord
local Location = ____Location.Location
local _gsi = gsi()
____exports.Map = {}
local Map = ____exports.Map
do
    function Map.getCellComponentsFromLocation(location)
        local c2 = location.coord2D
        return c2.Xpos, c2.Zpos
    end
    function Map.getCellComponents(cell)
        if __TS__InstanceOf(cell, Location) then
            return Map.getCellComponentsFromLocation(cell)
        end
        return cell[1], cell[2]
    end
    function Map.toCell(location)
        local x, z = Map.getCellComponentsFromLocation(location)
        return {x, z}
    end
    function Map.cellToLocation(cell)
        return Location.make2D(cell[1], cell[2])
    end
    function Map.isLand(location)
        return is_map_point_land(location.coord2D) ~= 0
    end
    function Map.isSea(location)
        return is_map_point_sea(location.coord2D) ~= 0
    end
    function Map.isSubCellWalkableInDirection(xOrCell, zOrDirection, direction)
        if direction then
            return is_sub_cell_walkable_in_direction(xOrCell, zOrDirection, direction) ~= 0
        end
        local x, z = Map.getCellComponents(xOrCell)
        return is_sub_cell_walkable_in_direction(x, z, zOrDirection) ~= 0
    end
    function Map.isCellFlatAndLand(cellIdx)
        return is_map_cell_flat_and_land(cellIdx) ~= 0
    end
    function Map.isCellFlat(cellIdx)
        return is_map_cell_flat(cellIdx) ~= 0
    end
    function Map.isCellLand(cellIdx)
        return is_map_cell_land(cellIdx) ~= 0
    end
    function Map.isCellNearCost(cellIdx, radius)
        return is_map_cell_near_coast(cellIdx, radius) ~= 0
    end
    function Map.getWorldDistance(loc1, loc2)
        if type(loc1) == "number" then
            return get_world_dist_xz_cell(loc1, loc2)
        end
        repeat
            local ____switch18 = loc1.coordType
            local ____cond18 = ____switch18 == Coord.PopCoordType.COORD_2D
            if ____cond18 then
                return get_world_dist_xz(loc1.coord2D, loc2.coord2D)
            end
            ____cond18 = ____cond18 or ____switch18 == Coord.PopCoordType.COORD_3D
            if ____cond18 then
                return get_world_dist_xyz(loc1.coord3D, loc2.coord3D)
            end
            ____cond18 = ____cond18 or ____switch18 == Coord.PopCoordType.COORD_3D
            if ____cond18 then
                return get_world_dist_xz_cell(loc1.mapPosXZ.Pos, loc2.mapPosXZ.Pos)
            end
            do
                return get_world_dist_xz_cell(loc1.mapPosXZ.Pos, loc2.mapPosXZ.Pos)
            end
        until true
    end
    function Map.getMaxAltitudeDifferenceFor(loc)
        if type(loc) == "number" then
            return get_max_alt_diff_for_cell(loc)
        end
        return get_max_alt_diff_for_coord2d(loc.coord2D)
    end
    function Map.getElement(x, z)
        if not z then
            if type(x) == "number" then
                return _gsi.Level.MapElements[x]
            end
            if __TS__InstanceOf(x, Location) then
                repeat
                    local ____switch25 = x.coordType
                    local ____cond25 = ____switch25 == Coord.PopCoordType.COORD_2D
                    if ____cond25 then
                        return world_coord2d_to_map_ptr(x.coord2D)
                    end
                    ____cond25 = ____cond25 or ____switch25 == Coord.PopCoordType.COORD_3D
                    if ____cond25 then
                        return world_coord3d_to_map_ptr(x.coord3D)
                    end
                    do
                        return world_coord2d_to_map_ptr(x.coord2D)
                    end
                until true
            end
            return world_coord2d_to_map_ptr(Coord.make2D(x[1], x[2]))
        end
        return world_coord2d_to_map_ptr(Coord.make2D(x, z))
    end
    function Map.asLoc2D(elemOrIdx)
        local coords = Coord.makeEmpty2D()
        if type(elemOrIdx) == "number" then
            map_idx_to_world_coord2d(elemOrIdx, coords)
        else
            map_ptr_to_world_coord2d(elemOrIdx, coords)
        end
        return Location.make2D(coords)
    end
    function Map.asLoc2DCenter(elemOrIdx)
        local coords = Coord.makeEmpty2D()
        if type(elemOrIdx) == "number" then
            map_idx_to_world_coord2d_centre(elemOrIdx, coords)
        else
            map_ptr_to_world_coord2d_centre(elemOrIdx, coords)
        end
        return Location.make2D(coords)
    end
    function Map.asLoc3D(elemOrIdx)
        if type(elemOrIdx) == "number" then
            local coords = Coord.makeEmpty3D()
            map_idx_to_world_coord3d(elemOrIdx, coords)
            return Location.make3D(coords)
        end
        return Location.make3D(Coord.from2DTo3D(Map.asLoc2D(elemOrIdx).coord2D))
    end
    function Map.asLoc3DCenter(elemOrIdx)
        if type(elemOrIdx) == "number" then
            local coords = Coord.makeEmpty3D()
            map_idx_to_world_coord3d_centre(elemOrIdx, coords)
            return Location.make3D(coords)
        end
        return Location.make3D(Coord.from2DTo3D(Map.asLoc2DCenter(elemOrIdx).coord2D))
    end
    function Map.isCoastElement(elem)
        return is_map_elem_coast(elem) ~= 0
    end
    function Map.isAllLandElement(elem)
        return is_map_elem_all_land(elem) ~= 0
    end
    function Map.isAllSeaElement(elem)
        return is_map_elem_all_sea(elem) ~= 0
    end
    function Map.isSeaOrCoastElement(elem)
        return is_map_elem_sea_or_coast(elem) ~= 0
    end
    function Map.isLandOrCoastElement(elem)
        return is_map_elem_land_or_coast(elem) ~= 0
    end
    function Map.isAtCellCenter(loc)
        return is_coord2d_at_cell_centre(loc.coord2D) ~= 0
    end
    function Map.isCellObstacleFree(cellIdx)
        return is_map_cell_obstacle_free(cellIdx) ~= 0
    end
    function Map.isThingOnGround(thing)
        return is_thing_on_ground(thing) ~= 0
    end
    function Map.isLocationOnGround(loc)
        return is_coord_on_ground(loc.coord3D) ~= 0
    end
    function Map.isPointTooSteepForMovingThing(loc, thing)
        return is_point_too_steep_for_moving_thing(loc.coord2D, thing) ~= 0
    end
    function Map.areLocationsOnSameMapCell(loc1, loc2)
        return are_coords_on_same_map_cell(loc1.coord2D, loc2.coord2D) ~= 0
    end
    function Map.setElementOwner(elem, tribe)
        set_map_elem_owner(elem, tribe)
    end
    function Map.validateThingLocation(loc, thing)
        local c3d = loc.coord3D
        validate_thing_coord(c3d, thing)
        return Location.make3D(c3d)
    end
    function Map.setElementLavaNum(elem, num)
        set_map_elem_lava_num(elem, num)
    end
    function Map.getElementLavaNum(elem)
        return get_map_elem_lava_num(elem)
    end
    function Map.getAltitude(xOrLoc, z)
        local elem = z and Map.getElement(xOrLoc, z) or Map.getElement(xOrLoc)
        return elem.Alt
    end
    function Map.getAltitudeWithObjects(xOrLoc, z)
        if z then
            return point_altitude_with_objects(xOrLoc, z)
        end
        local c2d = xOrLoc.coord2D
        return point_altitude_with_objects(c2d.Xpos, c2d.Zpos)
    end
    function Map.getCellIndex(posOrLoc)
        if type(posOrLoc) == "number" then
            return posOrLoc
        end
        repeat
            local ____switch56 = posOrLoc.coordType
            local ____cond56 = ____switch56 == Coord.PopCoordType.COORD_2D
            if ____cond56 then
                return world_coord2d_to_map_idx(posOrLoc.coord2D)
            end
            ____cond56 = ____cond56 or ____switch56 == Coord.PopCoordType.COORD_3D
            if ____cond56 then
                return world_coord3d_to_map_idx(posOrLoc.coord3D)
            end
            ____cond56 = ____cond56 or ____switch56 == Coord.PopCoordType.MAP_POS_XZ
            if ____cond56 then
                return posOrLoc.mapPosXZ.Pos
            end
            do
                return posOrLoc.mapPosXZ.Pos
            end
        until true
    end
    function Map.search(shape, radius, locOrElem, action)
        if __TS__InstanceOf(locOrElem, Location) then
            local idx = Map.getCellIndex(locOrElem)
            SearchMapCells(
                shape,
                0,
                0,
                radius,
                idx,
                action
            )
        else
            local idx = Map.getCellIndex(Map.asLoc2D(locOrElem))
            SearchMapCells(
                shape,
                0,
                0,
                radius,
                idx,
                action
            )
        end
    end
    function Map.findFirstThingOf(____type, model, xOrLoc, zOrRadius, radiusOrShape, shapeOrUndef)
        local function predicate(thing)
            return thing.Type ~= ____type or thing.Model ~= model
        end
        local x
        local z
        local radius
        local shape
        if type(xOrLoc) == "number" then
            x = xOrLoc
            z = zOrRadius
            radius = radiusOrShape
            shape = shapeOrUndef
        else
            x, z = Map.getCellComponentsFromLocation(xOrLoc)
            radius = zOrRadius
            shape = radiusOrShape
        end
        if not radius or radius < 2 then
            local elem = Map.getElement(x, z)
            local ____opt_0 = elem and elem.MapWhoList
            return ____opt_0 and ____opt_0:processList(predicate)
        end
        if not shape then
            shape = CIRCULAR
        end
        local result = nil
        Map.search(
            shape,
            radius,
            Location.makeXZ(x, z),
            function(elem)
                local thing = elem.MapWhoList:processList(predicate)
                if thing ~= nil then
                    result = thing
                    return false
                end
                return true
            end
        )
        return result
    end
end
____exports.FOW = {}
local FOW = ____exports.FOW
do
    function FOW.uncover(tribe, radius, xOrElemOrLoc, z)
        local elem
        if z then
            elem = ____exports.Map.getElement(xOrElemOrLoc, z)
        elseif __TS__InstanceOf(xOrElemOrLoc, Location) then
            elem = ____exports.Map.getElement(xOrElemOrLoc)
        else
            elem = xOrElemOrLoc
        end
        if elem ~= nil then
            ____exports.Map.search(
                CIRCULAR,
                radius,
                elem,
                function(e)
                    _gsi.FogOfWar:uncover(tribe, e)
                    return true
                end
            )
        end
    end
    function FOW.uncoverPermanent(tribe, radius, xOrElemOrLoc, z)
        local elem
        if z then
            elem = ____exports.Map.getElement(xOrElemOrLoc, z)
        elseif __TS__InstanceOf(xOrElemOrLoc, Location) then
            elem = ____exports.Map.getElement(xOrElemOrLoc)
        else
            elem = xOrElemOrLoc
        end
        if elem ~= nil then
            ____exports.Map.search(
                CIRCULAR,
                radius,
                elem,
                function(e)
                    _gsi.FogOfWar:perm_uncover(tribe, e)
                    return true
                end
            )
        end
    end
    function FOW.clearUncoverPermanent(tribe, radius, xOrElemOrLoc, z)
        local elem
        if z then
            elem = ____exports.Map.getElement(xOrElemOrLoc, z)
        elseif __TS__InstanceOf(xOrElemOrLoc, Location) then
            elem = ____exports.Map.getElement(xOrElemOrLoc)
        else
            elem = xOrElemOrLoc
        end
        if elem ~= nil then
            ____exports.Map.search(
                CIRCULAR,
                radius,
                elem,
                function(e)
                    FogOfWar.clear_perm_uncover(tribe, e)
                    return true
                end
            )
        end
    end
    function FOW.uncoverForAllPlayers(radius, xOrElemOrLoc, z)
        local elem
        if z then
            elem = ____exports.Map.getElement(xOrElemOrLoc, z)
        elseif __TS__InstanceOf(xOrElemOrLoc, Location) then
            elem = ____exports.Map.getElement(xOrElemOrLoc)
        else
            elem = xOrElemOrLoc
        end
        if elem ~= nil then
            ____exports.Map.search(
                CIRCULAR,
                radius,
                elem,
                function(e)
                    _gsi.FogOfWar:uncover_for_all_players(e)
                    return true
                end
            )
        end
    end
    function FOW.uncoverPermanentForAllPlayers(radius, xOrElemOrLoc, z)
        local elem
        if z then
            elem = ____exports.Map.getElement(xOrElemOrLoc, z)
        elseif __TS__InstanceOf(xOrElemOrLoc, Location) then
            elem = ____exports.Map.getElement(xOrElemOrLoc)
        else
            elem = xOrElemOrLoc
        end
        if elem ~= nil then
            ____exports.Map.search(
                CIRCULAR,
                radius,
                elem,
                function(e)
                    _gsi.FogOfWar:perm_uncover_all_players(e)
                    return true
                end
            )
        end
    end
    function FOW.clearUncoverPermanentForAllPlayers(radius, xOrElemOrLoc, z)
        local elem
        if z then
            elem = ____exports.Map.getElement(xOrElemOrLoc, z)
        elseif __TS__InstanceOf(xOrElemOrLoc, Location) then
            elem = ____exports.Map.getElement(xOrElemOrLoc)
        else
            elem = xOrElemOrLoc
        end
        if elem ~= nil then
            ____exports.Map.search(
                CIRCULAR,
                radius,
                elem,
                function(e)
                    FogOfWar.clear_perm_uncover_all_players(e)
                    return true
                end
            )
        end
    end
    function FOW.isElementUncovered(elem)
        return _gsi.FogOfWar:is_uncovered(elem) ~= 0
    end
end
return ____exports
