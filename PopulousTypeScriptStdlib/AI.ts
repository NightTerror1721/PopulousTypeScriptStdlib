import "./PopModules"
import { BuildingOrientation, InternalBuildingModel } from "./Buildings"
import { IMath } from "./IMath"
import { Marker, RawMarker } from "./Markers"
import { InternalPersonModel } from "./Persons"
import { InternalSpellModel, Spell } from "./Spells"
import { BuildingModel, PersonModel, SpellModel, VehicleModel } from "./Things"
import { Location } from "./Location"
import { Map, MapCell } from "./Map"
import { Time } from "./GameTime"
import { LocalDataArray } from "./Serialization"

function selectInternalPersonOrBuildingModel(type: PopScriptAttackTargetType|undefined, model: PersonModel|BuildingModel|undefined)
{
    if(type === undefined ||type === PopScriptAttackTargetType.ATTACK_BUILDING)
    {
        const result = InternalBuildingModel.of(model as BuildingModel)
        return result ? result : PopScriptBuildingModel.INT_NO_SPECIFIC_BUILDING
    }
    else
    {
        const result = InternalPersonModel.of(model as PersonModel)
        return result ? result : PopScriptFollowerModel.INT_NO_SPECIFIC_PERSON
    }
}

function selectInternalSpellModel(model: SpellModel|undefined)
{
    const result = InternalSpellModel.of(model)
    return result ? result : PopScriptSpellModel.INT_NO_SPECIFIC_SPELL
}

export class AI
{
    public readonly tribe: TribeID
    public readonly attributes: AI.Attributes
    public readonly states: AI.States
    private readonly _player: Player
    private readonly _cache: Record<string, any>

    constructor(tribe: TribeID)
    {
        this.tribe = tribe
        this.attributes = new AI.Attributes(tribe)
        this.states = new AI.States(tribe)
        this._player = getPlayer(tribe)
        this._cache = {}
    }

    resetBaseMarker(): void { RESET_BASE_MARKER(this.tribe) }
    setBaseMarker(marker: RawMarker): void { SET_BASE_MARKER(this.tribe, Marker.asId(marker)) }

    isShamanInArea(marker: RawMarker, radius: number) { return IS_SHAMAN_IN_AREA(this.tribe, Marker.asId(marker), radius) != 0 }

    get numPeopleBeingPreached(): number { return GET_NUM_PEOPLE_BEING_PREACHED(this.tribe) }

    deselectAllPeople(): void { DESELECT_ALL_PEOPLE(this.tribe) }

    get giveUpAndSulk(): boolean { return this._cache["giveUpAndSulk"] === true }
    set giveUpAndSulk(value: boolean) { GIVE_UP_AND_SULK(this.tribe, value ? 1 : 0); this._cache["giveUpAndSulk"] = value }

    get delayMainDrumTower(): boolean { return this._cache["delayMainDrumTower"] === true }
    set delayMainDrumTower(value: boolean) { DELAY_MAIN_DRUM_TOWER(value ? 1 : 0, this.tribe); this._cache["delayMainDrumTower"] = value }

    get numPeopleInHouses(): number { return COUNT_PEOPLE_IN_HOUSES(this.tribe) }

    startReincNow(): void { START_REINC_NOW(this.tribe) }

    get attackVariable(): number { return this._cache["attackVariable"] ?? 0 }
    set attackVariable(value: number) { SET_ATTACK_VARIABLE(this.tribe, value); this._cache["attackVariable"] = value }

