import { Time } from "../GameTime";
import { Marker } from "../Markers";
import "../PopModules";
import { Tribe } from "../Tribes";
import { BaseControllerScriptComponent } from "./Common";
type GuardEntryCondition = (this: void) => boolean;
interface GuardControllerState {
    idx: number;
    remainingSeconds: number;
    lastUpdateSeconds: number;
    initials: boolean;
    registered: boolean;
}
export interface GuardEntryRequest {
    marker1: Marker;
    marker2?: Marker;
    braves?: number;
    warriors?: number;
    superWarriors?: number;
    preachers?: number;
    condition?: GuardEntryCondition;
}
export declare class GuardController extends BaseControllerScriptComponent<GuardControllerState> {
    private readonly _entries;
    private readonly _initialEntries;
    private _checkPeriod;
    private _numPerTime;
    private _nextValidEntry;
    constructor(tribe: Tribe);
    get checkPeriod(): typeof this._checkPeriod;
    set checkPeriod(value: typeof this._checkPeriod);
    get numPerTime(): typeof this._numPerTime;
    set numPerTime(value: typeof this._numPerTime);
    registerEntry(request: GuardEntryRequest[]): void;
    registerEntry(request: GuardEntryRequest): void;
    registerEntry(marker1: Marker, marker2?: Marker, braves?: number, warriors?: number, superWarriors?: number, preachers?: number, condition?: (this: void) => boolean): void;
    registerInitialEntry(request: GuardEntryRequest[]): void;
    registerInitialEntry(request: GuardEntryRequest): void;
    registerInitialEntry(marker1: Marker, marker2?: Marker, braves?: number, warriors?: number, superWarriors?: number, preachers?: number, condition?: (this: void) => boolean): void;
    private registerEntriesToAI;
    private updateEntries;
    private updateInitialEntries;
    private _registerEntry;
    protected update(deltaTime: Time): void;
}
export {};
