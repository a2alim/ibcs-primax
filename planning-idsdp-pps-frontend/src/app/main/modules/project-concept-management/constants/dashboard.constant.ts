import {BaseUrlConstant} from '../../../core/constants/base.url.constant';

export class DashboardConstant {
    public static ROLE_ENDPOINT = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/roles';
    public static USER_ENDPOINT = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/users';
    public static USER_ROLE_ENDPOINT = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/user-role';
    public static USER_VERIFY_ENDPOINT = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/users/verify';
    public static USERS_BY_USER_ID_ENDPOINT = DashboardConstant.USER_ENDPOINT + '/userid';
    public static UPDATE_USER_TFA_ENABLE_ENDPOINT = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/users/2fa/update';
    public static USERID_AND_TFA_ENABLED_ENDPOINT = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/users/2fa/all';
    public static UPDATE_PROFILE = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/updateProfile';
    public static GET_USER_PROFILE_INFO = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/getUserProfileInfo';

}
