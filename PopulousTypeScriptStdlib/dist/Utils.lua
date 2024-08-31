local ____lualib = require("lualib_bundle")
local __TS__ObjectEntries = ____lualib.__TS__ObjectEntries
local ____exports = {}
____exports.StringUtils = {}
local StringUtils = ____exports.StringUtils
do
    function StringUtils.dump(obj, sameLine)
        if sameLine == nil then
            sameLine = true
        end
        local sb = {}
        for ____, ____value in ipairs(__TS__ObjectEntries(obj)) do
            local key = ____value[1]
            local value = ____value[2]
            local property = (("\"" .. key) .. "\": ") .. tostring(value)
            sb[#sb + 1] = property
        end
        if sameLine then
            return ("{ " .. table.concat(sb, "; ")) .. " }"
        end
        return ("{ \n\t" .. table.concat(sb, ";\n\t")) .. "\n}"
    end
end
return ____exports
