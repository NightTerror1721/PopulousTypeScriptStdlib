import { Time } from "../GameTime"
import { IMath } from "../IMath"
import { ScriptComponent } from "../Level"
import { Location } from "../Location"
import { Map } from "../Map"
import "../PopModules"
import Random from "../Random"
import { BuildingModel, PersonModel, ShapeModel, ThingType } from "../Things"
import { Tribe } from "../Tribes"
import { BaseControllerScriptComponent } from "./Common"

interface DrumTowerEntry
{
    readonly x: number,
    readonly z: number,
    readonly checkRadius?: number,
    readonly person?: PersonModel|PersonModel[]
    readonly condition?: (this: void) => boolean
}

interface DrumTowerControllerState
{
    buildIdx: number,
    populateIdx: number,
    buildCheckRemainingSeconds: number,
    populateCheckRemainingSeconds: number,
    lastUpdateSeconds: number
}

export class DrumTowerController extends BaseControllerScriptComponent<DrumTowerControllerState>
{
    private readonly _entries: DrumTowerEntry[]
    private _buildCheckPeriod: number
    private _populateCheckPeriod: number
    private _buildsPerTime: number
    private _populationsPerTime: number

    public constructor(tribe: Tribe)
    {
        super("DrumTowerController", tribe)

        this._entries = []
        this._buildCheckPeriod = 20
        this._populateCheckPeriod = 20
        this._buildsPerTime = 1
        this._populationsPerTime = 2

        this.state = {
            buildIdx: 0,
            populateIdx: 0,
            buildCheckRemainingSeconds: this._buildCheckPeriod,
            populateCheckRemainingSeconds: this._populateCheckPeriod,
            lastUpdateSeconds: Time.current().seconds
        }
    }

    public get buildCheckPeriod() { return this._buildCheckPeriod }
    public set buildCheckPeriod(value: typeof this._buildCheckPeriod) { this._buildCheckPeriod = IMath.imax(0, value) }

    public get populateCheckPeriod() { return this._populateCheckPeriod }
    public set populateCheckPeriod(value: typeof this._populateCheckPeriod) { this._populateCheckPeriod = IMath.imax(0, value) }

    public get buildsPerTime() { return this._buildsPerTime }
    public set buildsPerTime(value: typeof this._buildsPerTime) { this._buildsPerTime = IMath.imax(1, value) }

    public get populationsPerTime() { return this._populationsPerTime }
    public set populationsPerTime(value: typeof this._populationsPerTime) { this._populationsPerTime = IMath.imax(1, value) }

    public registerEntry(
        x: number,
        z: number,
        checkRadius?: number,
        person?: PersonModel|PersonModel[],
        condition?: (this: void) => void
    ): void
    public registerEntry(
        location: Location,
        checkRadius?: number,
        person?: PersonModel|PersonModel[],
        condition?: (this: void) => void
    ): void
    public registerEntry(
        xOrLoc: number|Location,
        zOrRad: number,
        radOrPer?: number|PersonModel|PersonModel[],
        perOrCond?: PersonModel|PersonModel[]|((this: void) => void),
        condOrUndef?: (this: void) => void
    ): void
    {
        let entry: DrumTowerEntry
        if(typeof xOrLoc === "number") entry = {
            x: xOrLoc,
            z: zOrRad,
            checkRadius: radOrPer as any,
            person: perOrCond as any,
            condition: condOrUndef as any
        }
        else
        {
            const [x, z] = Map.getCellComponentsFromLocation(xOrLoc)
            entry = {
                x: x,
                z: z,
                checkRadius: zOrRad as any,
                person: radOrPer as any,
                condition: perOrCond as any
            }
        }

        this._entries.push(entry)
    }
    
    protected override update(deltaTime: Time): void
    {
        if(this._entries.length < 1)
            return

        const state = this.state
        const currentSeconds = deltaTime.seconds
        const delta = currentSeconds - state.lastUpdateSeconds
        if(delta > 0)
        {
            state.lastUpdateSeconds = currentSeconds
            this.updateBuilds(delta)
            this.updatePopulations(delta)
        }
    }

    private updateBuilds(delta: number)
    {
        const state = this.state
        state.buildCheckRemainingSeconds -= delta
        while(state.buildCheckRemainingSeconds <= 0)
        {
            state.buildCheckRemainingSeconds += this._buildCheckPeriod

            const initialIdx = state.buildIdx
            let remaining = this._buildsPerTime
            while(remaining > 0)
            {
                const entry = this._entries[state.buildIdx]
                state.buildIdx = (state.buildIdx + 1) % this._entries.length
                if(entry.condition === undefined || entry.condition())
                {
                    DrumTowerUtils.buildDrumTowerIfNotExists(this._tribe, entry.x, entry.z, entry.checkRadius)
                    remaining--
                }

                if(state.buildIdx === initialIdx)
                    break
            }
        }
    }

