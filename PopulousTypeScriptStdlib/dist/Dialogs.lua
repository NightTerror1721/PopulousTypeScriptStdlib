local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ObjectDefineProperty = ____lualib.__TS__ObjectDefineProperty
local ____exports = {}
local ____Map = require("Map")
local Map = ____Map.Map
require("PopModules")
---
-- @noSelf
____exports.Dialog = __TS__Class()
local Dialog = ____exports.Dialog
Dialog.name = "Dialog"
function Dialog.prototype.____constructor(self)
end
Dialog._autoDialog = false
__TS__ObjectDefineProperty(
    Dialog,
    "autoDialog",
    {
        get = function(self)
            return ____exports.Dialog._autoDialog
        end,
        set = function(self, value)
            AUTO_MESSAGES(value and 1 or 0)
            ____exports.Dialog._autoDialog = value
        end
    }
)
do
    function Dialog.clearAllMessages()
        CLEAR_ALL_MSG()
    end
    function Dialog.setMessageID(id)
        SET_MSG_ID(id)
    end
    function Dialog.messageID()
        return MSG_ID()
    end
    function Dialog.getMessageID()
        return GET_MSG_ID()
    end
    function Dialog.killAllMessagesWithID(id)
        KILL_ALL_MSG_ID(id)
    end
    function Dialog.createNarrativeMessage(index)
        CREATE_MSG_NARRATIVE(index)
    end
    function Dialog.createObjectiveMessage(index)
        CREATE_MSG_OBJECTIVE(index)
    end
    function Dialog.createInformationMessage(index)
        CREATE_MSG_INFORMATION(index)
    end
    function Dialog.createZoomInformationMessage(index, xOrLoc, zOrAngle, angleOrUndef)
        if type(xOrLoc) == "number" then
            CREATE_MSG_INFORMATION_ZOOM(index, xOrLoc, zOrAngle, angleOrUndef)
        else
            local x, z = Map.getCellComponentsFromLocation(xOrLoc)
            CREATE_MSG_INFORMATION_ZOOM(index, x, z, zOrAngle)
        end
    end
    function Dialog.setMessageZoom(xOrLoc, zOrAngle, angleOrUndef)
        if type(xOrLoc) == "number" then
            SET_MSG_ZOOM(xOrLoc, zOrAngle, angleOrUndef)
        else
            local x, z = Map.getCellComponentsFromLocation(xOrLoc)
            SET_MSG_ZOOM(x, z, zOrAngle)
        end
    end
    function Dialog.setMessageTimeout(timeout)
        SET_MSG_TIMEOUT(timeout)
    end
    function Dialog.setMessageDeleteOnOK()
        SET_MSG_DELETE_ON_OK()
    end
    function Dialog.setMessageReturnOnOK()
        SET_MSG_RETURN_ON_OK()
    end
    function Dialog.setMessageDeleteOnRMBZoom()
        SET_MSG_DELETE_ON_RMB_ZOOM()
    end
    function Dialog.setMessageOpenDialogOnRMBZoom()
        SET_MSG_OPEN_DLG_ON_RMB_ZOOM()
    end
    function Dialog.setMessageCreateReturnMessageOnRMBZoom()
        SET_MSG_CREATE_RETURN_MSG_ON_RMB_ZOOM()
    end
    function Dialog.setMessageOpenDialogOnRMBDelete()
        SET_MSG_OPEN_DLG_ON_RMB_DELETE()
    end
    function Dialog.setMessageZoomOnLMBOpenDialog()
        SET_MSG_ZOOM_ON_LMB_OPEN_DLG()
    end
    function Dialog.setMessageOkSaveExitDialog()
        SET_MSG_OK_SAVE_EXIT_DLG()
    end
    function Dialog.setMessageAutoOpenDialog()
        SET_MSG_AUTO_OPEN_DLG()
    end
    Dialog.Message = {}
    local Message = Dialog.Message
    do
    end
    function Dialog.open(message)
        repeat
            local ____switch32 = message.type
            local ____cond32 = ____switch32 == 0
            if ____cond32 then
                Dialog.createNarrativeMessage(message.index)
                break
            end
            ____cond32 = ____cond32 or ____switch32 == 1
            if ____cond32 then
                Dialog.createObjectiveMessage(message.index)
                break
            end
            ____cond32 = ____cond32 or ____switch32 == 2
            if ____cond32 then
                Dialog.createInformationMessage(message.index)
                break
            end
            do
                return
            end
        until true
        if message.zoom then
            if message.zoom.location ~= nil then
                Dialog.setMessageZoom(message.zoom.location, message.zoom.angle)
            else
                Dialog.setMessageZoom(message.zoom.x, message.zoom.z, message.zoom.angle)
            end
        end
        if message.timeout then
            Dialog.setMessageTimeout(message.timeout)
        end
        if message.deleteOnOK == true then
            Dialog.setMessageDeleteOnOK()
        end
        if message.returnOnOK == true then
            Dialog.setMessageReturnOnOK()
        end
        if message.autoOpen == true then
            Dialog.setMessageAutoOpenDialog()
        end
        if message.id then
            Dialog.setMessageID(message.id)
        end
    end
end
return ____exports
