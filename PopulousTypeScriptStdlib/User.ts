import "./PopModules"


export namespace User
{
    export function setUserInputsEnabled(enabled: boolean): void
    {
        if(enabled) ENABLE_USER_INPUTS()
        else DISABLE_USER_INPUTS()
    }
}
