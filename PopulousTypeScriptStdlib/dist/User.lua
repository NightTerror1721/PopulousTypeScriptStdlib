--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
require("PopModules")
____exports.User = {}
local User = ____exports.User
do
    function User.setUserInputsEnabled(self, enabled)
        if enabled then
            ENABLE_USER_INPUTS()
        else
            DISABLE_USER_INPUTS()
        end
    end
end
return ____exports
