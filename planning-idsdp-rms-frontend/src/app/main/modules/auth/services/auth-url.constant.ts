import {BaseUrlConstant} from 'app/main/core/constants/base.url.constant';
import {environment} from 'environments/environment';


export class AuthUrlConstant {
    public static OAUTH_ENDPOINT = environment.ibcs.baseApiEndPoint + 'oauth/token';
    public static FORGET_PASSWORD_ENDPOINT = environment.ibcs.baseApiEndPoint + BaseUrlConstant.PRIVATE_API_ENDPOINT + '/auth/forget-password';
}
