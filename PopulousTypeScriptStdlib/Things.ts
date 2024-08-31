/** @noSelfInFile */

import "./PopModules"
import { Location } from "./Location";

export const enum ThingType
{
    None = 0,
    Person = 1,
    Building = 2,
    Creature = 3,
    Vehicle = 4,
    Scenery = 5,
    General = 6,
    Effect = 7,
    Shot = 8,
    Shape = 9,
    Internal = 10,
    Spell = 11,

    __COUNT = 11
}

export const enum BuildingModel
{
    None = 0,
    Tepee = 1, SmallHut = 1,
    Tepee2 = 2, Hut = 2, MediumHut = 2,
    Tepee3 = 3, Farm = 3, LargeHut = 3,
    DrumTower = 4,
    Temple = 5,
    SpyTrain = 6,
    WarriorTrain = 7,
    SuperTrain = 8, SuperWarriorTrain = 8, FireWarriorTrain = 8,
    Reconversion = 9,
    WallPiece = 10,
    Gate = 11,
    CurrOeSlot = 12,
    BoatHut1 = 13, BoatHut = 13,
    BoatHut2 = 14,
    AirshipHut1 = 15, AirshipHut = 15,
    AirshipHut2 = 16,
    GuardPost = 17,
    Library = 18,
    Prision = 19,

    __COUNT = 19
}

export const enum BuildingState
{
    UnderConstruction = 1,
    Stand = 2,
    Dying = 3,
    OnFire = 4,
    LibrarySink = 5,
    ControledRaise = 6
}


export const enum CreatureModel
{
    Bear = 1,
    Buffalo = 2,
    Wolf = 3,
    Eagle = 4,
    Rabbit = 5,
    Beaver = 6,
    Fish = 7,

    __COUNT = 7
}


export const enum EffectModel
{
    SimpleBlast = 1,
    SpriteCircles = 2,
    Smoke = 3,
    LightningElem = 4,
    BurnCellObstacles = 5,
    FlattenLand = 6,
    MoveRSPillar = 7,
    PrepareRSLand = 8,
    SphereExplode1 = 9,
    Fireball = 10,
    Firecloud = 11,
    GhostArmy = 12,
    Invisibility = 13,
    ExplodeBuildingPartial = 14,
    Volcano = 15,
    Hypnotism = 16,
    LightningBolt = 17,
    Swamp = 18,
    AngelOfDead = 19,
    Whirlwind = 20,
    InsectPlague = 21,
    Firestorm = 22,
    Erosion = 23,
    LandBridge = 24,
    WrathOfGod = 25,
    Earthquake = 26,
    FlyThingummy = 27,
    SphereExplodeAndFire = 28,
    BigFire = 29,
    Lightning = 30,
    Flatten = 31,
    General = 32,
    ShapeSparkle = 33,
    LavaFlow = 34,
    VolcanoExplosions = 35,
    PurifyLand = 36,
    UnpurifyLand = 37,
    Explosion1 = 38,
    Explosion2 = 39,
    LavaSquare = 40,
    WWElement = 41,
    LightningStrand = 42,
    WWDust = 43,
    RaiseLand = 44,
    LowerLand = 45,
    Hill = 46,
    Valley = 47,
    PlaceTree = 48,
    Rise = 49,
    Dip = 50,
    ReinRockDebris = 51,
    ClearMapwho = 52,
    PlaceShaman = 53,
    PlaceWild = 54,
    BuildingSmoke = 55,
    MuchSimplerBlast = 56,
    TumblingBranch = 57,
    ConversionFlash = 58,
    HypnosisFlash = 59,
    Sparkle = 60,
    SmallSparkle = 61,
    Explosion3 = 62,
    RockExplosion = 63,
    LavaGloop = 64,
    Splash = 65,
    SmokeCloud = 66,
    SmokeCloudConstant = 67,
    Fireball2 = 68,
    GroundShockwave = 69,
    Orbiter = 70,
    BigSparkle = 71,
    Meteor = 72,
    ConvertWild = 73,
    BuildingSmoke2Full = 74,
    BuildingSmoke2Partial = 75,
    BuildingDamagedSmoke = 76,
    DeleteRSPillars = 77,
    SpellBlast = 78,
    FirestormSmoke = 79,
    PlayerDead = 80,
    RevealFogArea = 81,
    Shield = 82,
    BoatHutRepair = 83,
    ReedyGrass = 84,
    SwampMist = 85,
    Armageddon = 86,
    Bloodlust = 87,
    Teleport = 88,
    AtlantisSet = 89,
    AtlantisInvoke = 90,
    StatueToAOD = 91,
    FillOneShots = 92,
    FireRollElem = 93,
    ArmaArena = 94,

    __COUNT = 95
}


