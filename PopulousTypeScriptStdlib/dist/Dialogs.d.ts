import { Location } from "./Location";
import "./PopModules";
export declare class Dialog {
    private constructor();
    private static _autoDialog;
    static get autoDialog(): boolean;
    static set autoDialog(value: boolean);
}
/** @noSelf */
export declare namespace Dialog {
    function clearAllMessages(): void;
    function setMessageID(id: number): void;
    function messageID(): number;
    function getMessageID(): number;
    function killAllMessagesWithID(id: number): void;
    function createNarrativeMessage(index: number): void;
    function createObjectiveMessage(index: number): void;
    function createInformationMessage(index: number): void;
    function createZoomInformationMessage(index: number, x: number, z: number, angle: number): void;
    function createZoomInformationMessage(index: number, location: Location, angle: number): void;
    function setMessageZoom(x: number, z: number, angle: number): void;
    function setMessageZoom(location: Location, angle: number): void;
    function setMessageTimeout(timeout: number): void;
    function setMessageDeleteOnOK(): void;
    function setMessageReturnOnOK(): void;
    function setMessageDeleteOnRMBZoom(): void;
    function setMessageOpenDialogOnRMBZoom(): void;
    function setMessageCreateReturnMessageOnRMBZoom(): void;
    function setMessageOpenDialogOnRMBDelete(): void;
    function setMessageZoomOnLMBOpenDialog(): void;
    function setMessageOkSaveExitDialog(): void;
    function setMessageAutoOpenDialog(): void;
    interface Message {
        readonly index: number;
        readonly type: Message.Type;
        zoom?: Message.MapCellZoomData | Message.LocationZoomData;
        timeout?: number;
        deleteOnOK?: boolean;
        returnOnOK?: boolean;
        autoOpen?: boolean;
        id?: number;
    }
    namespace Message {
        const enum Type {
            NARRATIVE = 0,
            OBJECTIVE = 1,
            INFORMATIVE = 2
        }
        interface MapCellZoomData {
            x: number;
            z: number;
            angle: number;
        }
        interface LocationZoomData {
            location: Location;
            angle: number;
        }
    }
    function open(message: Message): void;
}