    attack(
        targetTribe: TribeID,
        people: number,
        targetType: PopScriptAttackTargetType,
        damage: number,
        targetModel?: PersonModel|BuildingModel,
        spell1?: SpellModel,
        spell2?: SpellModel,
        spell3?: SpellModel,
        attackType?: PopScriptAttackType,
        lookAfter?: number,
        marker1?: RawMarker,
        marker2?: RawMarker,
        direction?: number
    ): boolean
    attack(params: AI.AttackParameters): boolean
    attack(
        targetTribeOrParams: TribeID|AI.AttackParameters,
        people?: number,
        targetType?: PopScriptAttackTargetType,
        damage?: number,
        targetModel?: PersonModel|BuildingModel,
        spell1?: SpellModel,
        spell2?: SpellModel,
        spell3?: SpellModel,
        attackType?: PopScriptAttackType,
        lookAfter?: number,
        marker1?: RawMarker,
        marker2?: RawMarker,
        direction?: number
    ): boolean
    {
        if(typeof targetTribeOrParams === "number")
        {
            return ATTACK(
                this.tribe,
                targetTribeOrParams,
                people ? people : 1,
                targetType ? targetType : PopScriptAttackTargetType.ATTACK_BUILDING,
                selectInternalPersonOrBuildingModel(targetType, targetModel),
                damage ? damage : 1,
                selectInternalSpellModel(spell1),
                selectInternalSpellModel(spell2),
                selectInternalSpellModel(spell3),
                attackType ? attackType : PopScriptAttackType.ATTACK_NORMAL,
                lookAfter ? lookAfter : 0,
                Marker.asId(Marker.validOrDefault(marker1)),
                Marker.asId(Marker.validOrDefault(marker2)),
                direction ? direction : -1
            ) != 0
        }

        return ATTACK(
            this.tribe,
            targetTribeOrParams.targetTribe,
            targetTribeOrParams.people,
            targetTribeOrParams.targetType,
            selectInternalPersonOrBuildingModel(targetTribeOrParams.targetType, targetTribeOrParams.targetModel),
            targetTribeOrParams.damage,
            selectInternalSpellModel(targetTribeOrParams.spell1),
            selectInternalSpellModel(targetTribeOrParams.spell2),
            selectInternalSpellModel(targetTribeOrParams.spell3),
            targetTribeOrParams.attackType ? targetTribeOrParams.attackType : PopScriptAttackType.ATTACK_NORMAL,
            targetTribeOrParams.lookAfter ? targetTribeOrParams.lookAfter : 0,
            Marker.asId(targetTribeOrParams.marker1 ? targetTribeOrParams.marker1 : -1),
            Marker.asId(targetTribeOrParams.marker2 ? targetTribeOrParams.marker2 : -1),
            targetTribeOrParams.direction ? targetTribeOrParams.direction : -1
        ) != 0
    }

    setMarkerEntry(
        entry: number,
        marker1: RawMarker,
        marker2?: RawMarker,
        numBraves?: number,
        numWarriors?: number,
        numSuperWarriors?: number,
        numPreachers?: number
    ): void
    setMarkerEntry(props: AI.MarkerEntryParameters): void
    setMarkerEntry(
        entry: number|AI.MarkerEntryParameters,
        marker1?: RawMarker,
        marker2?: RawMarker,
        numBraves?: number,
        numWarriors?: number,
        numSuperWarriors?: number,
        numPreachers?: number
    ): void
    {
        if(typeof entry === "number")
        {
            SET_MARKER_ENTRY(
                this.tribe,
                IMath.imax(0, entry),
                Marker.asId(Marker.validOrDefault(marker1, Marker.MK0)),
                Marker.asId(Marker.validOrDefault(marker2)),
                numBraves ? numBraves : 0,
                numWarriors ? numWarriors : 0,
                numSuperWarriors ? numSuperWarriors : 0,
                numPreachers ? numPreachers : 0
            )
            return
        }

        SET_MARKER_ENTRY(
            this.tribe,
            IMath.imax(0, entry.entry),
            Marker.asId(Marker.validOrDefault(entry.marker1, Marker.MK0)),
            Marker.asId(Marker.validOrDefault(entry.marker2)),
            entry.braves ? entry.braves : 0,
            entry.warriors ? entry.warriors : 0,
            entry.superWarriors ? entry.superWarriors : 0,
            entry.preachers ? entry.preachers : 0
        )
    }

    executeMarkerEntries(entry: number, entry2?: number, entry3?: number, entry4?: number): void
    executeMarkerEntries(entries: number[]): void
    executeMarkerEntries(entry: number|number[], entry2?: number, entry3?: number, entry4?: number): void
    {
        if(typeof entry === "number")
        {
            MARKER_ENTRIES(
                this.tribe,
                entry,
                entry2 ? entry2 : -1,
                entry3 ? entry3 : -1,
                entry4 ? entry4 : -1
            )
            return
        }

        if(entry.length < 1)
            return

        const len = entry.length
        for(let i = 0; i < len; i += 4)
        {
            MARKER_ENTRIES(
                this.tribe,
                entry[i],
                (i + 1) < len ? entry[i + 1] : -1,
                (i + 2) < len ? entry[i + 2] : -1,
                (i + 3) < len ? entry[i + 3] : -1
            )
        }
    }

    callToArms(): void { CALL_TO_ARMS(this.tribe) }

    marvellousHouseDeath(): void { MARVELLOUS_HOUSE_DEATH(this.tribe); }

    get defenseRadius(): number { return this._cache["defenseRadius"] ?? 0 }
    set defenseRadius(value: number) { SET_DEFENCE_RADIUS(this.tribe, value); this._cache["defenseRadius"] = value }

    get isReincEnabled(): boolean { return this._cache["reinc"] ?? true }
    get reinc(): boolean { return this._cache["reinc"] ?? true }
    set reinc(value: boolean) { SET_REINCARNATION(value ? 1 : 0, this.tribe); this._cache["reinc"] = value }