export const enum PersonModel
{
    None = 0,
    Wild = 1,
    Brave = 2,
    Warrior = 3,
    Religious = 4, Preacher = 4,
    Spy = 5,
    SuperWarrior = 6, FireWarrior = 6,
    MedicineMan = 7, Shaman = 7,
    Angel = 8, AngelOfDeath = 8,

    __COUNT = 8
}

export const enum PersonState
{
    None = 0,
    StandForTime = 1,
    Drowning = 2,
    Dying = 3,
    Wander = 4,
    GotoAndEat = 5,
    GotoAndDrink = 6,
    GotoDebugPoint = 7,
    WildRoam = 8,
    Summoned = 9,
    UnderCommand = 10,
    Selected = 11,
    ReselectWait = 12,
    BaseWander = 13,
    AwaitingCommand = 14,
    WildEat = 15,
    WildDrink = 16,
    GotoBaseAndWait = 17,
    GotoPoint = 18,
    WaitAtPoint = 19,
    Spare = 20,
    WaitAtBuilding = 21,
    SpellTrance = 22,
    BeingPreached = 23,
    InWhirlwind = 24,
    FightPerson2 = 25,
    RunAway = 26,
    SwampDrowning = 27,
    AngelRoam = 28,
    PreFightPerson2 = 29,
    WaitInVehicle = 30,
    OnFire = 31,
    WildRepopulate = 32,
    NavigationFailed = 33,
    WildStareAtThing = 34,
    SurprisedByPlayer = 35,
    SuperReturnFire = 36,
    WaitFirstAppear = 37,
    GotoSpellCastPoint = 38,
    ArmageddonAttackReady = 39,
    AOD2Victim = 40,
    VictoryDance = 41,
    ShamanInPrision = 42,
    Scatter = 43,
    Electrocuted = 44,

    __COUNT = 45
}


export const enum SceneryModel
{
    Tree1 = 1,
    Tree2 = 2,
    Tree3 = 3,
    Tree4 = 4,
    Tree5 = 5,
    Tree6 = 6,
    Plant1 = 7,
    Plant2 = 8,
    Head = 9,
    Fire = 10,
    WoodPile = 11,
    RSPillar = 12,
    Rock = 13,
    Portal = 14,
    Island = 15,
    Bridge = 16,
    DormantTree = 17,
    TopLevelScenery = 18,
    SubLevelScenery = 19,

    __COUNT = 19
}

export const enum SceneryState
{
    Stand = 1,
    Sink = 2,
    Fire = 3,
    WoodPile = 4,
    OnFire = 5,
    RSPillar = 6,
    Rolling = 7,
    DoNothing = 8,
    DormantTree = 9,
    Grounded = 10,
    HeadRaise = 11,
    HeadLower = 12,
    ControlledRaise = 13
}


