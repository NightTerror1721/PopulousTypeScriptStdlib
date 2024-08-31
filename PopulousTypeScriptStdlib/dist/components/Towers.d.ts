import { Time } from "../GameTime";
import { Location } from "../Location";
import "../PopModules";
import { PersonModel } from "../Things";
import { Tribe } from "../Tribes";
import { BaseControllerScriptComponent } from "./Common";
interface DrumTowerControllerState {
    buildIdx: number;
    populateIdx: number;
    buildCheckRemainingSeconds: number;
    populateCheckRemainingSeconds: number;
    lastUpdateSeconds: number;
}
export declare class DrumTowerController extends BaseControllerScriptComponent<DrumTowerControllerState> {
    private readonly _entries;
    private _buildCheckPeriod;
    private _populateCheckPeriod;
    private _buildsPerTime;
    private _populationsPerTime;
    constructor(tribe: Tribe);
    get buildCheckPeriod(): typeof this._buildCheckPeriod;
    set buildCheckPeriod(value: typeof this._buildCheckPeriod);
    get populateCheckPeriod(): typeof this._populateCheckPeriod;
    set populateCheckPeriod(value: typeof this._populateCheckPeriod);
    get buildsPerTime(): typeof this._buildsPerTime;
    set buildsPerTime(value: typeof this._buildsPerTime);
    get populationsPerTime(): typeof this._populationsPerTime;
    set populationsPerTime(value: typeof this._populationsPerTime);
    registerEntry(x: number, z: number, checkRadius?: number, person?: PersonModel | PersonModel[], condition?: (this: void) => void): void;
    registerEntry(location: Location, checkRadius?: number, person?: PersonModel | PersonModel[], condition?: (this: void) => void): void;
    protected update(deltaTime: Time): void;
    private updateBuilds;
    private updatePopulations;
    private static selectPerson;
}
export declare namespace DrumTowerUtils {
    function findDrumTowerAtLocation(tribe: Tribe, x: number, z: number, radius: number): Thing | undefined;
    function findDrumTowerAtLocation(tribe: Tribe, location: Location, radius: number): Thing | undefined;
    function populateDrumTower(tribe: Tribe, model: PersonModel, x: number, z: number, radius: number): boolean;
    function populateDrumTower(tribe: Tribe, model: PersonModel, location: Location, radius: number): boolean;
    function existsDrumTowerBuildOrShapeAtLocation(tribe: Tribe, x: number, z: number, radius: number): boolean;
    function existsDrumTowerBuildOrShapeAtLocation(tribe: Tribe, location: Location, radius: number): boolean;
    function buildDrumTowerIfNotExists(tribe: Tribe, x: number, z: number, checkRadius?: number): void;
    function buildDrumTowerIfNotExists(tribe: Tribe, location: Location, checkRadius?: number): void;
}
export {};