    get isBucketUsageEnabled(): boolean { return this._cache["bucketUsage"] === true }
    get bucketUsage(): boolean { return this._cache["bucketUsage"] === true }
    set bucketUsage(value: boolean) { SET_BUCKET_USAGE(this.tribe, value ? 1 : 0); this._cache["bucketUsage"] = value }

    get isExtraGoodCollectionEnabled(): boolean { return this._cache["isExtraGoodCollectionEnabled"] === true }
    get extraGoodCollection(): boolean { return this._cache["extraGoodCollection"] === true }
    set extraGoodCollection(value: boolean) { EXTRA_WOOD_COLLECTION(value ? 1 : 0, this.tribe); this._cache["extraGoodCollection"] = value }

    setExtraWoodCollectionRadii(min: number, max: number, x: number, z: number): void
    setExtraWoodCollectionRadii(min: number, max: number, location: Location): void
    setExtraWoodCollectionRadii(min: number, max: number, xOrLoc: number|Location, zOrUndef?: number): void
    {
        let x: number, z: number
        if(typeof xOrLoc === "number")
        {
            x = xOrLoc
            z = zOrUndef as number
        }
        else [x, z] = Map.getCellComponentsFromLocation(xOrLoc)

        SET_WOOD_COLLECTION_RADII(this.tribe, min, max, x, z)
    }

    setBucketCountForSpell(spell: SpellModel, multiplier: number): void
    {
        SET_BUCKET_COUNT_FOR_SPELL(this.tribe, selectInternalSpellModel(spell), multiplier)
    }

    get countWithBuildCommand(): number { return COUNT_WITH_BUILD_COMMAND(this.tribe) }

    clearHouseInfoFlag(): void { CLEAR_HOUSE_INFO_FLAG(this.tribe) }

    get shapesCount(): number { return COUNT_SHAPES(this.tribe) }

    sendPeopleToMarker(marker: RawMarker): void { SEND_PEOPLE_TO_MARKER(this.tribe, Marker.asId(marker)) }

    trackShamanExtraBollocks(angle: number): void { TRACK_SHAMAN_EXTRA_BOLLOCKS(this.tribe, angle) }

    navCheck(tribeTarget: TribeID, targetType: PopScriptAttackTargetType, targetModel?: PersonModel|BuildingModel, remember?: number): boolean
    {
        return NAV_CHECK(
            this.tribe,
            tribeTarget,
            targetType,
            selectInternalPersonOrBuildingModel(targetType, targetModel),
            remember ? remember : 0
        ) != 0
    }

    get isOnlyStandAtMarkersEnabled(): boolean { return this._cache["isOnlyStandAtMarkersEnabled"] === true }
    get onlyStandAtMarkers(): boolean { return this._cache["onlyStandAtMarkers"] === true }
    set onlyStandAtMarkers(value: boolean)
    {
        if(value) ONLY_STAND_AT_MARKERS(this.tribe)
        else CLEAR_STANDING_PEOPLE(this.tribe)
        this._cache["onlyStandAtMarkers"] = value
    }

    clearGuardingFrom(entry: number, entry2?: number, entry3?: number, entry4?: number): void
    clearGuardingFrom(entries: number[]): void
    clearGuardingFrom(entry: number|number[], entry2?: number, entry3?: number, entry4?: number): void
    {
        if(typeof entry === "number")
        {
            CLEAR_GUARDING_FROM(
                this.tribe,
                entry,
                entry2 ? entry2 : -1,
                entry3 ? entry3 : -1,
                entry4 ? entry4 : -1
            )
            return
        }

        if(entry.length < 1)
            return

        const len = entry.length
        for(let i = 0; i < len; i += 4)
        {
            CLEAR_GUARDING_FROM(
                this.tribe,
                entry[i],
                (i + 1) < len ? entry[i + 1] : -1,
                (i + 2) < len ? entry[i + 2] : -1,
                (i + 3) < len ? entry[i + 3] : -1
            )
        }
    }

    defendShamen(numPeople: number): void
    {
        if(numPeople > 0) DEFEND_SHAMEN(this.tribe, numPeople)
    }

    sendShamenDefendersHome(): void { SEND_SHAMEN_DEFENDERS_HOME(this.tribe) }

    executeBoardPatrol(vehicleType: VehicleModel, numPeople: number, marker1: RawMarker, marker2?: RawMarker, marker3?: RawMarker, marker4?: RawMarker): void
    {
        BOAT_PATROL(
            this.tribe,
            numPeople,
            Marker.asId(marker1),
            Marker.asId(Marker.validOrDefault(marker2)),
            Marker.asId(Marker.validOrDefault(marker3)),
            Marker.asId(Marker.validOrDefault(marker4)),
            vehicleType
        )
    }

