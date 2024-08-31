local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____Location = require("Location")
local Coord = ____Location.Coord
local Location = ____Location.Location
require("PopModules")
local _gnsi = gnsi()
____exports.Marker = __TS__Class()
local Marker = ____exports.Marker
Marker.name = "Marker"
function Marker.prototype.____constructor(self, id)
    self.__Class_Marker__tag__ = "__Class_Marker__tag__"
    self.id = id
end
function Marker.of(self, id)
    if type(id) == "number" then
        if id < 0 or id > 255 then
            return ____exports.Marker.INVALID
        end
        return ____exports.Marker.ALL[id + 1]
    end
    return id
end
function Marker.asId(self, marker)
    local id
    if type(marker) == "number" then
        id = marker
    else
        id = marker.id
    end
    return (id < -1 or id > 255) and -1 or id
end
function Marker.validOrDefault(self, marker, defaultValue)
    if defaultValue == nil then
        defaultValue = ____exports.Marker.INVALID
    end
    if not marker then
        return defaultValue
    end
    if type(marker) == "number" then
        return (marker < 0 or marker > 255) and defaultValue or marker
    end
    return (marker.id < 0 or marker.id > 255) and defaultValue or marker
end
function Marker.isMarker(self, obj)
    return obj and obj.__Class_Marker__tag__ ~= nil
end
function Marker.prepareMarkers(self)
    local markers = {}
    do
        local i = 0
        while i < 255 do
            markers[#markers + 1] = __TS__New(____exports.Marker, i)
            i = i + 1
        end
    end
    return markers
end
Marker.NUM_MARKERS = 256
Marker.ALL = ____exports.Marker:prepareMarkers()
Marker.INVALID = __TS__New(____exports.Marker, -1)
__TS__SetDescriptor(
    Marker.prototype,
    "isValid",
    {get = function(self)
        return self.id >= 0 and self.id <= 255
    end},
    true
)
__TS__SetDescriptor(
    Marker.prototype,
    "isInvalid",
    {get = function(self)
        return self.id < 0 or self.id > 255
    end},
    true
)
__TS__SetDescriptor(
    Marker.prototype,
    "positionIndex",
    {get = function(self)
        if self.isInvalid then
            return 0
        end
        return _gnsi.ThisLevelHeader.Markers[self.id]
    end},
    true
)
__TS__SetDescriptor(
    Marker.prototype,
    "location",
    {get = function(self)
        if self.isInvalid then
            return Location.make2D(0, 0)
        end
        return Location.makeXZ(_gnsi.ThisLevelHeader.Markers[self.id])
    end},
    true
)
__TS__SetDescriptor(
    Marker.prototype,
    "mapCoords",
    {get = function(self)
        if self.isInvalid then
            return {0, 0}
        end
        local coords = Coord.makeXZFromPos(_gnsi.ThisLevelHeader.Markers[self.id])
        return {coords.XZ.X, coords.XZ.Z}
    end},
    true
)
do
    local i = 0
    while i < 255 do
        ____exports.Marker["MK" .. tostring(i)] = ____exports.Marker.ALL[i + 1]
        i = i + 1
    end
end
return ____exports
