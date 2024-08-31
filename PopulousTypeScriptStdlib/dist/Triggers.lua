--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____IMath = require("IMath")
local IMath = ____IMath.IMath
local ____Map = require("Map")
local Map = ____Map.Map
local ____Markers = require("Markers")
local Marker = ____Markers.Marker
require("PopModules")
____exports.Trigger = {}
local Trigger = ____exports.Trigger
do
    function Trigger.fireLevelWon()
        TRIGGER_LEVEL_WON()
    end
    function Trigger.fireLevelLost()
        TRIGGER_LEVEL_LOST()
    end
    function Trigger.fireAtMarker(marker)
        TRIGGER_THING(Marker:asId(marker))
    end
    function Trigger.fire(trigger, times)
        times = times ~= nil and IMath.imax(1, times) or 1
        local ____trigger_u_Trigger_0, ____TriggeredPendingCount_1 = trigger.u.Trigger, "TriggeredPendingCount"
        ____trigger_u_Trigger_0[____TriggeredPendingCount_1] = ____trigger_u_Trigger_0[____TriggeredPendingCount_1] + times
    end
    function Trigger.fireAtLocation(xOrLoc, zOrTimes, timesOrUndef)
        local trigger
        if type(xOrLoc) == "number" then
            trigger = Map.findFirstThingOf(6, 6, xOrLoc, zOrTimes)
            if trigger ~= nil then
                ____exports.Trigger.fire(trigger, timesOrUndef)
            end
        else
            trigger = Map.findFirstThingOf(6, 6, xOrLoc)
            if trigger ~= nil then
                ____exports.Trigger.fire(trigger, zOrTimes)
            end
        end
    end
    function Trigger.getRemainingCounts(xOrLoc, zOrTimes)
        local trigger = Map.findFirstThingOf(6, 6, xOrLoc, zOrTimes)
        return trigger ~= nil and trigger.u.Trigger.TriggerCount or 0
    end
    function Trigger.getRemainingOcurrences(xOrLoc, zOrTimes)
        local trigger = Map.findFirstThingOf(6, 6, xOrLoc, zOrTimes)
        return trigger ~= nil and trigger.u.Trigger.NumOccurences or 0
    end
end
return ____exports