    prayAtHead(numPeople: number, marker: RawMarker): void
    {
        if(numPeople < 0 || !Marker.of(marker).isInvalid)
            return
        PRAY_AT_HEAD(this.tribe, numPeople, Marker.asId(marker))
    }

    populateDrumTower(model: PersonModel, x: number, z: number): void
    populateDrumTower(model: PersonModel, location: Location): void
    populateDrumTower(model: PersonModel, xOrLoc: number|Location, zOrUndef?: number): void
    {
        if(typeof xOrLoc === "number")
            PUT_PERSON_IN_DT(this.tribe, model, xOrLoc, zOrUndef as number)
        else
        {
            const [x, z] = Map.getCellComponentsFromLocation(xOrLoc)
            PUT_PERSON_IN_DT(this.tribe, model, x, z)
        }
    }

    get buildingDirection(): BuildingOrientation { return this._cache["buildingDirection"] ?? -1 }
    set buildingDirection(value: BuildingOrientation|undefined)
    {
        if(value) SET_BUILDING_DIRECTION(this.tribe, value)
        else SET_BUILDING_DIRECTION(this.tribe, -1)
        this._cache["buildingDirection"] = value
    }

    get baseRadius(): number { return this._cache["baseRadius"] ?? 0 }
    set baseRadius(value: number)
    {
        SET_BASE_RADIUS(this.tribe, IMath.imax(0, value))
        this._cache["baseRadius"] = IMath.imax(0, value)
    }

    getNumPeopleInMarker(targetTribe: TribeID, marker: RawMarker, radius: number): number
    {
        return COUNT_PEOPLE_IN_MARKER(this.tribe, targetTribe, Marker.asId(marker), IMath.imax(0, radius))
    }

    get mainDrumTowerLocation(): Location { return this._cache["mainDrumTowerLocation"]?.copy() ?? Location.make2D() }
    set mainDrumTowerLocation(value: Location|MapCell|Marker)
    {
        if(value instanceof Location)
        {
            const [x, z] = Map.getCellComponentsFromLocation(value)
            SET_DRUM_TOWER_POS(this.tribe, x, z)
            this._cache["mainDrumTowerLocation"] = value.copy()
        }
        else if(Marker.isMarker(value))
        {
            const [x, z] = value.mapCoords
            SET_DRUM_TOWER_POS(this.tribe, x, z)
            this._cache["mainDrumTowerLocation"] = Location.make2D(x, z)
        }
        else
        {
            SET_DRUM_TOWER_POS(this.tribe, value[0], value[1])
            this._cache["mainDrumTowerLocation"] = Location.make2D(value[0], value[1])
        }
    }

    convertAtMarker(marker: RawMarker): void { CONVERT_AT_MARKER(this.tribe, Marker.asId(marker)) }

    preachAtMarker(marker: RawMarker): void { PREACH_AT_MARKER(this.tribe, Marker.asId(marker)) }

    sendAllPeopleToMarker(marker: RawMarker): void { SEND_ALL_PEOPLE_TO_MARKER(this.tribe, Marker.asId(marker)) }

    setGuardBetweenMarkers(
        marker1: RawMarker,
        marker2: RawMarker,
        braves: number = 0,
        warriors: number = 0,
        superWarriors: number = 0,
        preachers: number = 0,
        useGhosts: boolean = false
    ): void
    {
        const type = useGhosts ? PopScriptGuardType.GUARD_WITH_GHOSTS : PopScriptGuardType.GUARD_NORMAL
        GUARD_BETWEEN_MARKERS(
            this.tribe,
            Marker.asId(marker1),
            Marker.asId(marker2),
            IMath.imax(0, braves),
            IMath.imax(0, warriors),
            IMath.imax(0, superWarriors),
            IMath.imax(0, preachers),
            type
        )
    }

    buildDrumTower(x: number, z: number): void
    buildDrumTower(location: Location): void
    buildDrumTower(xOrLoc: number|Location, zOrUndef?: number): void
    {
        if(typeof xOrLoc === "number")
            BUILD_DRUM_TOWER(this.tribe, xOrLoc, zOrUndef as number)
        else
        {
            const [x, z] = Map.getCellComponentsFromLocation(xOrLoc)
            BUILD_DRUM_TOWER(this.tribe, x, z)
        }
    }

    sendGhostPeople(num: number): void { SEND_GHOST_PEOPLE(this.tribe, num) }

    get hasHouseInfoBeenShown(): boolean { return HAS_HOUSE_INFO_BEEN_SHOWN(this.tribe) != 0 }

    get targetDrumTowers(): boolean { return this._cache["targetDrumTowers"] === true }
    set targetDrumTowers(value: boolean)
    {
        if(value) TARGET_DRUM_TOWERS(this.tribe)
        else DONT_TARGET_DRUM_TOWERS(this.tribe)
        this._cache["targetDrumTowers"] = value
    }

