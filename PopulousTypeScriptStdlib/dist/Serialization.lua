local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__NumberIsInteger = ____lualib.__TS__NumberIsInteger
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local __TS__TypeOf = ____lualib.__TS__TypeOf
local __TS__ObjectEntries = ____lualib.__TS__ObjectEntries
local __TS__ArrayIsArray = ____lualib.__TS__ArrayIsArray
local __TS__New = ____lualib.__TS__New
local ____exports = {}
require("PopModules")
local LocalDataEntryStack = __TS__Class()
LocalDataEntryStack.name = "LocalDataEntryStack"
function LocalDataEntryStack.prototype.____constructor(self)
    self.stack = {}
end
function LocalDataEntryStack.prototype.pushInteger(self, value)
    if not __TS__NumberIsInteger(value) then
        value = math.floor(value)
    end
    local ____self_stack_0 = self.stack
    ____self_stack_0[#____self_stack_0 + 1] = {type = 0, value = value}
end
function LocalDataEntryStack.prototype.pushFloat(self, value)
    local ____self_stack_1 = self.stack
    ____self_stack_1[#____self_stack_1 + 1] = {type = 1, value = value}
end
function LocalDataEntryStack.prototype.pushNumber(self, value)
    if __TS__NumberIsInteger(value) then
        self:pushInteger(value)
    else
        self:pushFloat(value)
    end
end
function LocalDataEntryStack.prototype.pushBoolean(self, value)
    local ____self_stack_2 = self.stack
    ____self_stack_2[#____self_stack_2 + 1] = {type = 2, value = value}
end
function LocalDataEntryStack.prototype.pushString(self, value)
    local ____self_stack_3 = self.stack
    ____self_stack_3[#____self_stack_3 + 1] = {type = 3, value = value}
end
function LocalDataEntryStack.prototype.pushArrayLength(self, value)
    if not __TS__NumberIsInteger(value) then
        value = math.floor(value)
    end
    local ____self_stack_4 = self.stack
    ____self_stack_4[#____self_stack_4 + 1] = {type = 4, value = value}
end
function LocalDataEntryStack.prototype.pushObjectLength(self, value)
    if not __TS__NumberIsInteger(value) then
        value = math.floor(value)
    end
    local ____self_stack_5 = self.stack
    ____self_stack_5[#____self_stack_5 + 1] = {type = 5, value = value}
end
function LocalDataEntryStack.prototype.pop(self)
    return table.remove(self.stack)
end
function LocalDataEntryStack.prototype.clear(self)
    while #self.stack > 0 do
        table.remove(self.stack)
    end
end
function LocalDataEntryStack.prototype.write(self, writer)
    local count = 0
    for ____, entry in ipairs(self.stack) do
        repeat
            local ____switch20 = entry.type
            local ____cond20 = ____switch20 == 0
            if ____cond20 then
                writer:push_int(entry.value)
                writer:push_int(0)
                count = count + 1
                break
            end
            ____cond20 = ____cond20 or ____switch20 == 1
            if ____cond20 then
                writer:push_float(entry.value)
                writer:push_int(1)
                count = count + 1
                break
            end
            ____cond20 = ____cond20 or ____switch20 == 2
            if ____cond20 then
                writer:push_bool(entry.value)
                writer:push_int(2)
                count = count + 1
                break
            end
            ____cond20 = ____cond20 or ____switch20 == 3
            if ____cond20 then
                writer:push_string(entry.value)
                writer:push_int(3)
                count = count + 1
                break
            end
            ____cond20 = ____cond20 or ____switch20 == 4
            if ____cond20 then
                writer:push_int(entry.value)
                writer:push_int(4)
                count = count + 1
                break
            end
            ____cond20 = ____cond20 or ____switch20 == 5
            if ____cond20 then
                writer:push_int(entry.value)
                writer:push_int(5)
                count = count + 1
                break
            end
            do
                break
            end
        until true
    end
    writer:push_int(count)
end
function LocalDataEntryStack.prototype.read(self, reader)
    self:clear()
    local count = reader:pop_int()
    do
        local i = 0
        while i < count do
            local ____type = reader:pop_int()
            repeat
                local ____switch24 = ____type
                local ____cond24 = ____switch24 == 0
                if ____cond24 then
                    self:pushInteger(reader:pop_int())
                    break
                end
                ____cond24 = ____cond24 or ____switch24 == 1
                if ____cond24 then
                    self:pushFloat(reader:pop_float())
                    break
                end
                ____cond24 = ____cond24 or ____switch24 == 2
                if ____cond24 then
                    self:pushBoolean(reader:pop_bool())
                    break
                end
                ____cond24 = ____cond24 or ____switch24 == 3
                if ____cond24 then
                    self:pushString(reader:pop_string())
                    break
                end
                ____cond24 = ____cond24 or ____switch24 == 4
                if ____cond24 then
                    self:pushArrayLength(reader:pop_int())
                    break
                end
                ____cond24 = ____cond24 or ____switch24 == 5
                if ____cond24 then
                    self:pushObjectLength(reader:pop_int())
                    break
                end
                do
                    break
                end
            until true
            i = i + 1
        end
    end
end
__TS__SetDescriptor(
    LocalDataEntryStack.prototype,
    "length",
    {get = function(self)
        return #self.stack
    end},
    true
)
__TS__SetDescriptor(
    LocalDataEntryStack.prototype,
    "isEmpty",
    {get = function(self)
        return #self.stack <= 0
    end},
    true
)
local LocalDataParser = {}
do
    local ValueType = {number = true, boolean = true, string = true, object = true}
    local function isValidType(value)
        return ValueType[__TS__TypeOf(value)] ~= nil
    end
    local function extractObjectEntries(obj)
        local entries = {}
        for ____, ____value in ipairs(__TS__ObjectEntries(obj)) do
            local key = ____value[1]
            local value = ____value[2]
            if type(key) == "string" and isValidType(value) then
                entries[#entries + 1] = {key, value}
            end
        end
        return entries
    end
    function LocalDataParser.writeValue(data, value)
        local vtype = __TS__TypeOf(value)
        repeat
            local ____switch34 = vtype
            local ____cond34 = ____switch34 == "number"
            if ____cond34 then
                data:pushNumber(value)
                break
            end
            ____cond34 = ____cond34 or ____switch34 == "boolean"
            if ____cond34 then
                data:pushBoolean(value)
                break
            end
            ____cond34 = ____cond34 or ____switch34 == "string"
            if ____cond34 then
                data:pushString(value)
                break
            end
            ____cond34 = ____cond34 or ____switch34 == "object"
            if ____cond34 then
                if __TS__ArrayIsArray(value) then
                    local array = value
                    data:pushArrayLength(#array)
                    for ____, val in ipairs(array) do
                        LocalDataParser.writeValue(data, val)
                    end
                else
                    local entries = extractObjectEntries(value)
                    for ____, ____value in ipairs(entries) do
                        local key = ____value[1]
                        local value = ____value[2]
                        data:pushString(key)
                        LocalDataParser.writeValue(data, value)
                    end
                end
                break
            end
        until true
    end
    function LocalDataParser.readValue(data)
        local entry = data:pop()
        if entry == nil then
            return false
        end
        if entry.type == 4 then
            local array = {}
            local size = entry.value
            do
                local i = 0
                while i < size do
                    array[#array + 1] = LocalDataParser.readValue(data)
                    i = i + 1
                end
            end
            return array
        end
        if entry.type == 5 then
            local obj = {}
            local size = entry.value
            do
                local i = 0
                while i < size do
                    local key = data:pop()
                    local value = LocalDataParser.readValue(data)
                    if key and key.type == 3 then
                        obj[key.value] = value
                    end
                    i = i + 1
                end
            end
            return obj
        end
        return entry.value
    end
end
____exports.LocalDataSaver = __TS__Class()
local LocalDataSaver = ____exports.LocalDataSaver
LocalDataSaver.name = "LocalDataSaver"
function LocalDataSaver.prototype.____constructor(self, writer)
    self.writer = writer
    self.data = {}
end
function LocalDataSaver.prototype.put(self, name, value)
    self.data[name] = value
    return self
end
function LocalDataSaver.prototype.putAll(self, obj)
    for ____, ____value in ipairs(__TS__ObjectEntries(obj)) do
        local key = ____value[1]
        local value = ____value[2]
        self.data[key] = value
    end
    return self
end
function LocalDataSaver.prototype.save(self)
    ____exports.LocalDataSaver.saveObject(self.writer, self.data)
end
function LocalDataSaver.saveObject(writer, obj)
    local data = __TS__New(LocalDataEntryStack)
    LocalDataParser.writeValue(data, obj)
    data:write(writer)
    data:clear()
end
____exports.LocalDataLoader = __TS__Class()
local LocalDataLoader = ____exports.LocalDataLoader
LocalDataLoader.name = "LocalDataLoader"
function LocalDataLoader.prototype.____constructor(self, reader)
    self.reader = reader
    self.data = {}
end
function LocalDataLoader.prototype.get(self, name, defaultValue)
    if not (self.data[name] ~= nil) then
        local ____temp_6
        if defaultValue ~= nil then
            ____temp_6 = defaultValue
        else
            ____temp_6 = 0
        end
        return ____temp_6
    end
    return self.data[name]
end
function LocalDataLoader.prototype.forEach(self, action)
    for ____, ____value in ipairs(__TS__ObjectEntries(self.data)) do
        local key = ____value[1]
        local value = ____value[2]
        action(key, value)
    end
end
function LocalDataLoader.prototype.load(self)
    self.data = ____exports.LocalDataLoader:loadObject(self.reader)
end
function LocalDataLoader.loadObject(self, reader)
    local data = __TS__New(LocalDataEntryStack)
    data:read(reader)
    local value = LocalDataParser.readValue(data)
    data:clear()
    if __TS__TypeOf(value) ~= "object" or __TS__ArrayIsArray(value) then
        return {}
    end
    return value
end
return ____exports
