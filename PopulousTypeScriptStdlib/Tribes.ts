import { AI } from "./AI"
import { Building } from "./Buildings"
import { Time } from "./GameTime"
import { Location } from "./Location"
import { Person, Shaman } from "./Persons"
import "./PopModules"
import { Spell } from "./Spells"
import { BuildingModel, PersonModel, SpellModel, VehicleModel } from "./Things"

namespace TribeInternal
{
    export interface ElementPool<T extends Spell|Building|Person, M extends SpellModel|BuildingModel|PersonModel>
    {
        get(model: M): T

        forEach(action: (this: void, elem: T) => void): void
        forSome(models: (M|T)[], action: (this: void, elem: T) => void): void
    }

    function preparePool<T extends Spell|Building|Person, M extends SpellModel|BuildingModel|PersonModel>(this: void, data: Record<string, T>)
    {
        const pool: Record<number, T> = {}
        for(const value of Object.values(data))
            pool[value.model] = value
        return pool
    }

    function _makeElementPool<
        T extends Spell|Building|Person,
        M extends SpellModel|BuildingModel|PersonModel,
        P extends ElementPool<T, M>
    >(this: void, data: Record<string, T>, pool: Record<number, T>): P
    {
        const obj = data as any
        for(const value of Object.values(data))
            pool[value.model] = value
        obj.get = function(this: P, model: M): T { return pool[model] };
        obj.forEach = function(this: P, action: (this: void, elem: T) => void): void {
            for(const elem of Object.values(pool))
                action(elem)
        };
        obj.forSome = function(this: P, models: (M|T)[], action: (this: void, elem: T) => void): void {
            for(const model of models)
            {
                if(typeof model === "number")
                {
                    const elem = pool[model]
                    if(elem !== undefined) action(elem)
                }
                else action(model)
            }
        };
        return obj
    }
    export function makeElementPool<
        T extends Spell|Building|Person,
        M extends SpellModel|BuildingModel|PersonModel,
        P extends ElementPool<T, M>
    >(this: void, data: Record<string, T>): P
    {
        const pool = preparePool(data)
        return _makeElementPool(data, pool)
    }

    export interface SpellOrBuildingPool<T extends Spell|Building, M extends SpellModel|BuildingModel> extends ElementPool<T, M>
    {
        enableAll(): void
        enableSome(models: (M|T)[]): void

        disableAll(): void
        disableSome(models: (M|T)[]): void

        markAsImposed(model: M|T): void
    }

    export function makeSpellOrBuildingPool<
        T extends Spell|Building,
        M extends SpellModel|BuildingModel,
        P extends SpellOrBuildingPool<T, M>
    >(this: void, data: Record<string, T>, imposed: T[]): P
    {
        const pool = preparePool(data)
        const obj = _makeElementPool(data, pool) as any
        obj.enableAll = function(this: P): void { this.forEach(elem => elem.isEnabled = true) }
        obj.enableSome = function(this: P, models: (M|T)[]): void { this.forSome(models, elem => elem.isEnabled = true) }
        obj.disableAll = function(this: P): void { this.forEach(elem => elem.isEnabled = false) }
        obj.disableSome = function(this: P, models: (M|T)[]): void { this.forSome(models, elem => elem.isEnabled = false) }

        const imposedSet: Record<number, T> = {}
        obj.markAsImposed = function(this: P, modelOrElem: M|T): void
        {
            const elem = typeof modelOrElem === "number" ? pool[modelOrElem] : modelOrElem
            if(elem.model in imposedSet)
                return

            imposedSet[elem.model] = elem
            imposed.push(elem)
        }

        return obj
    }
}

export class Tribe
{
    public static readonly Neutral: Tribe = new Tribe(TribeID.NEUTRAL)
    public static readonly Blue: Tribe = new Tribe(TribeID.BLUE)
    public static readonly Red: Tribe = new Tribe(TribeID.RED)
    public static readonly Yellow: Tribe = new Tribe(TribeID.YELLOW)
    public static readonly Green: Tribe = new Tribe(TribeID.GREEN)
    public static readonly Cyan: Tribe = new Tribe(TribeID.CYAN)
    public static readonly Pink: Tribe = new Tribe(TribeID.PINK)
    public static readonly Black: Tribe = new Tribe(TribeID.BLACK)
    public static readonly Orange: Tribe = new Tribe(TribeID.ORANGE)
    public static readonly Hostbot: Tribe = new Tribe(TribeID.HOSTBOT)