    get targetSuperWarriors(): boolean { return this._cache["targetSuperWarriors"] === true }
    set targetSuperWarriors(value: boolean)
    {
        if(value) TARGET_S_WARRIORS(this.tribe)
        else DONT_TARGET_S_WARRIORS(this.tribe)
        this._cache["targetSuperWarriors"] = value
    }

    get freeEntries(): number { return FREE_ENTRIES(this.tribe) }

    get numShamenDefenders(): number { return NUM_SHAMEN_DEFENDERS(this.tribe) }

    updateBuckets(deltaTime: Time, evertTurns: number = 256, maxPeopleWithTurbo: number = 79): void
    {
        deltaTime.everyTurns(evertTurns, 0, () => {
            this.bucketUsage = true
            if(this._player.NumPeople <= maxPeopleWithTurbo)
            {
                this.setBucketCountForSpell(SpellModel.Blast, 8)
                this.setBucketCountForSpell(SpellModel.Conversion, 8)
                this.setBucketCountForSpell(SpellModel.Swarm, 32)
                this.setBucketCountForSpell(SpellModel.Invisibility, 40)
                this.setBucketCountForSpell(SpellModel.Shield, 48)
                this.setBucketCountForSpell(SpellModel.LandBridge, 66)
                this.setBucketCountForSpell(SpellModel.LightningBolt, 64)
                this.setBucketCountForSpell(SpellModel.Hypnotism, 70)
                this.setBucketCountForSpell(SpellModel.Tornado, 72)
                this.setBucketCountForSpell(SpellModel.Swamp, 80)
                this.setBucketCountForSpell(SpellModel.Flatten, 100)
                this.setBucketCountForSpell(SpellModel.Earthquake, 140)
                this.setBucketCountForSpell(SpellModel.Erosion, 168)
                this.setBucketCountForSpell(SpellModel.Firestorm, 320)
                this.setBucketCountForSpell(SpellModel.AngelOfDeath, 408)
                this.setBucketCountForSpell(SpellModel.Volcano, 640)
            }
            else
            {
                this.setBucketCountForSpell(SpellModel.Blast, 4)
                this.setBucketCountForSpell(SpellModel.Conversion, 4)
                this.setBucketCountForSpell(SpellModel.Swarm, 16)
                this.setBucketCountForSpell(SpellModel.Invisibility, 20)
                this.setBucketCountForSpell(SpellModel.Shield, 24)
                this.setBucketCountForSpell(SpellModel.LandBridge, 33)
                this.setBucketCountForSpell(SpellModel.LightningBolt, 32)
                this.setBucketCountForSpell(SpellModel.Hypnotism, 35)
                this.setBucketCountForSpell(SpellModel.Tornado, 36)
                this.setBucketCountForSpell(SpellModel.Swamp, 40)
                this.setBucketCountForSpell(SpellModel.Flatten, 50)
                this.setBucketCountForSpell(SpellModel.Earthquake, 70)
                this.setBucketCountForSpell(SpellModel.Erosion, 84)
                this.setBucketCountForSpell(SpellModel.Firestorm, 160)
                this.setBucketCountForSpell(SpellModel.AngelOfDeath, 204)
                this.setBucketCountForSpell(SpellModel.Volcano, 320)
            }
        })
    }

    initComputer(): void { computer_init_player(this._player) }

    setComputerBaseLocation(x: number, z: number): void
    setComputerBaseLocation(location: Location): void
    setComputerBaseLocation(xOrLoc: number|Location, zOrUndef?: number): void
    {
        if(typeof xOrLoc === "number")
            computer_set_base_pos(this._player, xOrLoc, zOrUndef!!)
        else
        {
            const [x, z] = Map.getCellComponentsFromLocation(xOrLoc)
            computer_set_base_pos(this._player, x, z)
        }
    }

    setInitialCommand(): void { set_players_shaman_initial_command(this._player) }

    destroyReinc() { destroy_reinc(this._player) }

    get shamanDefendBaseLocation(): Location { return this._cache["shamanDefendBaseLocation"]?.copy() ?? Location.make2D() }
    set shamanDefendBaseLocation(value: Location|MapCell|Marker|undefined)
    {
        if(value === undefined)
        {
            SHAMAN_DEFEND(this.tribe, 0, 0, 0)
        }
        else if(value instanceof Location)
        {
            const [x, z] = Map.getCellComponentsFromLocation(value)
            SHAMAN_DEFEND(this.tribe, x, z, 1)
            this._cache["shamanDefendBaseLocation"] = value.copy()
        }
        else if(Marker.isMarker(value))
        {
            const [x, z] = value.mapCoords
            SHAMAN_DEFEND(this.tribe, x, z, 1)
            this._cache["shamanDefendBaseLocation"] = value.location
        }
        else
        {
            SHAMAN_DEFEND(this.tribe, value[0], value[1], 1)
            this._cache["shamanDefendBaseLocation"] = Location.make2D(value[0], value[1])
        }
    }

