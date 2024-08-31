local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local ____exports = {}
local Location2D, Location3D, LocationXZ
require("PopModules")
____exports.Coord = {}
local Coord = ____exports.Coord
do
    Coord.PopCoordType = PopCoordType or ({})
    Coord.PopCoordType.COORD_2D = 0
    Coord.PopCoordType[Coord.PopCoordType.COORD_2D] = "COORD_2D"
    Coord.PopCoordType.COORD_3D = 1
    Coord.PopCoordType[Coord.PopCoordType.COORD_3D] = "COORD_3D"
    Coord.PopCoordType.MAP_POS_XZ = 2
    Coord.PopCoordType[Coord.PopCoordType.MAP_POS_XZ] = "MAP_POS_XZ"
    local function getCoordClassName(cls)
        return getmetatable(cls:new()).__name
    end
    local PopCoordTypeName = {
        Coord2D = getCoordClassName(Coord2D),
        Coord3D = getCoordClassName(Coord2D),
        MapPosXZ = getCoordClassName(Coord2D)
    }
    local PopCoordTypeByName = {
        [PopCoordTypeName.Coord2D] = Coord.PopCoordType.COORD_2D,
        [PopCoordTypeName.Coord3D] = Coord.PopCoordType.COORD_3D,
        [PopCoordTypeName.MapPosXZ] = Coord.PopCoordType.MAP_POS_XZ,
        [PopCoordTypeName.Coord2D .. "*"] = Coord.PopCoordType.COORD_2D,
        [PopCoordTypeName.Coord3D .. "*"] = Coord.PopCoordType.COORD_3D,
        [PopCoordTypeName.MapPosXZ .. "*"] = Coord.PopCoordType.MAP_POS_XZ
    }
    function Coord.getType(coord)
        return PopCoordTypeByName[getmetatable(coord).__name]
    end
    function Coord.makeEmpty2D()
        return Coord2D.new()
    end
    function Coord.makeEmpty3D()
        return Coord3D.new()
    end
    function Coord.makeEmptyXZ()
        return MapPosXZ.new()
    end
    function Coord.make2D(x, z)
        local coord = Coord.makeEmpty2D()
        coord.Xpos = x
        coord.Zpos = z
        return coord
    end
    function Coord.make3D(x, y, z)
        local coord = Coord.makeEmpty3D()
        coord.Xpos = x
        coord.Ypos = y
        coord.Zpos = z
        return coord
    end
    function Coord.makeXZ(x, z)
        local coord = Coord.makeEmptyXZ()
        coord.XZ.X = x
        coord.XZ.Z = z
        return coord
    end
    function Coord.makeXZFromPos(pos)
        local coord = Coord.makeEmptyXZ()
        coord.Pos = pos
        return coord
    end
    function Coord.copy2D(other)
        return Coord.make2D(other.Xpos, other.Zpos)
    end
    function Coord.copy3D(other)
        return Coord.make3D(other.Xpos, other.Ypos, other.Zpos)
    end
    function Coord.copyXZ(other)
        return Coord.makeXZFromPos(other.Pos)
    end
    function Coord.copy(other)
        repeat
            local ____switch16 = ____exports.Coord.getType(other)
            local ____cond16 = ____switch16 == Coord.PopCoordType.COORD_2D
            if ____cond16 then
                return ____exports.Coord.copy2D(other)
            end
            ____cond16 = ____cond16 or ____switch16 == Coord.PopCoordType.COORD_3D
            if ____cond16 then
                return ____exports.Coord.copy3D(other)
            end
            ____cond16 = ____cond16 or ____switch16 == Coord.PopCoordType.MAP_POS_XZ
            if ____cond16 then
                return ____exports.Coord.copyXZ(other)
            end
            do
                return ____exports.Coord.makeEmpty3D()
            end
        until true
    end
    function Coord.from2DTo3D(coord)
        local cpy = Coord.makeEmpty3D()
        coord2D_to_coord3D(coord, cpy)
        return cpy
    end
    function Coord.from2DToXZ(coord)
        local cpy = Coord.makeEmptyXZ()
        cpy.Pos = world_coord2d_to_map_idx(coord)
        return cpy
    end
    function Coord.from3DTo2D(coord)
        local cpy = Coord.makeEmpty2D()
        coord3D_to_coord2D(coord, cpy)
        return cpy
    end
    function Coord.from3DToXZ(coord)
        local cpy = Coord.makeEmptyXZ()
        cpy.Pos = world_coord3d_to_map_idx(coord)
        return cpy
    end
    function Coord.fromXZTo2D(coord)
        local cpy = Coord.makeEmpty2D()
        map_idx_to_world_coord2d(coord.Pos, cpy)
        return cpy
    end
    function Coord.fromXZTo3D(coord)
        local cpy = Coord.makeEmpty3D()
        map_idx_to_world_coord3d(coord.Pos, cpy)
        return cpy
    end
    function Coord.to2D(coord)
        repeat
            local ____switch24 = ____exports.Coord.getType(coord)
            local ____cond24 = ____switch24 == Coord.PopCoordType.COORD_2D
            if ____cond24 then
                return ____exports.Coord.copy2D(coord)
            end
            ____cond24 = ____cond24 or ____switch24 == Coord.PopCoordType.COORD_3D
            if ____cond24 then
                return ____exports.Coord.from3DTo2D(coord)
            end
            ____cond24 = ____cond24 or ____switch24 == Coord.PopCoordType.MAP_POS_XZ
            if ____cond24 then
                return ____exports.Coord.fromXZTo2D(coord)
            end
            do
                return ____exports.Coord.makeEmpty2D()
            end
        until true
    end
    function Coord.to3D(coord)
        repeat
            local ____switch26 = ____exports.Coord.getType(coord)
            local ____cond26 = ____switch26 == Coord.PopCoordType.COORD_2D
            if ____cond26 then
                return ____exports.Coord.from2DTo3D(coord)
            end
            ____cond26 = ____cond26 or ____switch26 == Coord.PopCoordType.COORD_3D
            if ____cond26 then
                return ____exports.Coord.copy3D(coord)
            end
            ____cond26 = ____cond26 or ____switch26 == Coord.PopCoordType.MAP_POS_XZ
            if ____cond26 then
                return ____exports.Coord.fromXZTo3D(coord)
            end
            do
                return ____exports.Coord.makeEmpty3D()
            end
        until true
    end
    function Coord.toXZ(coord)
        repeat
            local ____switch28 = ____exports.Coord.getType(coord)
            local ____cond28 = ____switch28 == Coord.PopCoordType.COORD_2D
            if ____cond28 then
                return ____exports.Coord.from2DToXZ(coord)
            end
            ____cond28 = ____cond28 or ____switch28 == Coord.PopCoordType.COORD_3D
            if ____cond28 then
                return ____exports.Coord.from3DToXZ(coord)
            end
            ____cond28 = ____cond28 or ____switch28 == Coord.PopCoordType.MAP_POS_XZ
            if ____cond28 then
                return ____exports.Coord.copyXZ(coord)
            end
            do
                return ____exports.Coord.makeEmptyXZ()
            end
        until true
    end
