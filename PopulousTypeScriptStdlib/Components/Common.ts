import { Time } from "../GameTime";
import { ScriptComponent } from "../Level";
import "../PopModules"
import { Tribe } from "../Tribes";

export abstract class BaseEnvironmentControllerScriptComponent<S extends object> extends ScriptComponent
{
    protected constructor(name: string)
    {
        super(name)
    }

    protected get state(): S { return this.localData as any }
    protected set state(value: S) { Object.assign(this.localData, value) }

    protected abstract update(deltaTime: Time): void

    public override onInit(): void {}
    public override onFirstTurn(deltaTime: Time): void { this.update(deltaTime) }
    public override onTurn(deltaTime: Time): void { this.update(deltaTime) }
}

export abstract class BaseControllerScriptComponent<S extends object> extends BaseEnvironmentControllerScriptComponent<S>
{
    protected readonly _tribe: Tribe

    protected constructor(name: string, tribe: Tribe)
    {
        super(name)
        this._tribe = tribe
    }
}
