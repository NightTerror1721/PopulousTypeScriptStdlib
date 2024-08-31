local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local ____Level = require("Level")
local ScriptComponent = ____Level.ScriptComponent
require("PopModules")
____exports.BaseEnvironmentControllerScriptComponent = __TS__Class()
local BaseEnvironmentControllerScriptComponent = ____exports.BaseEnvironmentControllerScriptComponent
BaseEnvironmentControllerScriptComponent.name = "BaseEnvironmentControllerScriptComponent"
__TS__ClassExtends(BaseEnvironmentControllerScriptComponent, ScriptComponent)
function BaseEnvironmentControllerScriptComponent.prototype.____constructor(self, name)
    ScriptComponent.prototype.____constructor(self, name)
end
function BaseEnvironmentControllerScriptComponent.prototype.onInit(self)
end
function BaseEnvironmentControllerScriptComponent.prototype.onFirstTurn(self, deltaTime)
    self:update(deltaTime)
end
function BaseEnvironmentControllerScriptComponent.prototype.onTurn(self, deltaTime)
    self:update(deltaTime)
end
__TS__SetDescriptor(
    BaseEnvironmentControllerScriptComponent.prototype,
    "state",
    {
        get = function(self)
            return self.localData
        end,
        set = function(self, value)
            __TS__ObjectAssign(self.localData, value)
        end
    },
    true
)
____exports.BaseControllerScriptComponent = __TS__Class()
local BaseControllerScriptComponent = ____exports.BaseControllerScriptComponent
BaseControllerScriptComponent.name = "BaseControllerScriptComponent"
__TS__ClassExtends(BaseControllerScriptComponent, ____exports.BaseEnvironmentControllerScriptComponent)
function BaseControllerScriptComponent.prototype.____constructor(self, name, tribe)
    BaseControllerScriptComponent.____super.prototype.____constructor(self, name)
    self._tribe = tribe
end
return ____exports
