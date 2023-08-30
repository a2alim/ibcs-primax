import {BaseUrlConstant} from 'app/main/core/constants/base.url.constant';
import {environment} from 'environments/environment';


export class AuthUrlConstant {
    public static OAUTH_ENDPOINT = environment.ibcs.baseApiEndPoint + 'oauth/token';
    public static FORGET_PASSWORD_ENDPOINT = environment.ibcs.baseApiEndPoint + BaseUrlConstant.PRIVATE_API_ENDPOINT + 'auth/forget-password';
    public static RESET_PASSWORD_ENDPOINT = environment.ibcs.baseApiEndPoint + BaseUrlConstant.PRIVATE_API_ENDPOINT + 'auth/reset-password';
    public static OAUTH_SSO_ENDPOINT = environment.ibcs.baseApiEndPoint + BaseUrlConstant.PRIVATE_API_ENDPOINT + 'sso';
    public static UAA_USER_BY_USERID_AND_USERTYPE = environment.ibcs.baseApiEndPoint + BaseUrlConstant.PRIVATE_API_ENDPOINT + 'users/userByUserIdAndUserType';
}
