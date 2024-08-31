/** @noSelfInFile */

import { Building } from "./Buildings"
import { Time } from "./GameTime"
import "./PopModules"
import { LocalDataArray, LocalDataLoader, LocalDataObject, LocalDataSaver } from "./Serialization"
import { Spell } from "./Spells"
import { Tribe } from "./Tribes"

declare const _G: LuaTable

export type OnInitHook = () => void
export type OnFirstTurnHook = (deltaTime: Time) => void
export type OnTurn = (deltaTime: Time) => void
export type OnCreateThing = (thing: Thing) => void
export type OnChat = (tribeID: TribeID, msg: string) => void

export interface LevelScriptHooks
{
    onInit?: OnInitHook
    onFirstTurn?: OnFirstTurnHook
    onTurn?: OnTurn
    onCreateThing?: OnCreateThing
    onChat?: OnChat
}

type ComponentPool = Record<string, ScriptComponent>

interface ScriptComponentContainer
{
    registerComponent(component: ScriptComponent): boolean
}
interface ScriptComponentContainerImpl extends ScriptComponentContainer
{
    readonly components: ComponentPool
}

export interface TribeLevelScript extends ScriptComponentContainer
{
    readonly tribe: Tribe
    readonly localData: LocalDataObject
    readonly hooks: LevelScriptHooks
}
interface TribeLevelScriptImpl extends TribeLevelScript, ScriptComponentContainerImpl
{
    readonly components: ComponentPool
}

export interface EnvironmentLevelScript extends ScriptComponentContainer
{
    readonly name: string
    readonly localData: LocalDataObject
    readonly hooks: LevelScriptHooks
}
interface EnvironmentLevelScriptImpl extends EnvironmentLevelScript, ScriptComponentContainerImpl
{
    readonly components: ComponentPool
}

namespace LevelScriptInternal
{
    export const Tribes: Record<TribeID, TribeLevelScriptImpl> = {}
    export const TribesList: TribeLevelScriptImpl[] = []

    export const Environments: Record<string, EnvironmentLevelScriptImpl> = {}
    export const EnvironmentsList: EnvironmentLevelScriptImpl[] = []

    export const TribesWithImposedElements: Record<TribeID, Tribe> = {}
    export const TribesWithImposedElementsList: Tribe[] = []

    export function GlobalOnTurn(): void
    {
        const deltaTime = Time.current()
        if(deltaTime.isTurn(0))
        {
            for(const script of TribesList)
            {
                if(script.hooks.onFirstTurn)
                    script.hooks.onFirstTurn(deltaTime)
                for(const component of Object.values(script.components))
                    component.onFirstTurn(deltaTime)
            }

            for(const script of EnvironmentsList)
            {
                if(script.hooks.onFirstTurn)
                    script.hooks.onFirstTurn(deltaTime)
                for(const component of Object.values(script.components))
                    component.onFirstTurn(deltaTime)
            }
        }
        else
        {
            for(const script of TribesList)
            {
                if(script.hooks.onTurn)
                    script.hooks.onTurn(deltaTime)
                for(const component of Object.values(script.components))
                    component.onTurn(deltaTime)
            }

            for(const script of EnvironmentsList)
            {
                if(script.hooks.onTurn)
                    script.hooks.onTurn(deltaTime)
                for(const component of Object.values(script.components))
                    component.onTurn(deltaTime)
            }
        }

        if(TribesWithImposedElementsList.length > 0)
        {
            for(const tribe of TribesWithImposedElementsList)
                tribe.updateRemoveImposed()
        }
    }

    export function GlobalOnInit(): void
    {
        for(const script of TribesList)
        {
            script.tribe.ai.initComputer()
            if(script.hooks.onInit)
                script.hooks.onInit()
            for(const component of Object.values(script.components))
                component.onInit()
        }

        for(const script of EnvironmentsList)
        {
            if(script.hooks.onInit)
                script.hooks.onInit()
            for(const component of Object.values(script.components))
                component.onInit()
        }
    }
    
