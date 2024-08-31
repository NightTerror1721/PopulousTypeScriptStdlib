import { Time } from "../GameTime";
import { ScriptComponent } from "../Level";
import "../PopModules";
import { Tribe } from "../Tribes";
export declare abstract class BaseEnvironmentControllerScriptComponent<S extends object> extends ScriptComponent {
    protected constructor(name: string);
    protected get state(): S;
    protected set state(value: S);
    protected abstract update(deltaTime: Time): void;
    onInit(): void;
    onFirstTurn(deltaTime: Time): void;
    onTurn(deltaTime: Time): void;
}
export declare abstract class BaseControllerScriptComponent<S extends object> extends BaseEnvironmentControllerScriptComponent<S> {
    protected readonly _tribe: Tribe;
    protected constructor(name: string, tribe: Tribe);
}
