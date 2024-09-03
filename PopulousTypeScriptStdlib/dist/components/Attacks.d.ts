import { Time } from "../GameTime";
import { Marker } from "../Markers";
import "../PopModules";
import { BuildingModel, PersonModel, SpellModel } from "../Things";
import { Tribe } from "../Tribes";
import { BaseControllerScriptComponent } from "./Common";
export declare function setAttackDebugModeEnabled(enabled: boolean): void;
export declare function isAttackDebugModeEnabled(): boolean;
interface AttackInternalParams {
    attackerTribe?: Tribe;
    targetTribe?: Tribe;
    minPeople: number;
    maxPeople: number;
    damage: number;
    targetType: PopScriptAttackTargetType;
    targetModel: BuildingModel | PersonModel;
    mode: PopScriptAttackType;
    spell1: SpellModel;
    spell2: SpellModel;
    spell3: SpellModel;
    marker1: Marker;
    marker2: Marker;
    lookAfter: boolean;
    direction: number;
    ignoreMana: boolean;
    shaman: boolean;
    optionalShama: boolean;
    braves: number;
    warriors: number;
    superWarriors: number;
    preachers: number;
    spies: number;
}
export interface AttackTemplate extends Partial<AttackInternalParams> {
    everySeconds?: number;
    randomExtraEverySeconds?: number;
    delaySeconds?: number;
    once?: boolean;
    forceFirst?: boolean;
    condition?: (this: void) => boolean;
    override?: (this: void) => AttackTemplate;
    callback?: (this: void, status: boolean) => void;
}
interface AttackControllerEntryState {
    enabled: boolean;
    lastAttackSeconds: number;
    delaySeconds: number;
    periodSeconds: number;
}
interface AttackControllerState {
    entries: Record<number, AttackControllerEntryState>;
}
export declare class AttackController extends BaseControllerScriptComponent<AttackControllerState> {
    private readonly _entries;
    private _lastUpdate?;
    constructor(tribe: Tribe);
    registerEntry(entryId: number, template: AttackTemplate): void;
    enableEntry(entryId: number): boolean;
    disableEntry(entryId: number): boolean;
    protected update(deltaTime: Time): void;
    static doAttackNow(template: AttackTemplate, override?: AttackTemplate): boolean;
}
export {};
