import { Time } from "../GameTime";
import { LocalDataObject } from "../Serialization";
import { BaseEnvironmentControllerScriptComponent } from "./Common";
export interface Event<EventDataType extends LocalDataObject = LocalDataObject> {
    readonly data: EventDataType;
    readonly action: EventAction<EventDataType>;
    readonly condition?: EventCondition<EventDataType> | {
        condition: EventCondition<EventDataType>;
        frequency?: Time;
        delay?: Time;
    };
    readonly onInit?: EventOnInit<EventDataType>;
    readonly onUpdate?: EventOnUpdate<EventDataType> | {
        onUpdate: EventOnUpdate<EventDataType>;
        frequency?: Time;
        delay?: Time;
    };
    readonly times?: number;
    readonly once?: boolean;
}
export type EventCondition<DT extends LocalDataObject> = (this: void, event: Event<DT>) => boolean;
export declare namespace EventCondition {
    function and<DT extends LocalDataObject>(cnd1: EventCondition<DT>, cnd2: EventCondition<DT>): EventCondition<DT>;
    function and<DT extends LocalDataObject>(cnd1: EventCondition<DT>, ...cnds: EventCondition<DT>[]): EventCondition<DT>;
    function and<DT extends LocalDataObject>(cnds: EventCondition<DT>[]): EventCondition<DT>;
    function or<DT extends LocalDataObject>(cnd1: EventCondition<DT>, cnd2: EventCondition<DT>): EventCondition<DT>;
    function or<DT extends LocalDataObject>(cnd1: EventCondition<DT>, ...cnds: EventCondition<DT>[]): EventCondition<DT>;
    function or<DT extends LocalDataObject>(cnds: EventCondition<DT>[]): EventCondition<DT>;
    function not<DT extends LocalDataObject>(cnd: EventCondition<DT>): EventCondition<DT>;
}
export type EventAction<DT extends LocalDataObject> = (this: void, event: Event<DT>) => void;
export type EventOnInit<DT extends LocalDataObject> = (this: void, event: Event<DT>) => void;
export type EventOnUpdate<DT extends LocalDataObject> = (this: void, event: Event<DT>, time: Time) => void;
interface EntryHandlerBackupData {
    data: LocalDataObject;
    times?: number;
    expired: boolean;
}
interface EventControllerState {
    initiated: boolean;
    backups: EntryHandlerBackupData[];
}
export declare class EventController extends BaseEnvironmentControllerScriptComponent<EventControllerState> {
    private readonly _events;
    constructor();
    registerEvent<DT extends LocalDataObject>(event: Event<DT>): void;
    registerEvent<DT extends LocalDataObject>(event: Event<DT>[]): void;
    protected update(time: Time): void;
    protected onPreSave(): void;
    protected onPostLoad(): void;
}
export {};