export const enum SpellModel
{
    None = 0,
    Burn = 1,
    Blast = 2,
    LightningBolt = 3,
    Whirlwind = 4, Tornado = 4,
    InsectPlage = 5, Swarm = 5,
    Invisibility = 6,
    Hypnotism = 7,
    Firestorm = 8,
    GhostArmy = 9,
    Erosion = 10,
    Swamp = 11,
    LandBridge = 12,
    AngelOfDeath = 13,
    Earthquake = 14,
    Flatten = 15,
    Volcano = 16,
    ConvertWild = 17, Conversion = 17,
    Armageddon = 18,
    Shield = 19,
    Bloodlust = 20,
    Teleport = 21,

    LandscapeSpellNone = 22,
    Hill = 23,
    Rise = 24,
    Valley = 25,
    Dip = 26,
    PlaceTree = 27,
    ClearMapWho = 28,
    PlaceShaman = 29,
    PlaceWild = 30,

    NORMALS_COUNT = 21,
    NUM_LANDSCAPE = 30,
    __COUNT = 32
}


export const enum GeneralModel
{
    Light = 1,
    Discovery = 2,
    DebugStatic = 3,
    DebugFlying = 4,
    DebugFlag = 5,
    Trigger = 6,
    VehicleConstruction = 7,
    MapwhoThing = 8,
    BuildingAddOn = 9,
    DiscoveryMarker = 10,

    __COUNT = 10
}


export const enum ShotModel
{
    Standard = 1,
    Standard2 = 2,
    Standard3 = 3,
    Fireball = 4,
    Lightning = 5,
    SuperWarrior = 6,
    VolcanoFireball1 = 7,
    VolcanoFireball2 = 8,

    __COUNT = 8
}


export const enum ShapeModel
{
    General = 1,

    __COUNT = 1
}


export const enum InternalModel
{
    Formation = 1,
    Beacon = 2,
    ThingInfoDisplay = 3,
    SoulConverter = 4,
    SoulMan = 5,
    MedManAttract = 6,
    ObjFace = 7,
    Fight = 8,
    PreFight = 9,
    GuardControl = 10,
    BridgeControl = 11,
    SoulConverter2 = 12,
    DTBeacon = 13,
    PlayerRaise = 14,
    PlayerLower = 15,
    GuardPostDisplay = 16,
    PlayerSmooth = 17,
    WoodDisturb = 18,
    SinkingBuilding = 19,

    __COUNT = 19
}


export const enum VehicleModel
{
    Boat1 = 1, Boat = 1,
    Boat2 = 2,
    Airship1 = 3, Airship = 3,
    Airship2 = 4,

    __COUNT = 4
}


export function createBuilding(model: BuildingModel, owner: TribeID, location: Location)
{
    return createThing(ThingType.Building, model, owner, location.coord3D, false, false)
}

export function createCreature(model: CreatureModel, owner: TribeID, location: Location)
{
    return createThing(ThingType.Creature, model, owner, location.coord3D, false, false)
}

export function createEffect(model: EffectModel, owner: TribeID, location: Location)
{
    return createThing(ThingType.Effect, model, owner, location.coord3D, false, false)
}

export function createPerson(model: PersonModel, owner: TribeID, location: Location)
{
    return createThing(ThingType.Person, model, owner, location.coord3D, false, false)
}

export function createScenery(model: SceneryModel, owner: TribeID, location: Location)
{
    return createThing(ThingType.Scenery, model, owner, location.coord3D, false, false)
}

export function createSpell(model: SpellModel, owner: TribeID, location: Location)
{
    return createThing(ThingType.Spell, model, owner, location.coord3D, false, false)
}

export function createGeneral(model: GeneralModel, owner: TribeID, location: Location)
{
    return createThing(ThingType.General, model, owner, location.coord3D, false, false)
}

export function createShot(model: ShotModel, owner: TribeID, location: Location)
{
    return createThing(ThingType.Shot, model, owner, location.coord3D, false, false)
}

export function createShape(model: ShapeModel, owner: TribeID, location: Location)
{
    return createThing(ThingType.Shape, model, owner, location.coord3D, false, false)
}

export function createInternal(model: InternalModel, owner: TribeID, location: Location)
{
    return createThing(ThingType.Internal, model, owner, location.coord3D, false, false)
}

export function createVehicle(model: VehicleModel, owner: TribeID, location: Location)
{
    return createThing(ThingType.Vehicle, model, owner, location.coord3D, false, false)
}
