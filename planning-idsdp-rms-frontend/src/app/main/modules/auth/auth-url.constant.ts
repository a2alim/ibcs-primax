import {environment} from '../../../../environments/environment';
import {BaseUrlConstant} from '../../core/constants/base.url.constant';

export class AuthUrlConstant {
    public static OAUTH_ENDPOINT = environment.ibcs.baseApiEndPoint + 'oauth/token';
    public static AUTH_ENDPOINT = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/auth';
    public static FORGET_PASSWORD_ENDPOINT = AuthUrlConstant.AUTH_ENDPOINT + '/forget-password';
    public static PERMISSION_ENDPOINT = environment.ibcs.baseApiEndPoint + BaseUrlConstant.PRIVATE_API_ENDPOINT + '/permissions';
    public static PERMISSION_ENDPOINTBYID = environment.ibcs.baseApiEndPoint + BaseUrlConstant.PRIVATE_API_ENDPOINT + '/permission/';
    public static PERMISSIONS_WITH_APIS_ENDPOINT = environment.ibcs.baseApiEndPoint + BaseUrlConstant.PRIVATE_API_ENDPOINT + '/permission-with-apis/';
    public static PERMISSIONS_PAGEABLE = environment.ibcs.baseApiEndPoint + BaseUrlConstant.PRIVATE_API_ENDPOINT + '/permissionPageable';

}
