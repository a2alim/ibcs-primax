import { BaseUrlConstant } from "app/main/core/constants/base.url.constant";
import { environment } from "environments/environment";

export class SharedUrlConstant{

    public static BASE_ENDPOINT = environment.ibcs.baseApiEndPoint +BaseUrlConstant.PRIVATE_API_ENDPOINT
    public static COMPONENT_ENDPOINT = SharedUrlConstant.BASE_ENDPOINT + '/components';
    public static MODULES_ENDPOINT = SharedUrlConstant.BASE_ENDPOINT + '/modules/';
    public static SUBMODULE_ENDPOINT = SharedUrlConstant.BASE_ENDPOINT + '/sub-modules/';    
}