    public static readonly ALL: readonly Tribe[] = [
        Tribe.Neutral,
        Tribe.Blue,
        Tribe.Red,
        Tribe.Yellow,
        Tribe.Green,
        Tribe.Cyan,
        Tribe.Pink,
        Tribe.Black,
        Tribe.Orange,
        Tribe.Hostbot
    ]

    public static readonly COUNT: number = 10

    public readonly id: TribeID
    public readonly player: Player
    public readonly ai: AI

    public readonly spells: Tribe.Spells
    public readonly buildings: Tribe.Buildings
    public readonly persons: Tribe.Persons

    public readonly shaman: Shaman

    private readonly _imposedSpells: Spell[]
    private readonly _imposedBuildings: Building[]

    private constructor(id: TribeID)
    {
        this.id = id
        this.player = getPlayer(id)
        this.ai = new AI(id)

        this._imposedSpells = []
        this._imposedBuildings = []

        this.spells = TribeInternal.makeSpellOrBuildingPool({
            burn: new Spell(id, SpellModel.Burn),
            blast: new Spell(id, SpellModel.Blast),
            lightningBolt: new Spell(id, SpellModel.LightningBolt),
            tornado: new Spell(id, SpellModel.Tornado),
            swarm: new Spell(id, SpellModel.Swarm),
            invisibility: new Spell(id, SpellModel.Invisibility),
            hypnotism: new Spell(id, SpellModel.Hypnotism),
            firestorm: new Spell(id, SpellModel.Firestorm),
            ghostArmy: new Spell(id, SpellModel.GhostArmy),
            erosion: new Spell(id, SpellModel.Erosion),
            swamp: new Spell(id, SpellModel.Swamp),
            landBridge: new Spell(id, SpellModel.LandBridge),
            angelOfDeath: new Spell(id, SpellModel.AngelOfDeath),
            earthquake: new Spell(id, SpellModel.Earthquake),
            flatten: new Spell(id, SpellModel.Flatten),
            volcano: new Spell(id, SpellModel.Volcano),
            conversion: new Spell(id, SpellModel.Conversion),
            armageddon: new Spell(id, SpellModel.Armageddon),
            shield: new Spell(id, SpellModel.Shield),
            bloodlust: new Spell(id, SpellModel.Bloodlust),
            teleport: new Spell(id, SpellModel.Teleport),
            
            hill: new Spell(id, SpellModel.Hill),
            rise: new Spell(id, SpellModel.Rise),
            valley: new Spell(id, SpellModel.Valley),
            dip: new Spell(id, SpellModel.Dip),
            placeTree: new Spell(id, SpellModel.PlaceTree),
            clearMapWho: new Spell(id, SpellModel.ClearMapWho),
            placeShaman: new Spell(id, SpellModel.PlaceShaman),
            placeWild: new Spell(id, SpellModel.PlaceWild)
        }, this._imposedSpells)

        this.buildings = TribeInternal.makeSpellOrBuildingPool({
            smallHut: new Building(id, BuildingModel.SmallHut),
            hut: new Building(id, BuildingModel.Hut),
            largeHut: new Building(id, BuildingModel.LargeHut),
            drumTower: new Building(id, BuildingModel.DrumTower),
            temple: new Building(id, BuildingModel.Temple),
            spyTrain: new Building(id, BuildingModel.SpyTrain),
            warriorTrain: new Building(id, BuildingModel.WarriorTrain),
            superWarriorTrain: new Building(id, BuildingModel.SuperWarriorTrain),
            reconversion: new Building(id, BuildingModel.Reconversion),
            wallPiece: new Building(id, BuildingModel.WallPiece),
            gate: new Building(id, BuildingModel.Gate),
            currOeSlot: new Building(id, BuildingModel.CurrOeSlot),
            boatHut: new Building(id, BuildingModel.BoatHut),
            alternativeBoatHut: new Building(id, BuildingModel.BoatHut2),
            airshipHut: new Building(id, BuildingModel.AirshipHut),
            alternativeAirshipHut: new Building(id, BuildingModel.AirshipHut2),
            guardPost: new Building(id, BuildingModel.GuardPost),
            library: new Building(id, BuildingModel.Library),
            prision: new Building(id, BuildingModel.Prision),
        }, this._imposedBuildings)

        this.persons = TribeInternal.makeElementPool({
            wild: new Person(id, PersonModel.Wild),
            brave: new Person(id, PersonModel.Brave),
            warrior: new Person(id, PersonModel.Warrior),
            preacher: new Person(id, PersonModel.Preacher),
            spy: new Person(id, PersonModel.Spy),
            superWarrior: new Person(id, PersonModel.SuperWarrior),
            shaman: new Shaman(id),
            angelOfDeath: new Person(id, PersonModel.AngelOfDeath),
        })

        this.shaman = this.persons.shaman
    }

