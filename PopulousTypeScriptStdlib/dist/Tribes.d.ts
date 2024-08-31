import { AI } from "./AI";
import { Building } from "./Buildings";
import { Location } from "./Location";
import { Person, Shaman } from "./Persons";
import "./PopModules";
import { Spell } from "./Spells";
import { BuildingModel, PersonModel, SpellModel } from "./Things";
declare namespace TribeInternal {
    interface ElementPool<T extends Spell | Building | Person, M extends SpellModel | BuildingModel | PersonModel> {
        get(model: M): T;
        forEach(action: (this: void, elem: T) => void): void;
        forSome(models: (M | T)[], action: (this: void, elem: T) => void): void;
    }
    function makeElementPool<T extends Spell | Building | Person, M extends SpellModel | BuildingModel | PersonModel, P extends ElementPool<T, M>>(this: void, data: Record<string, T>): P;
    interface SpellOrBuildingPool<T extends Spell | Building, M extends SpellModel | BuildingModel> extends ElementPool<T, M> {
        enableAll(): void;
        enableSome(models: (M | T)[]): void;
        disableAll(): void;
        disableSome(models: (M | T)[]): void;
        markAsImposed(model: M | T): void;
    }
    function makeSpellOrBuildingPool<T extends Spell | Building, M extends SpellModel | BuildingModel, P extends SpellOrBuildingPool<T, M>>(this: void, data: Record<string, T>, imposed: T[]): P;
}
export declare class Tribe {
    static readonly Neutral: Tribe;
    static readonly Blue: Tribe;
    static readonly Red: Tribe;
    static readonly Yellow: Tribe;
    static readonly Green: Tribe;
    static readonly Cyan: Tribe;
    static readonly Pink: Tribe;
    static readonly Black: Tribe;
    static readonly Orange: Tribe;
    static readonly Hostbot: Tribe;
    static readonly ALL: readonly Tribe[];
    static readonly COUNT: number;
    readonly id: TribeID;
    readonly player: Player;
    readonly ai: AI;
    readonly spells: Tribe.Spells;
    readonly buildings: Tribe.Buildings;
    readonly persons: Tribe.Persons;
    readonly shaman: Shaman;
    private readonly _imposedSpells;
    private readonly _imposedBuildings;
    private constructor();
    static of(this: void, tribeID: TribeID): Tribe;
    static of(this: void, tribe: Tribe): Tribe;
    static of(this: void, tribe: TribeID | Tribe): Tribe;
    static asID(this: void, tribeID: TribeID): TribeID;
    static asID(this: void, tribe: Tribe): TribeID;
    static asID(this: void, tribe: TribeID | Tribe): TribeID;
    get name(): string;
    get mana(): number;
    set mana(value: number);
    giveMana(amount: number): void;
    takeMana(amount: number): void;
    get numPeople(): number;
    get numConvertedPeople(): number;
    get numGhostPeople(): number;
    get numBuildings(): number;
    get numPartialBuilding(): number;
    get numBoats(): number;
    get numBalloons(): number;
    get numTepeesInAnyLevel(): number;
    get reincSiteLocation(): Location;
    cameraRotation(angle: number): void;
    get isReincEnabled(): boolean;
    get reinc(): boolean;
    set reinc(value: boolean);
    get isInEncyc(): boolean;
    getKilledPeople(targetTribe: TribeID | Tribe): number;
    get deadCount(): number;
    transferTribeToAnotherPlayer(targetTribe: TribeID | Tribe): void;
    isAlly(otherTribe: TribeID | Tribe): boolean;
    isEnemy(otherTribe: TribeID | Tribe): boolean;
    setAlly(otherTribe: TribeID | Tribe, bidirectional?: boolean): void;
    setEnemy(otherTribe: TribeID | Tribe, bidirectional?: boolean): void;
    updateRemoveImposed(): void;
}
export declare namespace Tribe {
    interface Spells extends TribeInternal.SpellOrBuildingPool<Spell, SpellModel> {
        readonly burn: Spell;
        readonly blast: Spell;
        readonly lightningBolt: Spell;
        readonly tornado: Spell;
        readonly swarm: Spell;
        readonly invisibility: Spell;
        readonly hypnotism: Spell;
        readonly firestorm: Spell;
        readonly ghostArmy: Spell;
        readonly erosion: Spell;
        readonly swamp: Spell;
        readonly landBridge: Spell;
        readonly angelOfDeath: Spell;
        readonly earthquake: Spell;
        readonly flatten: Spell;
        readonly volcano: Spell;
        readonly conversion: Spell;
        readonly armageddon: Spell;
        readonly shield: Spell;
        readonly bloodlust: Spell;
        readonly teleport: Spell;
        readonly hill: Spell;
        readonly rise: Spell;
        readonly valley: Spell;
        readonly dip: Spell;
        readonly placeTree: Spell;
        readonly clearMapWho: Spell;
        readonly placeShaman: Spell;
        readonly placeWild: Spell;
    }
    interface Buildings extends TribeInternal.SpellOrBuildingPool<Building, BuildingModel> {
        readonly smallHut: Building;
        readonly hut: Building;
        readonly largeHut: Building;
        readonly drumTower: Building;
        readonly temple: Building;
        readonly spyTrain: Building;
        readonly warriorTrain: Building;
        readonly superWarriorTrain: Building;
        readonly reconversion: Building;
        readonly wallPiece: Building;
        readonly gate: Building;
        readonly currOeSlot: Building;
        readonly boatHut: Building;
        readonly alternativeBoatHut: Building;
        readonly airshipHut: Building;
        readonly alternativeAirshipHut: Building;
        readonly guardPost: Building;
        readonly library: Building;
        readonly prision: Building;
    }
    interface Persons extends TribeInternal.ElementPool<Person, PersonModel> {
        readonly wild: Person;
        readonly brave: Person;
        readonly warrior: Person;
        readonly preacher: Person;
        readonly spy: Person;
        readonly superWarrior: Person;
        readonly shaman: Shaman;
        readonly angelOfDeath: Person;
    }
}
export {};
