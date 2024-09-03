local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__New = ____lualib.__TS__New
local __TS__ObjectValues = ____lualib.__TS__ObjectValues
local ____exports = {}
local AttackUtils
local ____GameTime = require("GameTime")
local Time = ____GameTime.Time
local ____IMath = require("IMath")
local IMath = ____IMath.IMath
local ____Markers = require("Markers")
local Marker = ____Markers.Marker
require("PopModules")
local ____Random = require("Random")
local Random = ____Random.default
local ____Common = require("Components.Common")
local BaseControllerScriptComponent = ____Common.BaseControllerScriptComponent
local __DebugMode = false
function ____exports.setAttackDebugModeEnabled(self, enabled)
    __DebugMode = enabled
end
function ____exports.isAttackDebugModeEnabled(self)
    return __DebugMode
end
local AttackControllerEntry = __TS__Class()
AttackControllerEntry.name = "AttackControllerEntry"
function AttackControllerEntry.prototype.____constructor(self, entryId, template, controllerState)
    self.entryId = entryId
    self._template = template
    self._controllerState = controllerState
    self._controllerState.entries[self.entryId] = {}
    self:enable()
end
function AttackControllerEntry.prototype.computeNextPeriod(self)
    local period = math.max(0, self._template.everySeconds or 0)
    if self._template.randomExtraEverySeconds ~= nil then
        local rand = Time:toTurns(self._template.randomExtraEverySeconds)
        rand = Random.integer(0, rand + 1)
        rand = Time:toSeconds(rand)
        period = period + rand
    end
    return period
end
function AttackControllerEntry.prototype.enable(self)
    self.isEnabled = true
    self.lastAttackSeconds = Time.currentSeconds
    self.delaySeconds = math.max(0, self._template.delaySeconds or 0)
    self.periodSeconds = self:computeNextPeriod()
end
function AttackControllerEntry.prototype.disable(self)
    self.isEnabled = false
end
function AttackControllerEntry.prototype.update(self, currentSeconds, delta)
    if not self.isEnabled or self._template.condition ~= nil and not self._template.condition() then
        return
    end
    if not not self._template.forceFirst then
        self._template.forceFirst = false
        self.delaySeconds = 0
        self.lastAttackSeconds = currentSeconds - self.periodSeconds
    end
    if self.delaySeconds > 0 then
        self.delaySeconds = self.delaySeconds - delta
        if self.delaySeconds > 0 then
            if __DebugMode then
                local ____opt_0 = self._template.attackerTribe
                local ownerName = ____opt_0 and ____opt_0.name
                local secs = IMath.toInteger(self.delaySeconds * 100) / 100
                log(((((("[" .. tostring(ownerName)) .. "][Attack[") .. tostring(self.entryId)) .. "]]: Delay for: ") .. tostring(secs)) .. " sec")
            end
            return
        end
        self.lastAttackSeconds = currentSeconds + self.delaySeconds
        self.delaySeconds = 0
    end
    if currentSeconds - self.lastAttackSeconds >= self.periodSeconds then
        if self.periodSeconds <= 0 then
            self:disable()
        end
        local override = self._template.override ~= nil and self._template.override() or ({})
        local result = AttackUtils.doAttackNow(self._template, override, self.entryId)
        if result then
            if self._template.once then
                self:disable()
            else
                self.lastAttackSeconds = currentSeconds
                self.periodSeconds = self:computeNextPeriod()
            end
        end
        if self._template.callback ~= nil then
            self._template.callback(result)
        end
    elseif __DebugMode then
        local time = self.periodSeconds - (currentSeconds - self.lastAttackSeconds)
        local ____opt_2 = self._template.attackerTribe
        local ownerName = ____opt_2 and ____opt_2.name
        local secs = IMath.toInteger(time * 100) / 100
        log(((((("[" .. tostring(ownerName)) .. "][Attack[") .. tostring(self.entryId)) .. "]]: Next on '") .. tostring(secs)) .. "' seconds")
    end
