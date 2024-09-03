/** @noSelfInFile */
import { Building } from "./Buildings";
import { Time } from "./GameTime";
import "./PopModules";
import { LocalDataObject } from "./Serialization";
import { Spell } from "./Spells";
import { Tribe } from "./Tribes";
export type OnInitHook = () => void;
export type OnFirstTurnHook = (deltaTime: Time) => void;
export type OnTurn = (deltaTime: Time) => void;
export type OnCreateThing = (thing: Thing) => void;
export type OnChat = (tribeID: TribeID, msg: string) => void;
export interface LevelScriptHooks {
    onInit?: OnInitHook;
    onFirstTurn?: OnFirstTurnHook;
    onTurn?: OnTurn;
    onCreateThing?: OnCreateThing;
    onChat?: OnChat;
}
interface ScriptComponentContainer {
    registerComponent(component: ScriptComponent): boolean;
    getTypedLocalData<T extends LocalDataObject>(): T;
}
export interface TribeLevelScript extends ScriptComponentContainer {
    readonly tribe: Tribe;
    readonly localData: LocalDataObject;
    readonly hooks: LevelScriptHooks;
}
export interface EnvironmentLevelScript extends ScriptComponentContainer {
    readonly name: string;
    readonly localData: LocalDataObject;
    readonly hooks: LevelScriptHooks;
}
export declare namespace LevelScript {
    function getGlobalData<T extends LocalDataObject = LocalDataObject>(): T;
    function getTribeLocalData<T extends LocalDataObject = LocalDataObject>(tribe: Tribe): T;
    function getEnvironmentLocalData<T extends LocalDataObject = LocalDataObject>(name: string): T;
    function registerTribe(tribe: Tribe, components?: ScriptComponent[], hooks?: LevelScriptHooks): TribeLevelScript;
    function registerEnvironmentScript(name: string, components?: ScriptComponent[], hooks?: LevelScriptHooks): EnvironmentLevelScript;
    function registerComponent(tribe: TribeID, component: ScriptComponent): boolean;
    function registerComponent(name: string, component: ScriptComponent): boolean;
    function compile(): void;
    function registerImposedElements(...elements: (Spell | Building)[]): void;
}
export declare abstract class ScriptComponent {
    readonly name: string;
    protected readonly localData: LocalDataObject;
    protected constructor(name: string);
    abstract onInit(): void;
    abstract onFirstTurn(deltaTime: Time): void;
    abstract onTurn(deltaTime: Time): void;
    onSave(data: LocalDataObject): void;
    protected onPreSave(): void;
    onLoad(data: LocalDataObject): void;
    protected onPostLoad(): void;
    private __eq;
}
export {};
