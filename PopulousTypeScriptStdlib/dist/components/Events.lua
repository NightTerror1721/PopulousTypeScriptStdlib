local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ObjectEntries = ____lualib.__TS__ObjectEntries
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__New = ____lualib.__TS__New
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local ____exports = {}
local ____IMath = require("IMath")
local IMath = ____IMath.IMath
local ____Common = require("Components.Common")
local BaseEnvironmentControllerScriptComponent = ____Common.BaseEnvironmentControllerScriptComponent
____exports.EventCondition = {}
local EventCondition = ____exports.EventCondition
do
    EventCondition["and"] = function(self, cnd1, cnds)
        if not cnds then
            if type(cnd1) == "function" then
                return cnd1
            end
            return function(event)
                for ____, cnd in ipairs(cnd1) do
                    if not cnd(event) then
                        return false
                    end
                end
                return true
            end
        end
        if type(cnds) == "function" then
            if type(cnd1) == "function" then
                return function(event) return cnd1(event) and cnds(event) end
            end
            if #cnd1 < 1 then
                return cnds
            end
            return function(event) return cnd1[1](event) and cnds(event) end
        end
        if #cnds < 1 then
            if type(cnd1) == "function" then
                return cnd1
            end
            return function(_) return true end
        end
        if type(cnd1) == "function" then
            return function(event)
                if not cnd1(event) then
                    return false
                end
                for ____, cnd in ipairs(cnds) do
                    if not cnd(event) then
                        return false
                    end
                end
                return true
            end
        end
        return function(event)
            for ____, cnd in ipairs(cnd1) do
                if not cnd(event) then
                    return false
                end
            end
            for ____, cnd in ipairs(cnds) do
                if not cnd(event) then
                    return false
                end
            end
            return true
        end
    end
    EventCondition["or"] = function(self, cnd1, cnds)
        if not cnds then
            if type(cnd1) == "function" then
                return cnd1
            end
            return function(event)
                for ____, cnd in ipairs(cnd1) do
                    if cnd(event) then
                        return true
                    end
                end
                return false
            end
        end
        if type(cnds) == "function" then
            if type(cnd1) == "function" then
                return function(event) return cnd1(event) or cnds(event) end
            end
            if #cnd1 < 1 then
                return cnds
            end
            return function(event) return cnd1[1](event) or cnds(event) end
        end
        if #cnds < 1 then
            if type(cnd1) == "function" then
                return cnd1
            end
            return function(_) return true end
        end
        if type(cnd1) == "function" then
            return function(event)
                if cnd1(event) then
                    return true
                end
                for ____, cnd in ipairs(cnds) do
                    if cnd(event) then
                        return true
                    end
                end
                return false
            end
        end
        return function(event)
            for ____, cnd in ipairs(cnd1) do
                if cnd(event) then
                    return true
                end
            end
            for ____, cnd in ipairs(cnds) do
                if cnd(event) then
                    return true
                end
            end
            return false
        end
    end
    EventCondition["not"] = function(self, cnd)
        return function(event) return not cnd(event) end
    end
end
local EventHandler = __TS__Class()
EventHandler.name = "EventHandler"
function EventHandler.prototype.____constructor(self, event)
    self._event = event
    self._action = event.action
    local ____temp_0
    if not event.condition then
        ____temp_0 = nil
    else
        ____temp_0 = type(event.condition) == "function" and event.condition or event.condition.condition
    end
    self._condition = ____temp_0
    if self._condition and event.condition and type(event.condition) ~= "function" then
        self._conditionFrequencyTurns = event.condition.frequency and event.condition.frequency.turn > 0 and IMath.toInteger(event.condition.frequency.turn) or 1
        self._conditionDelayTurns = event.condition.delay and event.condition.delay.turn >= 0 and IMath.toInteger(event.condition.delay.turn) or 0
    else
        self._conditionFrequencyTurns = 1
        self._conditionDelayTurns = 0
    end
    self._onInit = event.onInit
    local ____temp_1
    if not event.onUpdate then
        ____temp_1 = nil
    else
        ____temp_1 = type(event.onUpdate) == "function" and event.onUpdate or event.onUpdate.onUpdate
    end
    self._onUpdate = ____temp_1
    if self._onUpdate and event.onUpdate and type(event.onUpdate) ~= "function" then
        self._onUpdateFrequencyTurns = event.onUpdate.frequency and event.onUpdate.frequency.turn > 0 and IMath.toInteger(event.onUpdate.frequency.turn) or 1
        self._onUpdateDelayTurns = event.onUpdate.delay and event.onUpdate.delay.turn >= 0 and IMath.toInteger(event.onUpdate.delay.turn) or 0
    else
        self._onUpdateFrequencyTurns = 1
        self._onUpdateDelayTurns = 0
    end
    if event.once then
        self._times = 1
    else
        self._times = event.times and event.times > 0 and IMath.imax(1, event.times) or nil
    end
    self._expired = false
