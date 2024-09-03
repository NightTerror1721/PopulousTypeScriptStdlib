local ____lualib = require("lualib_bundle")
local __TS__ObjectValues = ____lualib.__TS__ObjectValues
local __TS__ObjectEntries = ____lualib.__TS__ObjectEntries
local __TS__New = ____lualib.__TS__New
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local __TS__InstanceOf = ____lualib.__TS__InstanceOf
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
local ____GameTime = require("GameTime")
local Time = ____GameTime.Time
require("PopModules")
local ____Serialization = require("Serialization")
local LocalDataLoader = ____Serialization.LocalDataLoader
local LocalDataSaver = ____Serialization.LocalDataSaver
local ____Spells = require("Spells")
local Spell = ____Spells.Spell
local ____Tribes = require("Tribes")
local Tribe = ____Tribes.Tribe
local LevelScriptInternal = {}
do
    LevelScriptInternal.Tribes = {}
    LevelScriptInternal.TribesList = {}
    LevelScriptInternal.Environments = {}
    LevelScriptInternal.EnvironmentsList = {}
    LevelScriptInternal.TribesWithImposedElements = {}
    LevelScriptInternal.TribesWithImposedElementsList = {}
    LevelScriptInternal.GlobalData = {}
    function LevelScriptInternal.GlobalOnTurn()
        local deltaTime = Time.current()
        if deltaTime:isTurn(0) then
            for ____, script in ipairs(LevelScriptInternal.TribesList) do
                if script.hooks.onFirstTurn then
                    script.hooks.onFirstTurn(deltaTime)
                end
                for ____, component in ipairs(__TS__ObjectValues(script.components)) do
                    component:onFirstTurn(deltaTime)
                end
            end
            for ____, script in ipairs(LevelScriptInternal.EnvironmentsList) do
                if script.hooks.onFirstTurn then
                    script.hooks.onFirstTurn(deltaTime)
                end
                for ____, component in ipairs(__TS__ObjectValues(script.components)) do
                    component:onFirstTurn(deltaTime)
                end
            end
        else
            for ____, script in ipairs(LevelScriptInternal.TribesList) do
                if script.hooks.onTurn then
                    script.hooks.onTurn(deltaTime)
                end
                for ____, component in ipairs(__TS__ObjectValues(script.components)) do
                    component:onTurn(deltaTime)
                end
            end
            for ____, script in ipairs(LevelScriptInternal.EnvironmentsList) do
                if script.hooks.onTurn then
                    script.hooks.onTurn(deltaTime)
                end
                for ____, component in ipairs(__TS__ObjectValues(script.components)) do
                    component:onTurn(deltaTime)
                end
            end
        end
        if #LevelScriptInternal.TribesWithImposedElementsList > 0 then
            for ____, tribe in ipairs(LevelScriptInternal.TribesWithImposedElementsList) do
                tribe:updateRemoveImposed()
            end
        end
    end
    function LevelScriptInternal.GlobalOnInit()
        for ____, script in ipairs(LevelScriptInternal.TribesList) do
            script.tribe.ai:initComputer()
            if script.hooks.onInit then
                script.hooks.onInit()
            end
            for ____, component in ipairs(__TS__ObjectValues(script.components)) do
                component:onInit()
            end
        end
        for ____, script in ipairs(LevelScriptInternal.EnvironmentsList) do
            if script.hooks.onInit then
                script.hooks.onInit()
            end
            for ____, component in ipairs(__TS__ObjectValues(script.components)) do
                component:onInit()
            end
        end
    end
    function LevelScriptInternal.GlobalCreateThing(thing)
        for ____, script in ipairs(LevelScriptInternal.TribesList) do
            if script.hooks.onCreateThing then
                script.hooks.onCreateThing(thing)
            end
        end
        for ____, script in ipairs(LevelScriptInternal.EnvironmentsList) do
            if script.hooks.onCreateThing then
                script.hooks.onCreateThing(thing)
            end
        end
    end
    function LevelScriptInternal.GlobalOnChat(tribeID, msg)
        for ____, script in ipairs(LevelScriptInternal.TribesList) do
            if script.hooks.onChat then
                script.hooks.onChat(tribeID, msg)
            end
        end
        for ____, script in ipairs(LevelScriptInternal.EnvironmentsList) do
            if script.hooks.onChat then
                script.hooks.onChat(tribeID, msg)
            end
        end
    end
    local function prepareComponentsSaveData(components)
        local componentsData = {}
        for ____, ____value in ipairs(__TS__ObjectEntries(components)) do
            local name = ____value[1]
            local component = ____value[2]
            local data = {}
            component:onSave(data)
            componentsData[name] = data
        end
        return componentsData
    end
    local function injectComponentsLoadData(components, componentsData)
        for ____, ____value in ipairs(__TS__ObjectEntries(components)) do
            local name = ____value[1]
            local component = ____value[2]
            local data = componentsData[name]
            if data ~= nil then
                component:onLoad(data)
            end
        end
    end
    function LevelScriptInternal.GlobalOnSave(writer)
        local tribes = {}
        for ____, script in ipairs(LevelScriptInternal.TribesList) do
            local data = {
                attributes = script.tribe.ai.attributes:exportData(),
                states = script.tribe.ai.states:exportData(),
                localData = script.localData,
                components = prepareComponentsSaveData(script.components)
            }
            tribes[#tribes + 1] = {id = script.tribe.id, data = data}
        end
        local envs = {}
        for ____, script in ipairs(LevelScriptInternal.EnvironmentsList) do
            local data = {
                localData = script.localData,
                components = prepareComponentsSaveData(script.components)
            }
            envs[#envs + 1] = {name = script.name, data = data}
        end
        local saver = __TS__New(LocalDataSaver, writer)
        saver:put("tribes", tribes)
        saver:put("envs", envs)
        saver:put("globalData", LevelScriptInternal.GlobalData)
        saver:save()
    end
    function LevelScriptInternal.GlobalOnLoad(reader)
        local loader = __TS__New(LocalDataLoader, reader)
        loader:load()
        local tribes = loader:get("tribes")
        for ____, entry in ipairs(tribes) do
            local script = LevelScriptInternal.Tribes[entry.id]
            if script ~= nil then
                script.tribe.ai.attributes:importData(entry.data.attributes)
                script.tribe.ai.states:importData(entry.data.states)
                __TS__ObjectAssign(script.localData, entry.data.localData)
                injectComponentsLoadData(script.components, entry.data.components)
            end
        end
        local envs = loader:get("envs")
        for ____, entry in ipairs(envs) do
            local script = LevelScriptInternal.Environments[entry.name]
            if script ~= nil then
                __TS__ObjectAssign(script.localData, entry.data.localData)
                injectComponentsLoadData(script.components, entry.data.components)
            end
        end
        local globals = loader:get("globalData")
        __TS__ObjectAssign(LevelScriptInternal.GlobalData, globals)
    end
end
____exports.LevelScript = {}
local LevelScript = ____exports.LevelScript
do
    function LevelScript.getGlobalData()
        return LevelScriptInternal.GlobalData
    end
    function LevelScript.getTribeLocalData(tribe)
        if not (LevelScriptInternal.Tribes[tribe.id] ~= nil) then
            error(nil, ("Tribe script " .. tribe.name) .. " not found")
        end
        return LevelScriptInternal.Tribes[tribe.id].localData
    end
    function LevelScript.getEnvironmentLocalData(name)
        if not (LevelScriptInternal.Environments[name] ~= nil) then
            error(nil, ("Environment script " .. name) .. " not found")
        end
        return LevelScriptInternal.Environments[name].localData
    end
    local function registerComponentMethod(self, component)
        if self.components[component.name] ~= nil then
            return false
        end
        self.components[component.name] = component
        return true
    end
    local function getTypedLocalDataMethod(self)
        return self.localData
    end
    function LevelScript.registerTribe(tribe, components, hooks)
        if LevelScriptInternal.Tribes[tribe.id] ~= nil then
            error(nil, "Duplicated tribe script " .. tribe.name)
        end
        local script = {
            tribe = tribe,
            localData = {},
            hooks = hooks and hooks or ({}),
            components = {},
            registerComponent = registerComponentMethod,
            getTypedLocalData = getTypedLocalDataMethod
        }
        local ____opt_0 = components
        if ____opt_0 ~= nil then
            __TS__ArrayForEach(
                components,
                function(____, component) return script:registerComponent(component) end
            )
        end
        LevelScriptInternal.Tribes[tribe.id] = script
        local ____LevelScriptInternal_TribesList_2 = LevelScriptInternal.TribesList
        ____LevelScriptInternal_TribesList_2[#____LevelScriptInternal_TribesList_2 + 1] = script
        return script
    end
    function LevelScript.registerEnvironmentScript(name, components, hooks)
        if LevelScriptInternal.Environments[name] ~= nil then
            error(nil, ("Duplicated environment script \"" .. name) .. "\"")
        end
        local script = {
            name = name,
            localData = {},
            hooks = hooks and hooks or ({}),
            components = {},
            registerComponent = registerComponentMethod,
            getTypedLocalData = getTypedLocalDataMethod
        }
        local ____opt_3 = components
        if ____opt_3 ~= nil then
            __TS__ArrayForEach(
                components,
                function(____, component) return script:registerComponent(component) end
            )
        end
        LevelScriptInternal.Environments[name] = script
        local ____LevelScriptInternal_EnvironmentsList_5 = LevelScriptInternal.EnvironmentsList
        ____LevelScriptInternal_EnvironmentsList_5[#____LevelScriptInternal_EnvironmentsList_5 + 1] = script
        return script
    end
    function LevelScript.registerComponent(tribeOrName, component)
        if type(tribeOrName) == "number" then
            local ____opt_6 = LevelScriptInternal.Tribes[tribeOrName]
            local ____temp_8 = ____opt_6 and ____opt_6:registerComponent(component)
            if ____temp_8 == nil then
                ____temp_8 = false
            end
            return ____temp_8
        else
            local ____opt_9 = LevelScriptInternal.Environments[tribeOrName]
            local ____temp_11 = ____opt_9 and ____opt_9:registerComponent(component)
            if ____temp_11 == nil then
                ____temp_11 = false
            end
            return ____temp_11
        end
    end
    function LevelScript.compile()
        _G.OnTurn = LevelScriptInternal.GlobalOnTurn
        _G.OnCreateThing = LevelScriptInternal.GlobalCreateThing
        _G.OnChat = LevelScriptInternal.GlobalOnChat
        _G.OnLoad = LevelScriptInternal.GlobalOnLoad
        _G.OnSave = LevelScriptInternal.GlobalOnSave
        LevelScriptInternal.GlobalOnInit()
    end
    function LevelScript.registerImposedElements(...)
        local elements = {...}
        for ____, elem in ipairs(elements) do
            local tribe = Tribe.of(elem.tribe)
            if not (LevelScriptInternal.TribesWithImposedElements[elem.tribe] ~= nil) then
                LevelScriptInternal.TribesWithImposedElements[elem.tribe] = tribe
                local ____LevelScriptInternal_TribesWithImposedElementsList_12 = LevelScriptInternal.TribesWithImposedElementsList
                ____LevelScriptInternal_TribesWithImposedElementsList_12[#____LevelScriptInternal_TribesWithImposedElementsList_12 + 1] = tribe
            end
            if __TS__InstanceOf(elem, Spell) then
                tribe.spells:markAsImposed(elem)
            else
                tribe.buildings:markAsImposed(elem)
            end
        end
    end
end
____exports.ScriptComponent = __TS__Class()
local ScriptComponent = ____exports.ScriptComponent
ScriptComponent.name = "ScriptComponent"
function ScriptComponent.prototype.____constructor(self, name)
    self.name = name
    self.localData = {}
end
function ScriptComponent.prototype.onSave(self, data)
    self:onPreSave()
    data.localData = self.localData
end
function ScriptComponent.prototype.onPreSave(self)
end
function ScriptComponent.prototype.onLoad(self, data)
    self:onPostLoad()
    if type(data.localData) == "table" then
        __TS__ObjectAssign(self.localData, data.localData)
    else
        __TS__ObjectAssign(self.localData, {})
    end
end
function ScriptComponent.prototype.onPostLoad(self)
end
function ScriptComponent.prototype.__eq(self, other)
    return __TS__InstanceOf(other, ____exports.ScriptComponent) and self.name == other.name
end
return ____exports