    export function GlobalCreateThing(thing: Thing): void
    {
        for(const script of TribesList)
            if(script.hooks.onCreateThing)
                script.hooks.onCreateThing(thing)

        for(const script of EnvironmentsList)
            if(script.hooks.onCreateThing)
                script.hooks.onCreateThing(thing)
    }

    export function GlobalOnChat(tribeID: TribeID, msg: string): void
    {
        for(const script of TribesList)
            if(script.hooks.onChat)
                script.hooks.onChat(tribeID, msg)

        for(const script of EnvironmentsList)
            if(script.hooks.onChat)
                script.hooks.onChat(tribeID, msg)
    }

    type ComponentData = {
        localData: LocalDataObject
    }
    type TribeData = {
        id: TribeID,
        data: {
            attributes: LocalDataArray,
            states: LocalDataArray,
            localData: LocalDataObject,
            components: Record<string, ComponentData>
        }
    }[]
    type EnvironmentData = {
        name: string,
        data: {
            localData: LocalDataObject,
            components: Record<string, ComponentData>
        }
    }[]

    function prepareComponentsSaveData(components: ComponentPool): Record<string, ComponentData>
    {
        const componentsData: Record<string, ComponentData> = {}
        for(const [name, component] of Object.entries(components))
        {
            const data = {}
            component.onSave(data)
            componentsData[name] = data as ComponentData
        }
        return componentsData
    }
    function injectComponentsLoadData(components: ComponentPool, componentsData: Record<string, ComponentData>): void
    {
        for(const [name, component] of Object.entries(components))
        {
            const data = componentsData[name]
            if(data !== undefined)
                component.onLoad(data)
        }
    }

    export function GlobalOnSave(writer: Script4SaveData): void
    {
        const tribes: TribeData = []
        for(const script of TribesList)
        {
            const data = {
                attributes: script.tribe.ai.attributes.exportData(),
                states: script.tribe.ai.states.exportData(),
                localData: script.localData,
                components: prepareComponentsSaveData(script.components)
            }
            tribes.push({ id: script.tribe.id, data: data })
        }

        const envs: EnvironmentData = []
        for(const script of EnvironmentsList)
        {
            const data = {
                localData: script.localData,
                components: prepareComponentsSaveData(script.components)
            }
            envs.push({ name: script.name, data: data })
        }

        const saver = new LocalDataSaver(writer)
        saver.put("tribes", tribes)
        saver.put("envs", envs)
        saver.save()
    }

    export function GlobalOnLoad(reader: Script4LoadData): void
    {
        const loader = new LocalDataLoader(reader)
        loader.load()

        const tribes = loader.get("tribes") as TribeData
        for(const entry of tribes)
        {
            const script = Tribes[entry.id]
            if(script !== undefined)
            {
                script.tribe.ai.attributes.importData(entry.data.attributes)
                script.tribe.ai.states.importData(entry.data.states)
                Object.assign(script.localData, entry.data.localData)
                injectComponentsLoadData(script.components, entry.data.components)
            }
        }

        const envs = loader.get("envs") as EnvironmentData
        for(const entry of envs)
        {
            const script = Environments[entry.name]
            if(script !== undefined)
            {
                Object.assign(script.localData, entry.data.localData)
                injectComponentsLoadData(script.components, entry.data.components)
            }
        }
    }
}

export namespace LevelScript
{
    export function getTribeLocalData(tribe: Tribe): LocalDataObject
    {
        if(!(tribe.id in LevelScriptInternal.Tribes))
            error(`Tribe script ${tribe.name} not found`)

        return LevelScriptInternal.Tribes[tribe.id].localData
    }

    export function getEnvironmentLocalData(name: string): LocalDataObject
    {
        if(!(name in LevelScriptInternal.Environments))
            error(`Environment script ${name} not found`)

        return LevelScriptInternal.Environments[name].localData
    }