end
function EventHandler.prototype.initiate(self)
    if self._onInit then
        self._onInit(self._event)
    end
end
function EventHandler.prototype.update(self, time)
    if self._onUpdate and time:everyTurns(self._onUpdateFrequencyTurns, self._onUpdateDelayTurns) then
        self._onUpdate(self._event, time)
    end
end
function EventHandler.prototype.check(self, time)
    return time:everyTurns(self._conditionFrequencyTurns, self._conditionDelayTurns) and (not self._condition or self._condition(self._event))
end
function EventHandler.prototype.run(self)
    self._action(self._event)
    if self._times then
        self._times = self._times - 1
        if self._times < 1 then
            self._times = 0
            self._expired = true
        end
    end
end
function EventHandler.prototype.load(self, backup)
    for ____, ____value in ipairs(__TS__ObjectEntries(backup.data)) do
        local key = ____value[1]
        local value = ____value[2]
        self._event.data[key] = value
    end
    self._times = backup.times
    self._expired = backup.expired
end
function EventHandler.prototype.save(self)
    return {
        data = __TS__ObjectAssign(self._event.data),
        times = self._times,
        expired = self._expired
    }
end
__TS__SetDescriptor(
    EventHandler.prototype,
    "isExpired",
    {get = function(self)
        return self._expired
    end},
    true
)
____exports.EventController = __TS__Class()
local EventController = ____exports.EventController
EventController.name = "EventController"
__TS__ClassExtends(EventController, BaseEnvironmentControllerScriptComponent)
function EventController.prototype.____constructor(self)
    BaseEnvironmentControllerScriptComponent.prototype.____constructor(self, "EventController")
    self._events = {}
    self.state = {initiated = false, backups = {}}
end
function EventController.prototype.registerEvent(self, event)
    if self.state.initiated then
        error(nil, "Cannot register events after game begins")
    end
    if event.data ~= nil then
        local handler = __TS__New(EventHandler, event)
        local ____self__events_2 = self._events
        ____self__events_2[#____self__events_2 + 1] = handler
    else
        for ____, evt in ipairs(event) do
            local handler = __TS__New(EventHandler, evt)
            local ____self__events_3 = self._events
            ____self__events_3[#____self__events_3 + 1] = handler
        end
    end
end
function EventController.prototype.update(self, time)
    if time.turn == 0 then
        if not self.state.initiated then
            self.state.initiated = true
            __TS__ArrayForEach(
                self._events,
                function(____, e) return e:initiate() end
            )
        end
    end
    for ____, event in ipairs(self._events) do
        if not event.isExpired then
            event:update(time)
            if event:check(time) then
                event:run()
            end
        end
    end
end
function EventController.prototype.onPreSave(self)
    local backups = {}
    for ____, event in ipairs(self._events) do
        backups[#backups + 1] = event:save()
    end
    self.state.backups = backups
end
function EventController.prototype.onPostLoad(self)
    local backups = self.state.backups
    local len = IMath.imin(#self._events, #backups)
    do
        local i = 0
        while i < len do
            self._events[i + 1]:load(backups[i + 1])
            i = i + 1
        end
    end
end
return ____exports
