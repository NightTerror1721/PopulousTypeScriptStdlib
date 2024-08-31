local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____GameTime = require("GameTime")
local Time = ____GameTime.Time
local ____IMath = require("IMath")
local IMath = ____IMath.IMath
local ____Markers = require("Markers")
local Marker = ____Markers.Marker
require("PopModules")
local ____Common = require("Components.Common")
local BaseControllerScriptComponent = ____Common.BaseControllerScriptComponent
____exports.GuardController = __TS__Class()
local GuardController = ____exports.GuardController
GuardController.name = "GuardController"
__TS__ClassExtends(GuardController, BaseControllerScriptComponent)
function GuardController.prototype.____constructor(self, tribe)
    BaseControllerScriptComponent.prototype.____constructor(self, "GuardController", tribe)
    self._entries = {}
    self._initialEntries = {}
    self._checkPeriod = 30
    self._numPerTime = 1
    self._nextValidEntry = 0
    self.state = {
        idx = 0,
        remainingSeconds = self._checkPeriod,
        lastUpdateSeconds = Time.current().seconds,
        initials = false,
        registered = false
    }
end
function GuardController.prototype.registerEntry(self, marker1, marker2, braves, warriors, superWarriors, preachers, condition)
    if Marker:isMarker(marker1) then
        self:_registerEntry(
            self._entries,
            marker1,
            marker2,
            braves,
            warriors,
            superWarriors,
            preachers,
            condition
        )
    elseif marker1.marker1 ~= nil then
        self:_registerEntry(
            self._entries,
            marker1.marker1,
            marker1.marker2,
            marker1.braves,
            marker1.warriors,
            marker1.superWarriors,
            marker1.preachers,
            marker1.condition
        )
    else
        __TS__ArrayForEach(
            marker1,
            function(____, entry)
                self:_registerEntry(
                    self._entries,
                    entry.marker1,
                    entry.marker2,
                    entry.braves,
                    entry.warriors,
                    entry.superWarriors,
                    entry.preachers,
                    entry.condition
                )
            end
        )
    end
end
function GuardController.prototype.registerInitialEntry(self, marker1, marker2, braves, warriors, superWarriors, preachers, condition)
    if Marker:isMarker(marker1) then
        self:_registerEntry(
            self._initialEntries,
            marker1,
            marker2,
            braves,
            warriors,
            superWarriors,
            preachers,
            condition
        )
    elseif marker1.marker1 ~= nil then
        self:_registerEntry(
            self._initialEntries,
            marker1.marker1,
            marker1.marker2,
            marker1.braves,
            marker1.warriors,
            marker1.superWarriors,
            marker1.preachers,
            marker1.condition
        )
    else
        __TS__ArrayForEach(
            marker1,
            function(____, entry)
                self:_registerEntry(
                    self._initialEntries,
                    entry.marker1,
                    entry.marker2,
                    entry.braves,
                    entry.warriors,
                    entry.superWarriors,
                    entry.preachers,
                    entry.condition
                )
            end
        )
    end
end
function GuardController.prototype.registerEntriesToAI(self)
    local state = self.state
    if state.registered then
        return
    end
    state.registered = true
    __TS__ArrayForEach(
        self._initialEntries,
        function(____, entry) return self._tribe.ai:setMarkerEntry(entry) end
    )
    __TS__ArrayForEach(
        self._entries,
        function(____, entry) return self._tribe.ai:setMarkerEntry(entry) end
    )
end
function GuardController.prototype.updateEntries(self, delta)
    if #self._entries < 1 then
        return
    end
    local state = self.state
    state.remainingSeconds = state.remainingSeconds - delta
    while state.remainingSeconds <= 0 do
        state.remainingSeconds = state.remainingSeconds + self._checkPeriod
        local initialIdx = state.idx
        local remaining = self._numPerTime
        while remaining > 0 do
            local entry = self._entries[state.idx + 1]
            state.idx = state.idx % #self._entries
            if entry.condition == nil or entry.condition() then
                self._tribe.ai:executeMarkerEntries(entry.entry)
                remaining = remaining - 1
            end
            if state.idx == initialIdx then
                break
            end
        end
    end
end
function GuardController.prototype.updateInitialEntries(self, deltaTime)
    if not self.state.initials and deltaTime:isAtLeast(2) then
        self.state.initials = true
        __TS__ArrayForEach(
            self._initialEntries,
            function(____, entry) return self._tribe.ai:executeMarkerEntries(entry.entry) end
        )
    end
end
function GuardController.prototype._registerEntry(self, entriesList, marker1, marker2, braves, warriors, superWarriors, preachers, condition)
    local entry = {
        entry = self._nextValidEntry,
        marker1 = marker1,
        marker2 = marker2,
        braves = braves,
        warriors = warriors,
        superWarriors = superWarriors,
        preachers = preachers,
        condition = condition
    }
    self._nextValidEntry = self._nextValidEntry + 1
    entriesList[#entriesList + 1] = entry
end
function GuardController.prototype.update(self, deltaTime)
    if deltaTime.turn == 0 then
        self:registerEntriesToAI()
    end
    local state = self.state
    local currentSeconds = deltaTime.seconds
    local delta = currentSeconds - state.lastUpdateSeconds
    if delta > 0 then
        state.lastUpdateSeconds = currentSeconds
        self:updateEntries(delta)
        self:updateInitialEntries(deltaTime)
    end
end
__TS__SetDescriptor(
    GuardController.prototype,
    "checkPeriod",
    {
        get = function(self)
            return self._checkPeriod
        end,
        set = function(self, value)
            self._checkPeriod = IMath.imax(0, value)
        end
    },
    true
)
__TS__SetDescriptor(
    GuardController.prototype,
    "numPerTime",
    {
        get = function(self)
            return self._numPerTime
        end,
        set = function(self, value)
            self._numPerTime = IMath.imax(1, value)
        end
    },
    true
)
return ____exports
