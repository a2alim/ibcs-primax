import { environment } from "environments/environment";

export class EffectImpactUrlConstant{
    public static BASE_ENDPOINT = environment.ibcs.ppsDppBackendPoint;
    public static EFFECT_IMPACT_BASE_ENDPOINT = EffectImpactUrlConstant.BASE_ENDPOINT + "project-details-partb";
    public static CREATE_EFFECT_IMPACT = EffectImpactUrlConstant.EFFECT_IMPACT_BASE_ENDPOINT + "/create-effect-impact"
    public static CREATE_EFFECT_IMPACT_ATTACHMENT = EffectImpactUrlConstant.EFFECT_IMPACT_BASE_ENDPOINT + "/add-effect-impact-attachment"
    public static GET_EFFECT_IMPACT = EffectImpactUrlConstant.EFFECT_IMPACT_BASE_ENDPOINT + "/getEffectImpact"
    public static DOWNLOAD_ATTACHMENT = EffectImpactUrlConstant.BASE_ENDPOINT;
    public static UPDATE_EFFECT_IMPACT = EffectImpactUrlConstant.EFFECT_IMPACT_BASE_ENDPOINT + "/update-effect-impact";
}
