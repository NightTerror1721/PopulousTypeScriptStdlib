local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local DrumTowerUtils
local ____GameTime = require("GameTime")
local Time = ____GameTime.Time
local ____IMath = require("IMath")
local IMath = ____IMath.IMath
local ____Map = require("Map")
local Map = ____Map.Map
require("PopModules")
local ____Random = require("Random")
local Random = ____Random.default
local ____Common = require("Components.Common")
local BaseControllerScriptComponent = ____Common.BaseControllerScriptComponent
____exports.DrumTowerController = __TS__Class()
local DrumTowerController = ____exports.DrumTowerController
DrumTowerController.name = "DrumTowerController"
__TS__ClassExtends(DrumTowerController, BaseControllerScriptComponent)
function DrumTowerController.prototype.____constructor(self, tribe)
    BaseControllerScriptComponent.prototype.____constructor(self, "DrumTowerController", tribe)
    self._entries = {}
    self._buildCheckPeriod = 20
    self._populateCheckPeriod = 20
    self._buildsPerTime = 1
    self._populationsPerTime = 2
    self.state = {
        buildIdx = 0,
        populateIdx = 0,
        buildCheckRemainingSeconds = self._buildCheckPeriod,
        populateCheckRemainingSeconds = self._populateCheckPeriod,
        lastUpdateSeconds = Time.current().seconds
    }