end
__TS__SetDescriptor(
    AttackControllerEntry.prototype,
    "state",
    {get = function(self)
        return self._controllerState.entries[self.entryId]
    end},
    true
)
__TS__SetDescriptor(
    AttackControllerEntry.prototype,
    "isEnabled",
    {
        get = function(self)
            return self.state.enabled
        end,
        set = function(self, value)
            self.state.enabled = value
        end
    },
    true
)
__TS__SetDescriptor(
    AttackControllerEntry.prototype,
    "lastAttackSeconds",
    {
        get = function(self)
            return self.state.lastAttackSeconds
        end,
        set = function(self, value)
            self.state.lastAttackSeconds = value
        end
    },
    true
)
__TS__SetDescriptor(
    AttackControllerEntry.prototype,
    "delaySeconds",
    {
        get = function(self)
            return self.state.delaySeconds
        end,
        set = function(self, value)
            self.state.delaySeconds = value
        end
    },
    true
)
__TS__SetDescriptor(
    AttackControllerEntry.prototype,
    "periodSeconds",
    {
        get = function(self)
            return self.state.periodSeconds
        end,
        set = function(self, value)
            self.state.periodSeconds = value
        end
    },
    true
)
____exports.AttackController = __TS__Class()
local AttackController = ____exports.AttackController
AttackController.name = "AttackController"
__TS__ClassExtends(AttackController, BaseControllerScriptComponent)
function AttackController.prototype.____constructor(self, tribe)
    BaseControllerScriptComponent.prototype.____constructor(self, "AttackController", tribe)
    self._entries = {}
    self._lastUpdate = nil
    self.state = {entries = {}}
end
function AttackController.prototype.registerEntry(self, entryId, template)
    local entry = __TS__New(
        AttackControllerEntry,
        entryId,
        __TS__ObjectAssign({}, template),
        self.state
    )
    self._entries[entry.entryId] = entry
end
function AttackController.prototype.enableEntry(self, entryId)
    local entry = self._entries[entryId]
    if entry == nil then
        return false
    end
    if not entry.isEnabled then
        entry:enable()
    end
    return true
end
function AttackController.prototype.disableEntry(self, entryId)
    local entry = self._entries[entryId]
    if entry == nil then
        return false
    end
    if entry.isEnabled then
        entry:disable()
    end
    return true
end
function AttackController.prototype.update(self, deltaTime)
    local currentSeconds = deltaTime.seconds
    if self._lastUpdate == nil then
        self._lastUpdate = currentSeconds
        return
    end
    local delta = currentSeconds - self._lastUpdate
    self._lastUpdate = currentSeconds
    for ____, entry in ipairs(__TS__ObjectValues(self._entries)) do
        entry:update(currentSeconds, delta)
    end
end
function AttackController.doAttackNow(self, template, override)
    return AttackUtils.doAttackNow(template, override)
