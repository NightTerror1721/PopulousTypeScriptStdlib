import "./PopModules";
import { SpellModel } from "./Things";
export declare namespace InternalSpellModel {
    function of(model: SpellModel | undefined): PopScriptSpellModel | undefined;
}
export declare class Spell {
    readonly tribe: TribeID;
    readonly model: SpellModel;
    private readonly _playerThings;
    private readonly _player;
    constructor(tribe: TribeID, model: SpellModel);
    get isEnabled(): boolean;
    set isEnabled(value: boolean);
    get isChargeEnabled(): boolean;
    set isChargeEnabled(value: boolean);
    get shots(): number;
    set shots(value: number);
    giveShots(shots: number): void;
    get isLevelEnabled(): boolean;
    set isLevelEnabled(value: boolean);
    get mana(): number;
    get castCount(): number;
    static getCost(this: void, model: SpellModel): number;
    get cost(): number;
    static getInternalModelValue(this: void, model: SpellModel): number;
    get internalModelValue(): number;
    static readonly Count = SpellModel.__COUNT;
}