end
____exports.Location = __TS__Class()
local Location = ____exports.Location
Location.name = "Location"
function Location.prototype.____constructor(self)
end
function Location.of(coord)
    repeat
        local ____switch31 = ____exports.Coord.getType(coord)
        local ____cond31 = ____switch31 == ____exports.Coord.PopCoordType.COORD_2D
        if ____cond31 then
            return __TS__New(Location2D, coord)
        end
        ____cond31 = ____cond31 or ____switch31 == ____exports.Coord.PopCoordType.COORD_3D
        if ____cond31 then
            return __TS__New(Location3D, coord)
        end
        ____cond31 = ____cond31 or ____switch31 == ____exports.Coord.PopCoordType.MAP_POS_XZ
        if ____cond31 then
            return __TS__New(LocationXZ, coord)
        end
        do
            return __TS__New(
                Location3D,
                ____exports.Coord.makeEmpty3D()
            )
        end
    until true
end
function Location.make2D(x, z)
    if x then
        if z then
            return __TS__New(
                Location2D,
                ____exports.Coord.make2D(x, z)
            )
        end
        if type(x) == "number" then
            return __TS__New(
                Location2D,
                ____exports.Coord.make2D(x, x)
            )
        end
        return __TS__New(Location2D, x)
    end
    return __TS__New(
        Location2D,
        ____exports.Coord.makeEmpty2D()
    )
end
function Location.make3D(x, y, z)
    if x then
        if y then
            if z then
                return __TS__New(
                    Location3D,
                    ____exports.Coord.make3D(x, y, z)
                )
            end
            return __TS__New(
                Location3D,
                ____exports.Coord.make3D(x, y, 0)
            )
        end
        if type(x) == "number" then
            return __TS__New(
                Location3D,
                ____exports.Coord.make3D(x, x, x)
            )
        end
        return __TS__New(Location3D, x)
    end
    return __TS__New(
        Location3D,
        ____exports.Coord.makeEmpty3D()
    )
end
function Location.makeXZ(x, z)
    if x then
        if z then
            return __TS__New(
                LocationXZ,
                ____exports.Coord.makeXZ(x, z)
            )
        end
        if type(x) == "number" then
            return __TS__New(
                LocationXZ,
                ____exports.Coord.makeXZFromPos(x)
            )
        end
        return __TS__New(LocationXZ, x)
    end
    return __TS__New(
        LocationXZ,
        ____exports.Coord.makeEmptyXZ()
    )