    public static of(this: void, tribeID: TribeID): Tribe
    public static of(this: void, tribe: Tribe): Tribe
    public static of(this: void, tribe: TribeID|Tribe): Tribe
    public static of(this: void, tribe: TribeID|Tribe): Tribe
    {
        return typeof tribe === "number" ? (TribePool[tribe] ?? Tribe.Neutral) : tribe
    }

    public static asID(this: void, tribeID: TribeID): TribeID
    public static asID(this: void, tribe: Tribe): TribeID
    public static asID(this: void, tribe: TribeID|Tribe): TribeID
    public static asID(this: void, tribe: TribeID|Tribe): TribeID
    {
        return typeof tribe === "number" ? tribe : tribe.id
    }

    public get name(): string { return TribeName[this.id] }

    public get mana(): number { return this.player.Mana }
    public set mana(value: number) { this.player.Mana = Math.max(0, value) }
    public giveMana(amount: number) { this.player.Mana += Math.max(0, amount) }
    public takeMana(amount: number) { this.player.Mana -= Math.max(0, amount) }

    public get numPeople(): number { return this.player.NumPeople }

    public get numConvertedPeople(): number { return this.player.NumPeopleConverted }

    public get numGhostPeople(): number { return this.player.NumGhostPeople }

    public get numBuildings(): number { return this.player.NumBuildings }

    public get numPartialBuilding(): number { return PARTIAL_BUILDING_COUNT(this.id) }

    public get numBoats(): number { return this.player.NumVehiclesOfType[VehicleModel.Boat - 1] }

    public get numBalloons(): number { return this.player.NumVehiclesOfType[VehicleModel.Airship - 1] }

    public get numTepeesInAnyLevel(): number
    {
        const buildings = this.buildings
        return buildings.smallHut.numInWorld + buildings.hut.numInWorld + buildings.largeHut.numInWorld
    }

    public get reincSiteLocation(): Location { return Location.make3D(this.player.ReincarnSiteCoord) }

    public cameraRotation(angle: number): void { CAMERA_ROTATION(this.id, angle) }

    public get isReincEnabled(): boolean { return this.ai.isReincEnabled }
    public get reinc(): boolean { return this.ai.reinc }
    public set reinc(value: boolean) { this.ai.reinc = value }

    public get isInEncyc(): boolean { return HAS_PLAYER_BEEN_IN_ENCYC(this.id) != 0 }

    public getKilledPeople(targetTribe: TribeID|Tribe): number
    {
        return this.player.PeopleKilled[(Tribe.asID(targetTribe)) - 1]
    }

    public get deadCount(): number { return this.player.DeadCount }

    public transferTribeToAnotherPlayer(targetTribe: TribeID|Tribe): void
    {
        transfer_tribe_to_another_player(this.id, Tribe.asID(targetTribe))
    }

    isAlly(otherTribe: TribeID|Tribe): boolean { return are_players_allied(this.id, Tribe.asID(otherTribe)) }
    isEnemy(otherTribe: TribeID|Tribe): boolean { return !are_players_allied(this.id, Tribe.asID(otherTribe)) }

