--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
---
-- @noSelfInFile
local nativeLog = log
____exports.Logger = {}
local Logger = ____exports.Logger
do
    Logger.SystemLevel = 200
    local function levelToString(level)
        if level >= 400 then
            return "DEBUG"
        elseif level >= 300 then
            return "INFO"
        elseif level >= 200 then
            return "WARN"
        else
            return "ERROR"
        end
    end
    function Logger.log(level, message)
        if Logger.SystemLevel >= level and level > 0 then
            local prefix = ("[" .. levelToString(level)) .. "]: "
            if type(message) == "function" then
                nativeLog(prefix .. tostring(message()))
            else
                nativeLog(prefix .. tostring(message))
            end
        end
    end
    function Logger.debug(message)
        Logger.log(400, message)
    end
    function Logger.info(message)
        Logger.log(300, message)
    end
    function Logger.warn(message)
        Logger.log(200, message)
    end
    function Logger.error(message)
        Logger.log(100, message)
    end
end
return ____exports