end
__TS__SetDescriptor(
    Location.prototype,
    "coordType",
    {get = function(self)
    end},
    true
)
__TS__SetDescriptor(
    Location.prototype,
    "coord2D",
    {get = function(self)
    end},
    true
)
__TS__SetDescriptor(
    Location.prototype,
    "coord3D",
    {get = function(self)
    end},
    true
)
__TS__SetDescriptor(
    Location.prototype,
    "mapPosXZ",
    {get = function(self)
    end},
    true
)
Location2D = __TS__Class()
Location2D.name = "Location2D"
__TS__ClassExtends(Location2D, ____exports.Location)
function Location2D.prototype.____constructor(self, coord)
    Location2D.____super.prototype.____constructor(self)
    self.coord = coord
end
function Location2D.prototype.copy(self)
    return __TS__New(
        Location2D,
        ____exports.Coord.copy2D(self.coord)
    )
end
function Location2D.prototype.ensureOnGround(self)
    return self
end
function Location2D.prototype.ensureAboveGround(self)
    return self
end
function Location2D.prototype.centerOnBlock(self)
    centre_coord_on_block(self.coord)
    return self
end
function Location2D.prototype.zeroOnBlock(self)
    zero_coord_on_block(self.coord)
    return self
end
function Location2D.prototype.randomizeOnBlock(self)
    randomize_coord_on_block(self.coord)
    return self
end
__TS__SetDescriptor(
    Location2D.prototype,
    "coordType",
    {get = function(self)
        return ____exports.Coord.PopCoordType.COORD_2D
    end},
    true
)
__TS__SetDescriptor(
    Location2D.prototype,
    "coord2D",
    {get = function(self)
        return self.coord
    end},
    true
)
__TS__SetDescriptor(
    Location2D.prototype,
    "coord3D",
    {get = function(self)
        return ____exports.Coord.from2DTo3D(self.coord)
    end},
    true
)
__TS__SetDescriptor(
    Location2D.prototype,
    "mapPosXZ",
    {get = function(self)
        return ____exports.Coord.from2DToXZ(self.coord)
    end},
    true
)
Location3D = __TS__Class()
Location3D.name = "Location3D"
__TS__ClassExtends(Location3D, ____exports.Location)
function Location3D.prototype.____constructor(self, coord)
    Location3D.____super.prototype.____constructor(self)
    self.coord = coord
end
function Location3D.prototype.copy(self)
    return __TS__New(
        Location3D,
        ____exports.Coord.copy3D(self.coord)
    )
end
function Location3D.prototype.ensureOnGround(self)
    ensure_point_on_ground(self.coord)
    return self
end
function Location3D.prototype.ensureAboveGround(self)
    ensure_point_above_ground(self.coord)
    return self
end
function Location3D.prototype.centerOnBlock(self)
    centre_coord3d_on_block(self.coord)
    return self
end
function Location3D.prototype.zeroOnBlock(self)
    zero_coord_on_block(self.coord)
    return self
end
function Location3D.prototype.randomizeOnBlock(self)
    return self
end
__TS__SetDescriptor(
    Location3D.prototype,
    "coordType",
    {get = function(self)
        return ____exports.Coord.PopCoordType.COORD_3D
    end},
    true
)
__TS__SetDescriptor(
    Location3D.prototype,
    "coord2D",
    {get = function(self)
        return ____exports.Coord.from3DTo2D(self.coord)
    end},
    true
)
__TS__SetDescriptor(
    Location3D.prototype,
    "coord3D",
    {get = function(self)
        return self.coord
    end},
    true
)
__TS__SetDescriptor(
    Location3D.prototype,
    "mapPosXZ",
    {get = function(self)
        return ____exports.Coord.from3DToXZ(self.coord)
    end},
    true
)
LocationXZ = __TS__Class()
LocationXZ.name = "LocationXZ"
__TS__ClassExtends(LocationXZ, ____exports.Location)
function LocationXZ.prototype.____constructor(self, coord)
    LocationXZ.____super.prototype.____constructor(self)
    self.coord = coord
end
function LocationXZ.prototype.copy(self)
    return __TS__New(
        LocationXZ,
        ____exports.Coord.copyXZ(self.coord)
    )
end
function LocationXZ.prototype.ensureOnGround(self)
    return self
end
function LocationXZ.prototype.ensureAboveGround(self)
    return self
end
function LocationXZ.prototype.centerOnBlock(self)
    return self
end
function LocationXZ.prototype.zeroOnBlock(self)
    return self
end
function LocationXZ.prototype.randomizeOnBlock(self)
    return self
end
__TS__SetDescriptor(
    LocationXZ.prototype,
    "coordType",
    {get = function(self)
        return ____exports.Coord.PopCoordType.MAP_POS_XZ
    end},
    true
)
__TS__SetDescriptor(
    LocationXZ.prototype,
    "coord2D",
    {get = function(self)
        return ____exports.Coord.fromXZTo2D(self.coord)
    end},
    true
)
__TS__SetDescriptor(
    LocationXZ.prototype,
    "coord3D",
    {get = function(self)
        return ____exports.Coord.fromXZTo3D(self.coord)
    end},
    true
)
__TS__SetDescriptor(
    LocationXZ.prototype,
    "mapPosXZ",
    {get = function(self)
        return self.coord
    end},
    true
)
return ____exports
