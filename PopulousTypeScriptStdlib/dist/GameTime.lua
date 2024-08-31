local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__ObjectDefineProperty = ____lualib.__TS__ObjectDefineProperty
local ____exports = {}
local ____IMath = require("IMath")
local IMath = ____IMath.IMath
require("PopModules")
local _gsi = gsi()
____exports.Time = __TS__Class()
local Time = ____exports.Time
Time.name = "Time"
function Time.prototype.____constructor(self, turn)
    self.turn = turn
    self.seconds = turn / ____exports.Time.TURNS_PER_SECOND
end
function Time.current()
    return __TS__New(____exports.Time, _gsi.Counts.ProcessThings)
end
function Time.toTurns(self, seconds)
    return math.floor(seconds * ____exports.Time.TURNS_PER_SECOND)
end
function Time.toSeconds(self, turns)
    return turns / ____exports.Time.TURNS_PER_SECOND
end
function Time.fromSeconds(self, seconds)
    return __TS__New(
        ____exports.Time,
        ____exports.Time:toTurns(math.max(0, seconds))
    )
end
function Time.fromTurns(self, turns)
    return __TS__New(
        ____exports.Time,
        IMath.imax(0, turns)
    )
end
function Time.prototype.isTurn(self, turn)
    return self.turn == turn
end
function Time.prototype.isAtLeastTurn(self, turn)
    return self.turn >= turn
end
function Time.prototype.isAtMostTurn(self, turn)
    return self.turn <= turn
end
function Time.prototype.isBetweenTurns(self, minTurn, maxTurn)
    return math.min(minTurn, maxTurn) >= self.turn and self.turn >= math.max(minTurn, maxTurn)
end
function Time.prototype.is(self, seconds)
    return self.seconds == seconds
end
function Time.prototype.isAtLeast(self, seconds)
    return self.seconds >= seconds
end
function Time.prototype.isAtMost(self, seconds)
    return self.seconds <= seconds
end
function Time.prototype.isBetween(self, minSeconds, maxSeconds)
    return math.min(minSeconds, maxSeconds) >= self.seconds and self.seconds >= math.max(minSeconds, maxSeconds)
end
function Time.prototype.equals(self, other)
    return self.turn == other.turn
end
function Time.prototype.everyTurns(self, turns, initialDelayTurns, action)
    local turn = self.turn - (initialDelayTurns and math.max(
        0,
        math.floor(initialDelayTurns)
    ) or 0)
    if turn <= 0 then
        return false
    end
    if turn % math.floor(turns) == 0 then
        if action ~= nil then
            action()
        end
        return true
    end
    return false
end
function Time.prototype.everyPowTurns(self, base, exponent, initialDelayTurns, action)
    return self:everyTurns(
        math.floor(base ^ exponent),
        initialDelayTurns,
        action
    )
end
function Time.prototype.every2PowTurns(self, base, initialDelayTurns, action)
    return self:everyPowTurns(base, 2, initialDelayTurns, action)
end
function Time.prototype.every(self, seconds, initialDelaySeconds, action)
    local delay = initialDelaySeconds and ____exports.Time:toTurns(initialDelaySeconds) or 0
    return self:everyTurns(
        ____exports.Time:toTurns(seconds),
        delay,
        action
    )
end
Time.TURNS_PER_SECOND = 12
Time.SECONDS_PER_TURN = 1 / ____exports.Time.TURNS_PER_SECOND
__TS__ObjectDefineProperty(
    Time,
    "currentTurns",
    {get = function(self)
        return _gsi.Counts.ProcessThings
    end}
)
__TS__ObjectDefineProperty(
    Time,
    "currentSeconds",
    {get = function(self)
        return ____exports.Time:toSeconds(____exports.Time.currentTurns)
    end}
)
return ____exports