    setAlly(otherTribe: TribeID|Tribe, bidirectional: boolean = true): void
    {
        const tb = Tribe.asID(otherTribe)
        set_players_allied(this.id, tb)
        if(bidirectional)
            set_players_allied(tb, this.id)
    }

    setEnemy(otherTribe: TribeID|Tribe, bidirectional: boolean = true): void
    {
        const tb = Tribe.asID(otherTribe)
        set_players_enemies(this.id, tb)
        if(bidirectional)
            set_players_enemies(tb, this.id)
    }


    updateRemoveImposed(): void
    {
        if(Time.currentSeconds <= 32)
        {
            for(const elem of this._imposedSpells)
                if(elem.isEnabled)
                    elem.isEnabled = false

            for(const elem of this._imposedBuildings)
                if(elem.isEnabled)
                    elem.isEnabled = false
        }
    }
}
export namespace Tribe
{
    export interface Spells extends TribeInternal.SpellOrBuildingPool<Spell, SpellModel>
    {
        readonly burn: Spell
        readonly blast: Spell
        readonly lightningBolt: Spell
        readonly tornado: Spell
        readonly swarm: Spell
        readonly invisibility: Spell
        readonly hypnotism: Spell
        readonly firestorm: Spell
        readonly ghostArmy: Spell
        readonly erosion: Spell
        readonly swamp: Spell
        readonly landBridge: Spell
        readonly angelOfDeath: Spell
        readonly earthquake: Spell
        readonly flatten: Spell
        readonly volcano: Spell
        readonly conversion: Spell
        readonly armageddon: Spell
        readonly shield: Spell
        readonly bloodlust: Spell
        readonly teleport: Spell
        
        readonly hill: Spell
        readonly rise: Spell
        readonly valley: Spell
        readonly dip: Spell
        readonly placeTree: Spell
        readonly clearMapWho: Spell
        readonly placeShaman: Spell
        readonly placeWild: Spell
    }

    export interface Buildings extends TribeInternal.SpellOrBuildingPool<Building, BuildingModel>
    {
        readonly smallHut: Building
        readonly hut: Building
        readonly largeHut: Building
        readonly drumTower: Building
        readonly temple: Building
        readonly spyTrain: Building
        readonly warriorTrain: Building
        readonly superWarriorTrain: Building
        readonly reconversion: Building
        readonly wallPiece: Building
        readonly gate: Building
        readonly currOeSlot: Building
        readonly boatHut: Building
        readonly alternativeBoatHut: Building
        readonly airshipHut: Building
        readonly alternativeAirshipHut: Building
        readonly guardPost: Building
        readonly library: Building
        readonly prision: Building
    }

    export interface Persons extends TribeInternal.ElementPool<Person, PersonModel>
    {
        readonly wild: Person
        readonly brave: Person
        readonly warrior: Person
        readonly preacher: Person
        readonly spy: Person
        readonly superWarrior: Person
        readonly shaman: Shaman
        readonly angelOfDeath: Person
    }
}


const TribePool: Record<TribeID, Tribe> = {
    [TribeID.NEUTRAL]: Tribe.Neutral,
    [TribeID.BLUE]: Tribe.Blue,
    [TribeID.RED]: Tribe.Red,
    [TribeID.YELLOW]: Tribe.Yellow,
    [TribeID.GREEN]: Tribe.Green,
    [TribeID.CYAN]: Tribe.Cyan,
    [TribeID.PINK]: Tribe.Pink,
    [TribeID.BLACK]: Tribe.Black,
    [TribeID.ORANGE]: Tribe.Orange,
    [TribeID.HOSTBOT]: Tribe.Hostbot
}

const TribeName: Record<TribeID, string> = {
    [TribeID.NEUTRAL]: "Neutral",
    [TribeID.BLUE]: "Blue",
    [TribeID.RED]: "Red",
    [TribeID.YELLOW]: "Yellow",
    [TribeID.GREEN]: "Green",
    [TribeID.CYAN]: "Cyan",
    [TribeID.PINK]: "Pink",
    [TribeID.BLACK]: "Black",
    [TribeID.ORANGE]: "Orange",
    [TribeID.HOSTBOT]: "Hostbot"
}
