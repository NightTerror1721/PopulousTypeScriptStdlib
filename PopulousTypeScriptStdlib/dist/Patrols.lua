local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____IMath = require("IMath")
local IMath = ____IMath.IMath
local ____Markers = require("Markers")
local Marker = ____Markers.Marker
____exports.PatrolMode = PatrolMode or ({})
____exports.PatrolMode.CIRCLE = 0
____exports.PatrolMode[____exports.PatrolMode.CIRCLE] = "CIRCLE"
____exports.PatrolMode.PATH = 1
____exports.PatrolMode[____exports.PatrolMode.PATH] = "PATH"
____exports.Patrol = __TS__Class()
local Patrol = ____exports.Patrol
Patrol.name = "Patrol"
function Patrol.prototype.____constructor(self, id, tribe)
    self.id = id
    self.tribe = tribe
    self.mode = ____exports.PatrolMode.CIRCLE
    self._marker1 = Marker.INVALID
    self._marker2 = Marker.INVALID
    self._braves = 0
    self._warriors = 0
    self._superWarriors = 0
    self._preachers = 0
end
function Patrol.prototype.setCircleMode(self, center)
    self.mode = ____exports.PatrolMode.CIRCLE
    self._marker1 = Marker:of(center)
    self._marker2 = Marker.INVALID
end
function Patrol.prototype.setPathMode(self, start, ____end)
    self.mode = ____exports.PatrolMode.CIRCLE
    self._marker1 = Marker:of(start)
    self._marker2 = Marker:of(____end)
end
function Patrol.prototype.setPersons(self, braves, warriors, superWarriors, preachers)
    if braves and type(braves) ~= "number" then
        self._braves = braves.braves and IMath.inatural(braves.braves) or 0
        self._warriors = braves.warriors and IMath.inatural(braves.warriors) or 0
        self._superWarriors = braves.superWarriors and IMath.inatural(braves.superWarriors) or 0
        self._preachers = braves.preachers and IMath.inatural(braves.preachers) or 0
    else
        self._braves = braves and IMath.inatural(braves) or 0
        self._warriors = warriors and IMath.inatural(warriors) or 0
        self._superWarriors = superWarriors and IMath.inatural(superWarriors) or 0
        self._preachers = preachers and IMath.inatural(preachers) or 0
    end
end
function Patrol.prototype.set(self, data)
    if data.mode == ____exports.PatrolMode.CIRCLE then
        self:setCircleMode(data.center)
    else
        self:setPathMode(data.start, data["end"])
    end
    self:setPersons(data)
end
Patrol.MAX_PATROLS = 16
__TS__SetDescriptor(
    Patrol.prototype,
    "centerMarker",
    {
        get = function(self)
            return self._marker1
        end,
        set = function(self, marker)
            self._marker1 = Marker:of(marker)
        end
    },
    true
)
__TS__SetDescriptor(
    Patrol.prototype,
    "startMarker",
    {
        get = function(self)
            return self._marker1
        end,
        set = function(self, marker)
            self._marker1 = Marker:of(marker)
        end
    },
    true
)
__TS__SetDescriptor(
    Patrol.prototype,
    "endMarker",
    {
        get = function(self)
            return self._marker2
        end,
        set = function(self, marker)
            self._marker2 = Marker:of(marker)
        end
    },
    true
)
__TS__SetDescriptor(
    Patrol.prototype,
    "braves",
    {
        get = function(self)
            return self._braves
        end,
        set = function(self, amount)
            self._braves = IMath.inatural(amount)
        end
    },
    true
)
__TS__SetDescriptor(
    Patrol.prototype,
    "warriors",
    {
        get = function(self)
            return self._warriors
        end,
        set = function(self, amount)
            self._warriors = IMath.inatural(amount)
        end
    },
    true
)
__TS__SetDescriptor(
    Patrol.prototype,
    "superWarriors",
    {
        get = function(self)
            return self._superWarriors
        end,
        set = function(self, amount)
            self._superWarriors = IMath.inatural(amount)
        end
    },
    true
)
__TS__SetDescriptor(
    Patrol.prototype,
    "preachers",
    {
        get = function(self)
            return self._preachers
        end,
        set = function(self, amount)
            self._preachers = IMath.inatural(amount)
        end
    },
    true
)
return ____exports