    setSpellEntry(entry: number, spell: Spell|SpellModel, minMana: number, frequency: number, minPeople: number, baseSpell: boolean): void
    setSpellEntry(entry: number, spell: Spell|SpellModel, frequency: number, minPeople: number, baseSpell: boolean): void
    setSpellEntry(entry: number, spell: Spell|SpellModel, minMana: number, frequency: number, minPeople: number|boolean, baseSpell?: boolean): void
    {
        const model: number = typeof spell === "number" ? spell : spell.model
        if(baseSpell === undefined)
        {
            const spellCost = Spell.getCost(model)
            SET_SPELL_ENTRY(this.tribe, entry, model, spellCost, minMana, frequency, minPeople ? 1 : 0)
        }
        else
            SET_SPELL_ENTRY(this.tribe, entry, model, minMana, frequency, minPeople as number, baseSpell ? 1 : 0)
    }
}

export namespace AI
{
    export interface AttackParameters
    {
        targetTribe: TribeID
        people: number
        targetType: PopScriptAttackTargetType
        damage: number
        targetModel?: PersonModel|BuildingModel
        spell1?: SpellModel
        spell2?: SpellModel
        spell3?: SpellModel
        attackType?: PopScriptAttackType
        lookAfter?: number
        marker1?: RawMarker
        marker2?: RawMarker
        direction?: number
    }

    export interface MarkerEntryParameters
    {
        entry: number,
        marker1: RawMarker,
        marker2?: RawMarker,
        braves?: number,
        warriors?: number,
        superWarriors?: number,
        preachers?: number
    }

    export class Attributes
    {
        private readonly _tribe: TribeID

        public constructor(tribe: TribeID)
        {
            this._tribe = tribe
        }

        private setAttribute(attribute: PopScriptCPAttribute, value: number): void
        {
            WRITE_CP_ATTRIB(this._tribe, attribute, IMath.toInteger(value))
        }

        private getAttribute(attribute: PopScriptCPAttribute): number
        {
            return READ_CP_ATTRIB(this._tribe, attribute)
        }

        public exportData(): LocalDataArray
        {
            const data: LocalDataArray = []
            for(let i = 0; i <= 47; i++)
                data.push(this.getAttribute(i))
            return data
        }

        public importData(data: LocalDataArray): void
        {
            const len = IMath.imin(48, data.length)
            for(let i = 0; i <= len; i++)
            {
                const value = data[i]
                if(typeof value === "number")
                    this.setAttribute(i, value)
            }
        }

        get expansion() { return this.getAttribute(0) }
        get prefSpyTrains() { return this.getAttribute(1) }
        get prefReligiousTrains() { return this.getAttribute(2) }
        get prefWarriorTrains() { return this.getAttribute(3) }
        get prefSuperWarriorTrains() { return this.getAttribute(4) }
        get prefSpyPeople() { return this.getAttribute(5) }
        get prefReligiousPeople() { return this.getAttribute(6) }
        get prefWarriorPeople() { return this.getAttribute(7) }
        get prefSuperWarriorPeople() { return this.getAttribute(8) }
        get maxBuildingsOnGo() { return this.getAttribute(9) }
        get housePercentage() { return this.getAttribute(10) }
        get awayBrave() { return this.getAttribute(11) }
        get awayWarrior() { return this.getAttribute(12) }
        get awayReligious() { return this.getAttribute(13) }
        get defenseRadIncr() { return this.getAttribute(14) }
        get maxDefensiveActions() { return this.getAttribute(15) }
        get awaySpy() { return this.getAttribute(16) }
        get awaySuperWarrior() { return this.getAttribute(17) }
        get attackPercentage() { return this.getAttribute(18) }
        get awayShaman() { return this.getAttribute(19) }
        get peoplePerBoat() { return this.getAttribute(20) }
        get peoplePerBalloon() { return this.getAttribute(21) }
        get dontUseBoats() { return this.getAttribute(22) }
        get maxSpyAttacks() { return this.getAttribute(23) }
        get enemySpyMaxStand() { return this.getAttribute(24) }
        get maxAttacks() { return this.getAttribute(25) }
        get emptyAtWaypoint() { return this.getAttribute(26) }
        get spyCheckFrequency() { return this.getAttribute(27) }
        get retreatValue() { return this.getAttribute(28) }
        get baseUnderAttackRetreat() { return this.getAttribute(29) }
        get randomBuildSide() { return this.getAttribute(30) }
        get usePreacherForDefense() { return this.getAttribute(31) }
        get shamenBlast() { return this.getAttribute(32) }
        get maxTrainAtOnce() { return this.getAttribute(33) }
        get groupOption() { return this.getAttribute(34) }
        get prefBoatHuts() { return this.getAttribute(35) }
        get prefBalloonHuts() { return this.getAttribute(36) }
        get prefBoatDrivers() { return this.getAttribute(37) }
        get prefBalloonDrivers() { return this.getAttribute(38) }
        get fightStopDistance() { return this.getAttribute(39) }
        get spyDiscoverChance() { return this.getAttribute(40) }
        get countPreachDamage() { return this.getAttribute(41) }
        get dontGroupAtDT() { return this.getAttribute(42) }
        get spellDelay() { return this.getAttribute(43) }
        get dontDeleteUselessBoatHouse() { return this.getAttribute(44) }
        get boatHouseBroken() { return this.getAttribute(45) }
        get dontAutoTrainPreachers() { return this.getAttribute(46) }
        get spare6() { return this.getAttribute(47) }

