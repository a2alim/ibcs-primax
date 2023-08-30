import { BaseUrlConstant } from "app/main/core/constants/base.url.constant";


export class AccessControlUrlConstant {
    public static ROLE_ENDPOINT = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/roles';
    public static ROLE_PAGEABLE_ENDPOINT = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/rolesPageable';
    public static USER_ENDPOINT = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/users';
    public static USER_ROLE_ENDPOINT = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/user-role';
    public static USER_VERIFY_ENDPOINT = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/users/verify';
    public static USERS_BY_USER_ID_ENDPOINT = AccessControlUrlConstant.USER_ENDPOINT + '/userId';
    public static CHANGE_USER_STATUS = AccessControlUrlConstant.USER_ENDPOINT + '/changeStatus';
    public static UPDATE_USER_TFA_ENABLE_ENDPOINT = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/users/2fa/update';
    public static USERID_AND_TFA_ENABLED_ENDPOINT = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/users/2fa/all';
    public static UPDATE_PROFILE = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/updateProfile';
    public static GET_USER_PROFILE_INFO = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/getUserProfileInfo';
    public static UPLOAD_IMAGE = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/uploadImage';
    public static CHANGE_PASSWORD = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/changePassword';
    public static APPLY_FILTER = '/applyFilter';

    public static DOPTOR_USER_LIST_ENDPOINT = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/doptor-users';
    public static CHANGE_DOPTOR_USER_STATUS = AccessControlUrlConstant.DOPTOR_USER_LIST_ENDPOINT + '/changeStatus';
    public static DOPTOR_USER_BY_STATUS = AccessControlUrlConstant.DOPTOR_USER_LIST_ENDPOINT + '/filterByStatus';

    public static NOTHI_USER_LIST_ENDPOINT = BaseUrlConstant.PRIVATE_API_ENDPOINT + '/nothi-users';
    public static CHANGE_NOTHI_USER_STATUS = AccessControlUrlConstant.NOTHI_USER_LIST_ENDPOINT + '/changeStatus';
    public static NOTHI_USER_BY_STATUS = AccessControlUrlConstant.NOTHI_USER_LIST_ENDPOINT + '/filterByStatus';
    public static CREATE_NOTHI_USER = AccessControlUrlConstant.NOTHI_USER_LIST_ENDPOINT + '/create';
}
