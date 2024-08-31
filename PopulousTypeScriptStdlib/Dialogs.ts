import { Location } from "./Location"
import { Map } from "./Map"
import "./PopModules"

export class Dialog
{
    private constructor() {}

    private static _autoDialog = false
    public static get autoDialog(): boolean { return Dialog._autoDialog }
    public static set autoDialog(value: boolean) { AUTO_MESSAGES(value ? 1 : 0); Dialog._autoDialog = value }
}

/** @noSelf */
export namespace Dialog
{
    export function clearAllMessages(): void { CLEAR_ALL_MSG() }

    export function setMessageID(id: number): void { SET_MSG_ID(id) }

    export function messageID(): number { return MSG_ID() }

    export function getMessageID(): number { return GET_MSG_ID() }

    export function killAllMessagesWithID(id: number): void { KILL_ALL_MSG_ID(id) }

    export function createNarrativeMessage(index: number): void { CREATE_MSG_NARRATIVE(index) }

    export function createObjectiveMessage(index: number): void { CREATE_MSG_OBJECTIVE(index) }

    export function createInformationMessage(index: number): void { CREATE_MSG_INFORMATION(index) }

    export function createZoomInformationMessage(index: number, x: number, z: number, angle: number): void
    export function createZoomInformationMessage(index: number, location: Location, angle: number): void
    export function createZoomInformationMessage(index: number, xOrLoc: number|Location, zOrAngle: number, angleOrUndef?: number): void
    {
        if(typeof xOrLoc === "number")
            CREATE_MSG_INFORMATION_ZOOM(index, xOrLoc, zOrAngle, angleOrUndef!!)
        else
        {
            const [x, z] = Map.getCellComponentsFromLocation(xOrLoc)
            CREATE_MSG_INFORMATION_ZOOM(index, x, z, zOrAngle)
        }
    }

    export function setMessageZoom(x: number, z: number, angle: number): void
    export function setMessageZoom(location: Location, angle: number): void
    export function setMessageZoom(xOrLoc: number|Location, zOrAngle: number, angleOrUndef?: number): void
    {
        if(typeof xOrLoc === "number")
            SET_MSG_ZOOM(xOrLoc, zOrAngle, angleOrUndef!!)
        else
        {
            const [x, z] = Map.getCellComponentsFromLocation(xOrLoc)
            SET_MSG_ZOOM(x, z, zOrAngle)
        }
    }

    export function setMessageTimeout(timeout: number) { SET_MSG_TIMEOUT(timeout) }

    export function setMessageDeleteOnOK() { SET_MSG_DELETE_ON_OK() }

    export function setMessageReturnOnOK() { SET_MSG_RETURN_ON_OK() }

    export function setMessageDeleteOnRMBZoom() { SET_MSG_DELETE_ON_RMB_ZOOM() }

    export function setMessageOpenDialogOnRMBZoom() { SET_MSG_OPEN_DLG_ON_RMB_ZOOM() }

    export function setMessageCreateReturnMessageOnRMBZoom() { SET_MSG_CREATE_RETURN_MSG_ON_RMB_ZOOM() }

    export function setMessageOpenDialogOnRMBDelete() { SET_MSG_OPEN_DLG_ON_RMB_DELETE() }

    export function setMessageZoomOnLMBOpenDialog() { SET_MSG_ZOOM_ON_LMB_OPEN_DLG() }

    export function setMessageOkSaveExitDialog() { SET_MSG_OK_SAVE_EXIT_DLG() }

    export function setMessageAutoOpenDialog() { SET_MSG_AUTO_OPEN_DLG() }


    export interface Message
    {
        readonly index: number
        readonly type: Message.Type
        zoom?: Message.MapCellZoomData|Message.LocationZoomData
        timeout?: number
        deleteOnOK?: boolean
        returnOnOK?: boolean
        autoOpen?: boolean
        id?: number
    }
    export namespace Message
    {
        export const enum Type
        {
            NARRATIVE,
            OBJECTIVE,
            INFORMATIVE
        }

        export interface MapCellZoomData
        {
            x: number,
            z: number,
            angle: number
        }
        export interface LocationZoomData
        {
            location: Location,
            angle: number
        }
    }

    export function open(message: Message): void
    {
        switch(message.type)
        {
            case Message.Type.NARRATIVE:
                createNarrativeMessage(message.index)
                break

            case Message.Type.OBJECTIVE:
                createObjectiveMessage(message.index)
                break

            case Message.Type.INFORMATIVE:
                createInformationMessage(message.index)
                break

            default: return
        }

        if(message.zoom)
        {
            if("location" in message.zoom)
                setMessageZoom(message.zoom.location, message.zoom.angle)
            else
                setMessageZoom(message.zoom.x, message.zoom.z, message.zoom.angle)
        }

        if(message.timeout)
            setMessageTimeout(message.timeout)

        if(message.deleteOnOK === true)
            setMessageDeleteOnOK()

        if(message.returnOnOK === true)
            setMessageReturnOnOK()

        if(message.autoOpen === true)
            setMessageAutoOpenDialog()

        if(message.id)
            setMessageID(message.id)
    }
}