        set expansion(value: number) { this.setAttribute(0, value) }
        set prefSpyTrains(value: number) { this.setAttribute(1, value) }
        set prefReligiousTrains(value: number) { this.setAttribute(2, value) }
        set prefWarriorTrains(value: number) { this.setAttribute(3, value) }
        set prefSuperWarriorTrains(value: number) { this.setAttribute(4, value) }
        set prefSpyPeople(value: number) { this.setAttribute(5, value) }
        set prefReligiousPeople(value: number) { this.setAttribute(6, value) }
        set prefWarriorPeople(value: number) { this.setAttribute(7, value) }
        set prefSuperWarriorPeople(value: number) { this.setAttribute(8, value) }
        set maxBuildingsOnGo(value: number) { this.setAttribute(9, value) }
        set housePercentage(value: number) { this.setAttribute(10, value) }
        set awayBrave(value: number) { this.setAttribute(11, value) }
        set awayWarrior(value: number) { this.setAttribute(12, value) }
        set awayReligious(value: number) { this.setAttribute(13, value) }
        set defenseRadIncr(value: number) { this.setAttribute(14, value) }
        set maxDefensiveActions(value: number) { this.setAttribute(15, value) }
        set awaySpy(value: number) { this.setAttribute(16, value) }
        set awaySuperWarrior(value: number) { this.setAttribute(17, value) }
        set attackPercentage(value: number) { this.setAttribute(18, value) }
        set awayShaman(value: number) { this.setAttribute(19, value) }
        set peoplePerBoat(value: number) { this.setAttribute(20, value) }
        set peoplePerBalloon(value: number) { this.setAttribute(21, value) }
        set dontUseBoats(value: number) { this.setAttribute(22, value) }
        set maxSpyAttacks(value: number) { this.setAttribute(23, value) }
        set enemySpyMaxStand(value: number) { this.setAttribute(24, value) }
        set maxAttacks(value: number) { this.setAttribute(25, value) }
        set emptyAtWaypoint(value: number) { this.setAttribute(26, value) }
        set spyCheckFrequency(value: number) { this.setAttribute(27, value) }
        set retreatValue(value: number) { this.setAttribute(28, value) }
        set baseUnderAttackRetreat(value: number) { this.setAttribute(29, value) }
        set randomBuildSide(value: number) { this.setAttribute(30, value) }
        set usePreacherForDefense(value: number) { this.setAttribute(31, value) }
        set shamenBlast(value: number) { this.setAttribute(32, value) }
        set maxTrainAtOnce(value: number) { this.setAttribute(33, value) }
        set groupOption(value: number) { this.setAttribute(34, value) }
        set prefBoatHuts(value: number) { this.setAttribute(35, value) }
        set prefBalloonHuts(value: number) { this.setAttribute(36, value) }
        set prefBoatDrivers(value: number) { this.setAttribute(37, value) }
        set prefBalloonDrivers(value: number) { this.setAttribute(38, value) }
        set fightStopDistance(value: number) { this.setAttribute(39, value) }
        set spyDiscoverChance(value: number) { this.setAttribute(40, value) }
        set countPreachDamage(value: number) { this.setAttribute(41, value) }
        set dontGroupAtDT(value: number) { this.setAttribute(42, value) }
        set spellDelay(value: number) { this.setAttribute(43, value) }
        set dontDeleteUselessBoatHouse(value: number) { this.setAttribute(44, value) }
        set boatHouseBroken(value: number) { this.setAttribute(45, value) }
        set dontAutoTrainPreachers(value: number) { this.setAttribute(46, value) }
        set spare6(value: number) { this.setAttribute(47, value) }
    }