end
function DrumTowerController.prototype.registerEntry(self, xOrLoc, zOrRad, radOrPer, perOrCond, condOrUndef)
    local entry
    if type(xOrLoc) == "number" then
        entry = {
            x = xOrLoc,
            z = zOrRad,
            checkRadius = radOrPer,
            person = perOrCond,
            condition = condOrUndef
        }
    else
        local x, z = Map.getCellComponentsFromLocation(xOrLoc)
        entry = {
            x = x,
            z = z,
            checkRadius = zOrRad,
            person = radOrPer,
            condition = perOrCond
        }
    end
    local ____self__entries_0 = self._entries
    ____self__entries_0[#____self__entries_0 + 1] = entry
end
function DrumTowerController.prototype.update(self, deltaTime)
    if #self._entries < 1 then
        return
    end
    local state = self.state
    local currentSeconds = deltaTime.seconds
    local delta = currentSeconds - state.lastUpdateSeconds
    if delta > 0 then
        state.lastUpdateSeconds = currentSeconds
        self:updateBuilds(delta)
        self:updatePopulations(delta)
    end
end
function DrumTowerController.prototype.updateBuilds(self, delta)
    local state = self.state
    state.buildCheckRemainingSeconds = state.buildCheckRemainingSeconds - delta
    while state.buildCheckRemainingSeconds <= 0 do
        state.buildCheckRemainingSeconds = state.buildCheckRemainingSeconds + self._buildCheckPeriod
        local initialIdx = state.buildIdx
        local remaining = self._buildsPerTime
        while remaining > 0 do
            local entry = self._entries[state.buildIdx + 1]
            state.buildIdx = (state.buildIdx + 1) % #self._entries
            if entry.condition == nil or entry.condition() then
                ____exports.DrumTowerUtils:buildDrumTowerIfNotExists(self._tribe, entry.x, entry.z, entry.checkRadius)
                remaining = remaining - 1
            end
            if state.buildIdx == initialIdx then
                break
            end
        end
    end
end
function DrumTowerController.prototype.updatePopulations(self, delta)
    local state = self.state
    state.populateCheckRemainingSeconds = state.populateCheckRemainingSeconds - delta
    while state.populateCheckRemainingSeconds <= 0 do
        state.populateCheckRemainingSeconds = state.populateCheckRemainingSeconds + self._populateCheckPeriod
        local initialIdx = state.populateIdx
        local remaining = self._populationsPerTime
        while remaining > 0 do
            local entry = self._entries[state.populateIdx + 1]
            local model = ____exports.DrumTowerController.selectPerson(entry)
            state.populateIdx = (state.populateIdx + 1) % #self._entries
            if model ~= nil then
                self._tribe.ai:populateDrumTower(model, entry.x, entry.z)
                remaining = remaining - 1
            end
            if state.populateIdx == initialIdx then
                break
            end
        end
    end
end
function DrumTowerController.selectPerson(entry)
    if entry.person == nil then
        return nil
    end
    if type(entry.person) == "number" then
        return entry.person
    end
    return Random.element(entry.person)
end
__TS__SetDescriptor(
    DrumTowerController.prototype,
    "buildCheckPeriod",
    {
        get = function(self)
            return self._buildCheckPeriod
        end,
        set = function(self, value)
            self._buildCheckPeriod = IMath.imax(0, value)
        end
    },
    true
)
__TS__SetDescriptor(
    DrumTowerController.prototype,
    "populateCheckPeriod",
    {
        get = function(self)
            return self._populateCheckPeriod
        end,
        set = function(self, value)
            self._populateCheckPeriod = IMath.imax(0, value)
        end
    },
    true
)
__TS__SetDescriptor(
    DrumTowerController.prototype,
    "buildsPerTime",
    {
        get = function(self)
            return self._buildsPerTime
        end,
        set = function(self, value)
            self._buildsPerTime = IMath.imax(1, value)
        end
    },
    true
)
__TS__SetDescriptor(
    DrumTowerController.prototype,
    "populationsPerTime",
    {
        get = function(self)
            return self._populationsPerTime
        end,
        set = function(self, value)
            self._populationsPerTime = IMath.imax(1, value)
        end
    },
    true
)
____exports.DrumTowerUtils = {}
DrumTowerUtils = ____exports.DrumTowerUtils
do
    function DrumTowerUtils.findDrumTowerAtLocation(self, tribe, xOrLoc, zOrRadius, radiusOrUndef)
        local x
        local z
        local radius
        if type(xOrLoc) == "number" then
            x = xOrLoc
            z = zOrRadius
            radius = radiusOrUndef
        else
            x, z = Map.getCellComponentsFromLocation(xOrLoc)
            radius = zOrRadius
        end
        local tower = Map.findFirstThingOf(
            2,
            4,
            x,
            z,
            radius,
            CIRCULAR
        )
        return tower and tower.Owner == tribe.id and tower or nil
    end
    function DrumTowerUtils.populateDrumTower(self, tribe, model, xOrLoc, zOrRadius, radiusOrUndef)
        local tower = DrumTowerUtils.findDrumTowerAtLocation(
            nil,
            tribe,
            xOrLoc,
            zOrRadius,
            radiusOrUndef
        )
        if tower then
            local pos = tower.Pos.D2
            tribe.ai:populateDrumTower(model, pos.Xpos, pos.Zpos)
            return true
        end
        return false
    end
    function DrumTowerUtils.existsDrumTowerBuildOrShapeAtLocation(self, tribe, xOrLoc, zOrRadius, radiusOrUndef)
        local x
        local z
        local radius
        if type(xOrLoc) == "number" then
            x = xOrLoc
            z = zOrRadius
            radius = radiusOrUndef
        else
            x, z = Map.getCellComponentsFromLocation(xOrLoc)
            radius = zOrRadius
        end
        local tower = Map.findFirstThingOf(
            2,
            4,
            x,
            z,
            radius,
            CIRCULAR
        )
        if tower and tower.Owner == tribe.id then
            return true
        end
        local shape = Map.findFirstThingOf(
            9,
            1,
            x,
            z,
            radius,
            CIRCULAR
        )
        return shape ~= nil and shape.Owner == tribe.id
    end
    function DrumTowerUtils.buildDrumTowerIfNotExists(self, tribe, xOrLoc, zOrRadius, radiusOrUndef)
        if type(xOrLoc) == "number" then
            local radius = radiusOrUndef ~= nil and radiusOrUndef or 3
            if DrumTowerUtils.existsDrumTowerBuildOrShapeAtLocation(
                nil,
                tribe,
                xOrLoc,
                zOrRadius,
                radius
            ) then
                return
            end
            tribe.ai:buildDrumTower(xOrLoc, zOrRadius)
        else
            local radius = zOrRadius ~= nil and zOrRadius or 3
            if DrumTowerUtils.existsDrumTowerBuildOrShapeAtLocation(nil, tribe, xOrLoc, radius) then
                return
            end
            tribe.ai:buildDrumTower(xOrLoc)
        end
    end
end
return ____exports
