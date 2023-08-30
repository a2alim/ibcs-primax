import { BaseUrlConstant } from "app/main/core/constants/base.url.constant";
import { environment, gateWayBaseEndPoint } from "environments/environment";


export class AuthUrlConstant {
    public static OAUTH_ENDPOINT = gateWayBaseEndPoint + 'oauth/token';
    public static FORGET_PASSWORD_ENDPOINT = environment.ibcs.authServerBackendEndpoint + "/auth/forget-password";
}