    export class States
    {
        private readonly _tribe: TribeID
        private readonly _cache: { [key: number]: boolean }

        public constructor(tribe: TribeID)
        {
            this._tribe = tribe
            this._cache = {}
        }

        private setState(state: PopScriptStateFlag, value: boolean): void
        {
            STATE_SET(this._tribe, value ? 1 : 0, state)
            this._cache[state] = value
        }

        private getState(state: PopScriptStateFlag): boolean
        {
            return this._cache[state] === true
        }

        public exportData(): LocalDataArray
        {
            const data: LocalDataArray = []
            for(let i = 0; i < 29; i++)
                data.push(this.getState(i))
            return data
        }

        public importData(data: LocalDataArray): void
        {
            const len = IMath.imin(29, data.length)
            for(let i = 0; i <= len; i++)
            {
                const value = data[i]
                if(typeof value === "boolean")
                    this.setState(i, value)
            }
        }

        get constructBuilding(): boolean { return this.getState(0) }
        get fetchWood(): boolean { return this.getState(1) }
        get shamanGetWildPreeps(): boolean { return this.getState(2) }
        get houseAPerson(): boolean { return this.getState(3) }
        get sendGhosts(): boolean { return this.getState(4) }
        get bringNewPeopleBack(): boolean { return this.getState(5) }
        get trainPeople(): boolean { return this.getState(6) }
        get populateDrumTower(): boolean { return this.getState(7) }
        get defend(): boolean { return this.getState(8) }
        get defendBase(): boolean { return this.getState(9) }
        get spellDefence(): boolean { return this.getState(10) }
        get preach(): boolean { return this.getState(11) }
        get buildWalls(): boolean { return this.getState(12) }
        get sabotage(): boolean { return this.getState(13) }
        get spellOffensive(): boolean { return this.getState(14) }
        get superDefend(): boolean { return this.getState(15) }
        get buildVehicle(): boolean { return this.getState(16) }
        get fetchLostPeople(): boolean { return this.getState(17) }
        get fetchLostVehicle(): boolean { return this.getState(18) }
        get fetchFarVehicle(): boolean { return this.getState(19) }
        get autoAttack(): boolean { return this.getState(20) }
        get shamanDefend(): boolean { return this.getState(21) }
        get flattenBase(): boolean { return this.getState(22) }
        get buildOuterDefences(): boolean { return this.getState(23) }
        get guardAtMarker(): boolean { return this.getState(24) }
        get sendAllToMarker(): boolean { return this.getState(25) }
        get prayAtHead(): boolean { return this.getState(26) }
        get boatPatrol(): boolean { return this.getState(27) }
        get defendShamen(): boolean { return this.getState(28) }

        set constructBuilding(value: boolean) { this.setState(0, value) }
        set fetchWood(value: boolean) { this.setState(1, value) }
        set shamanGetWildPreeps(value: boolean) { this.setState(2, value) }
        set houseAPerson(value: boolean) { this.setState(3, value) }
        set sendGhosts(value: boolean) { this.setState(4, value) }
        set bringNewPeopleBack(value: boolean) { this.setState(5, value) }
        set trainPeople(value: boolean) { this.setState(6, value) }
        set populateDrumTower(value: boolean) { this.setState(7, value) }
        set defend(value: boolean) { this.setState(8, value) }
        set defendBase(value: boolean) { this.setState(9, value) }
        set spellDefence(value: boolean) { this.setState(10, value) }
        set preach(value: boolean) { this.setState(11, value) }
        set buildWalls(value: boolean) { this.setState(12, value) }
        set sabotage(value: boolean) { this.setState(13, value) }
        set spellOffensive(value: boolean) { this.setState(14, value) }
        set superDefend(value: boolean) { this.setState(15, value) }
        set buildVehicle(value: boolean) { this.setState(16, value) }
        set fetchLostPeople(value: boolean) { this.setState(17, value) }
        set fetchLostVehicle(value: boolean) { this.setState(18, value) }
        set fetchFarVehicle(value: boolean) { this.setState(19, value) }
        set autoAttack(value: boolean) { this.setState(20, value) }
        set shamanDefend(value: boolean) { this.setState(21, value) }
        set flattenBase(value: boolean) { this.setState(22, value) }
        set buildOuterDefences(value: boolean) { this.setState(23, value) }
        set guardAtMarker(value: boolean) { this.setState(24, value) }
        set sendAllToMarker(value: boolean) { this.setState(25, value) }
        set prayAtHead(value: boolean) { this.setState(26, value) }
        set boatPatrol(value: boolean) { this.setState(27, value) }
        set defendShamen(value: boolean) { this.setState(28, value) }
    }
}