    private updatePopulations(delta: number): void
    {
        const state = this.state
        state.populateCheckRemainingSeconds -= delta
        while(state.populateCheckRemainingSeconds <= 0)
        {
            state.populateCheckRemainingSeconds += this._populateCheckPeriod

            const initialIdx = state.populateIdx
            let remaining = this._populationsPerTime
            while(remaining > 0)
            {
                const entry = this._entries[state.populateIdx]
                const model = DrumTowerController.selectPerson(entry)
                state.populateIdx = (state.populateIdx + 1) % this._entries.length
                if(model !== undefined)
                {
                    this._tribe.ai.populateDrumTower(model, entry.x, entry.z)
                    remaining--
                }

                if(state.populateIdx === initialIdx)
                    break
            }
        }
    }

    private static selectPerson(this: void, entry: DrumTowerEntry): PersonModel|undefined
    {
        if(entry.person === undefined)
            return undefined

        if(typeof entry.person === "number")
            return entry.person

        return Random.element(entry.person)
    }
}

export namespace DrumTowerUtils
{
    export function findDrumTowerAtLocation(tribe: Tribe, x: number, z: number, radius: number): Thing|undefined
    export function findDrumTowerAtLocation(tribe: Tribe, location: Location, radius: number): Thing|undefined
    export function findDrumTowerAtLocation(tribe: Tribe, xOrLoc: number|Location, zOrRadius: number, radiusOrUndef?: number): Thing|undefined
    {
        let x: number, z: number, radius: number
        if(typeof xOrLoc === "number")
        {
            x = xOrLoc
            z = zOrRadius
            radius = radiusOrUndef!!
        }
        else
        {
            [x, z] = Map.getCellComponentsFromLocation(xOrLoc)
            radius = zOrRadius
        }

        const tower = Map.findFirstThingOf(ThingType.Building, BuildingModel.DrumTower, x, z, radius, SearchShapeType.CIRCULAR)
        return tower && tower.Owner === tribe.id ? tower : undefined
    }

    export function populateDrumTower(tribe: Tribe, model: PersonModel, x: number, z: number, radius: number): boolean
    export function populateDrumTower(tribe: Tribe, model: PersonModel, location: Location, radius: number): boolean
    export function populateDrumTower(tribe: Tribe, model: PersonModel, xOrLoc: number|Location, zOrRadius: number, radiusOrUndef?: number): boolean
    {
        const tower = findDrumTowerAtLocation(tribe, xOrLoc as any, zOrRadius, radiusOrUndef!!)
        if(tower)
        {
            const pos = tower.Pos.D2
            tribe.ai.populateDrumTower(model, pos.Xpos, pos.Zpos)
            return true
        }
        return false
    }

    export function existsDrumTowerBuildOrShapeAtLocation(tribe: Tribe, x: number, z: number, radius: number): boolean
    export function existsDrumTowerBuildOrShapeAtLocation(tribe: Tribe, location: Location, radius: number): boolean
    export function existsDrumTowerBuildOrShapeAtLocation(tribe: Tribe, xOrLoc: number|Location, zOrRadius: number, radiusOrUndef?: number): boolean
    {
        let x: number, z: number, radius: number
        if(typeof xOrLoc === "number")
        {
            x = xOrLoc
            z = zOrRadius
            radius = radiusOrUndef!!
        }
        else
        {
            [x, z] = Map.getCellComponentsFromLocation(xOrLoc)
            radius = zOrRadius
        }

        const tower = Map.findFirstThingOf(ThingType.Building, BuildingModel.DrumTower, x, z, radius, SearchShapeType.CIRCULAR)
        if(tower && tower.Owner === tribe.id)
            return true

        const shape = Map.findFirstThingOf(ThingType.Shape, ShapeModel.General, x, z, radius, SearchShapeType.CIRCULAR)
        return shape !== undefined && shape.Owner === tribe.id
    }

    export function buildDrumTowerIfNotExists(tribe: Tribe, x: number, z: number, checkRadius?: number): void
    export function buildDrumTowerIfNotExists(tribe: Tribe, location: Location, checkRadius?: number): void
    export function buildDrumTowerIfNotExists(tribe: Tribe, xOrLoc: number|Location, zOrRadius?: number, radiusOrUndef?: number): void
    {
        if(typeof xOrLoc === "number")
        {
            const radius = radiusOrUndef !== undefined ? radiusOrUndef : 3
            if(existsDrumTowerBuildOrShapeAtLocation(tribe, xOrLoc, zOrRadius!!, radius))
                return

            tribe.ai.buildDrumTower(xOrLoc, zOrRadius!!)
        }
        else
        {
            const radius = zOrRadius !== undefined ? zOrRadius : 3
            if(existsDrumTowerBuildOrShapeAtLocation(tribe, xOrLoc, radius))
                return

            tribe.ai.buildDrumTower(xOrLoc)
        }
    }
}