    function registerComponentMethod(this: ScriptComponentContainerImpl, component: ScriptComponent): boolean
    {
        if(component.name in this.components)
            return false

        this.components[component.name] = component
        return true
    }

    export function registerTribe(tribe: Tribe, components?: ScriptComponent[], hooks?: LevelScriptHooks): TribeLevelScript
    {
        if(tribe.id in LevelScriptInternal.Tribes)
            error(`Duplicated tribe script ${tribe.name}`)

        const script: TribeLevelScriptImpl = {
            tribe: tribe,
            localData: {},
            hooks: hooks ? hooks : {},
            components: {},
            registerComponent: registerComponentMethod
        }

        components?.forEach(component => script.registerComponent(component))

        LevelScriptInternal.Tribes[tribe.id] = script
        LevelScriptInternal.TribesList.push(script)
        return script
    }

    export function registerEnvironmentScript(name: string, components?: ScriptComponent[], hooks?: LevelScriptHooks): EnvironmentLevelScript
    {
        if(name in LevelScriptInternal.Environments)
            error(`Duplicated environment script "${name}"`)

        const script: EnvironmentLevelScriptImpl = {
            name: name,
            localData: {},
            hooks: hooks ? hooks : {},
            components: {},
            registerComponent: registerComponentMethod
        }

        components?.forEach(component => script.registerComponent(component))

        LevelScriptInternal.Environments[name] = script
        LevelScriptInternal.EnvironmentsList.push(script)
        return script
    }

    export function registerComponent(tribe: TribeID, component: ScriptComponent): boolean
    export function registerComponent(name: string, component: ScriptComponent): boolean
    export function registerComponent(tribeOrName: TribeID|string, component: ScriptComponent): boolean
    {
        if(typeof tribeOrName === "number")
            return LevelScriptInternal.Tribes[tribeOrName]?.registerComponent(component) ?? false
        else
            return LevelScriptInternal.Environments[tribeOrName]?.registerComponent(component) ?? false
    }

    export function compile()
    {
        _G.set("OnTurn", LevelScriptInternal.GlobalOnTurn)
        _G.set("OnCreateThing", LevelScriptInternal.GlobalCreateThing)
        _G.set("OnChat", LevelScriptInternal.GlobalOnChat)
        _G.set("OnLoad", LevelScriptInternal.GlobalOnLoad)
        _G.set("OnSave", LevelScriptInternal.GlobalOnSave)

        LevelScriptInternal.GlobalOnInit()
    }

    export function registerImposedElements(...elements: (Spell|Building)[]): void
    {
        for(const elem of elements)
        {
            const tribe = Tribe.of(elem.tribe)
            if(!(elem.tribe in LevelScriptInternal.TribesWithImposedElements))
            {
                LevelScriptInternal.TribesWithImposedElements[elem.tribe] = tribe
                LevelScriptInternal.TribesWithImposedElementsList.push(tribe)
            }

            if(elem instanceof Spell)
                tribe.spells.markAsImposed(elem)
            else
                tribe.buildings.markAsImposed(elem)
        }
    }
}


export abstract class ScriptComponent
{
    public readonly name: string
    protected readonly localData: LocalDataObject

    protected constructor(name: string)
    {
        this.name = name
        this.localData = {}
    }

    public abstract onInit(): void
    public abstract onFirstTurn(deltaTime: Time): void
    public abstract onTurn(deltaTime: Time): void

    public onSave(data: LocalDataObject): void
    {
        this.onPreSave()
        data.localData = this.localData
    }
    protected onPreSave(): void {}

    public onLoad(data: LocalDataObject): void
    {
        this.onPostLoad()
        if(typeof data.localData === "object")
            Object.assign(this.localData, data.localData)
        else
            Object.assign(this.localData, {})
    }
    protected onPostLoad(): void {}

    private __eq(other: any): boolean
    {
        return other instanceof ScriptComponent && this.name === other.name
    }
}