end
AttackUtils = {}
do
    local function replaceByOverrided(template, override)
        return __TS__ObjectAssign({}, template, override)
    end
    local function prepareParams(template, override)
        if override ~= nil then
            template = replaceByOverrided(template, override)
        end
        local ____template_attackerTribe_10 = template.attackerTribe
        local ____template_targetTribe_11 = template.targetTribe
        local ____IMath_imax_result_12 = IMath.imax(template.minPeople or 0, 0)
        local ____IMath_imax_result_13 = IMath.imax(
            template.maxPeople or 0,
            IMath.imax(template.minPeople or 0, 0)
        )
        local ____IMath_iclamp_result_14 = IMath.iclamp(template.damage or 999, 0, 999)
        local ____temp_15 = template.targetType or ATTACK_MARKER
        local ____temp_16 = template.targetModel or 0
        local ____temp_17 = template.mode or ATTACK_NORMAL
        local ____temp_18 = template.spell1 or 0
        local ____temp_19 = template.spell2 or 0
        local ____temp_20 = template.spell3 or 0
        local ____temp_21 = Marker:of(Marker:validOrDefault(template.marker1))
        local ____temp_22 = Marker:of(Marker:validOrDefault(template.marker2))
        local ____template_lookAfter_4 = template.lookAfter
        if ____template_lookAfter_4 == nil then
            ____template_lookAfter_4 = false
        end
        local ____temp_23 = template.direction or -1
        local ____template_optionalShama_5 = template.optionalShama
        if ____template_optionalShama_5 == nil then
            ____template_optionalShama_5 = false
        end
        local ____template_ignoreMana_6 = template.ignoreMana
        if ____template_ignoreMana_6 == nil then
            ____template_ignoreMana_6 = false
        end
        local ____template_shaman_7 = template.shaman
        if ____template_shaman_7 == nil then
            ____template_shaman_7 = false
        end
        local ____template_shaman_7_9 = ____template_shaman_7
        if not ____template_shaman_7_9 then
            local ____template_optionalShama_8 = template.optionalShama
            if ____template_optionalShama_8 == nil then
                ____template_optionalShama_8 = false
            end
            ____template_shaman_7_9 = ____template_optionalShama_8
        end
        return {
            attackerTribe = ____template_attackerTribe_10,
            targetTribe = ____template_targetTribe_11,
            minPeople = ____IMath_imax_result_12,
            maxPeople = ____IMath_imax_result_13,
            damage = ____IMath_iclamp_result_14,
            targetType = ____temp_15,
            targetModel = ____temp_16,
            mode = ____temp_17,
            spell1 = ____temp_18,
            spell2 = ____temp_19,
            spell3 = ____temp_20,
            marker1 = ____temp_21,
            marker2 = ____temp_22,
            lookAfter = ____template_lookAfter_4,
            direction = ____temp_23,
            optionalShama = ____template_optionalShama_5,
            ignoreMana = ____template_ignoreMana_6,
            shaman = ____template_shaman_7_9,
            braves = IMath.iclamp(template.braves or 0, 0, 100),
            warriors = IMath.iclamp(template.warriors or 0, 0, 100),
            superWarriors = IMath.iclamp(template.superWarriors or 0, 0, 100),
            preachers = IMath.iclamp(template.preachers or 0, 0, 100),
            spies = IMath.iclamp(template.spies or 0, 0, 100)
        }
    end
    local function checkEnoughPersons(person, people, percent)
        if percent <= 0 or people <= 0 then
            return true
        end
        local expected = IMath.toInteger(people * (percent / 100))
        return person.numInWorld > expected
    end
    local function getSpellCost(tribe, spell)
        if spell == 0 then
            return 0
        end
        local ____opt_24 = tribe.spells:get(spell)
        return ____opt_24 and ____opt_24.cost or 0
    end
    local function checkEnoughMana(tribe, model1, model2, model3)
        local cost = getSpellCost(tribe, model1) + getSpellCost(tribe, model2) + getSpellCost(tribe, model3)
        return cost <= 0 or tribe.mana >= cost
    end
    local function checkAvailableShaman(tribe, useShaman, model1, model2, model3)
        if useShaman or model1 ~= 0 or model2 ~= 0 or model3 ~= 0 then
            return tribe.shaman.isAvailableForAttack and checkEnoughMana(tribe, model1, model2, model3)
        end
        return true
    end
    local function checkVehicleAvailability(tribe, people, attackType)
        if attackType == ATTACK_BY_BOAT then
            local num = people / 5 + 1
            return tribe.numBoats >= num
        elseif attackType == ATTACK_BY_BALLOON then
            local num = people / 2 + 1
            return tribe.numBalloons >= num
        end
        return true
    end
    function AttackUtils.doAttack(params, entryId)
        local attacker = params.attackerTribe
        if attacker == nil then
            return false
        end
        local target = params.targetTribe
        if target == nil then
            return false
        end
        local people = params.minPeople
        if params.maxPeople > people then
            people = people + Random.integer(params.maxPeople - params.minPeople)
        end
        if attacker.numPeople <= people * 1.5 then
            return false
        end
        if checkVehicleAvailability(attacker, people, params.mode) then
            return false
        end
        local useShaman = checkAvailableShaman(
            attacker,
            params.shaman,
            params.spell1,
            params.spell2,
            params.spell3
        )
        if not useShaman and not params.optionalShama then
            return false
        end
        if params.shaman and not (attacker.shaman.isAvailableForAttack and (params.ignoreMana or checkEnoughMana(attacker, params.spell1, params.spell2, params.spell3))) then
            return false
        end
        if not checkEnoughPersons(attacker.persons.brave, people, params.braves) then
            return false
        end
        if not checkEnoughPersons(attacker.persons.warrior, people, params.warriors) then
            return false
        end
        if not checkEnoughPersons(attacker.persons.superWarrior, people, params.superWarriors) then
            return false
        end
        if not checkEnoughPersons(attacker.persons.preacher, people, params.preachers) then
            return false
        end
        if not checkEnoughPersons(attacker.persons.spy, people, params.spies) then
            return false
        end
        local attrs = attacker.ai.attributes
        attrs.awayShaman = useShaman and params.shaman and 100 or 0
        attrs.awayBrave = params.braves
        attrs.awayWarrior = params.warriors
        attrs.awaySuperWarrior = params.superWarriors
        attrs.awayReligious = params.preachers
        attrs.awaySpy = params.spies
        local result = attacker.ai:attack(
            target.id,
            people,
            params.targetType,
            params.targetModel,
            params.damage,
            useShaman and params.spell1 and params.spell1 or 0,
            useShaman and params.spell2 and params.spell2 or 0,
            useShaman and params.spell3 and params.spell3 or 0,
            params.mode,
            params.lookAfter and 1 or 0,
            params.marker1,
            params.marker2,
            params.direction
        )
        if result and __DebugMode then
            log(((((((("[" .. attacker.name) .. "][Attack[") .. tostring(entryId)) .. "]]: Attack to ") .. target.name) .. " with ") .. tostring(people)) .. " people")
        end
        return result
    end
    function AttackUtils.doAttackNow(template, override, entryId)
        local params = prepareParams(template, override)
        if params.attackerTribe == nil or params.targetTribe == nil then
            return false
        end
        return AttackUtils.doAttack(params, entryId or 0)
    end
end
return ____exports
