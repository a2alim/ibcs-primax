package com.ibcs.idsdp.constants;

public interface UserApiConstants extends ApiConstants {

    String USERS_ENDPOINT = PRIVATE_API_ENDPOINT + "/users";
    String RMS_RESEARCHER_USERS_ENDPOINT = PRIVATE_API_ENDPOINT + "/rms-researcher-users";
    String RMS_EVALUATOR_USERS_ENDPOINT = PRIVATE_API_ENDPOINT + "/rms-evaluator-users";
    String RMS_TI_USERS_ENDPOINT = PRIVATE_API_ENDPOINT + "/rms-ti-users";

    String USER_PAGEABLE_ENDPOINT = PRIVATE_API_ENDPOINT + "/usersPageable";

    String SEARCH_USER_ENDPOINT = PRIVATE_API_ENDPOINT + "/searchUser";
    String USERS_VERIFY_ENDPOINT = PRIVATE_API_ENDPOINT + "/users/verify";
    String ALL_USER_ID_WITH_TFA_ENABLED_OR_NOT_ENDPOINT = USERS_ENDPOINT + "/2fa/all";
    String UPDATE_TFA_ENABLED = USERS_ENDPOINT + "/2fa/update";
    String USERS_BY_USER_ID_ENDPOINT = USERS_ENDPOINT + "/userId";
    String CHANGE_USER_STATUS = USERS_ENDPOINT + "/changeStatus";
    String UAA_USER_BY_USERID_AND_USERTYPE = USERS_ENDPOINT + "/userByUserIdAndUserType";
    String USERS_BY_USERSGROUP_ENDPOINT = USERS_ENDPOINT + "/usergroup";
    String USERS_ALL_ENDPOINT = PRIVATE_API_ENDPOINT + "/users/all";
    String USERS_ALL_ENDPOINT_USERTYPE = PRIVATE_API_ENDPOINT + "/users/userType/{type}";

    String USERS_ALL_ENDPOINT_DUTYTYPE = PRIVATE_API_ENDPOINT + "/users/duty-type/{type}";
    String USERS_BY_ID_SET_ENDPOINT = USERS_ENDPOINT + "/usersByIdSet";
    String USERS_BY_EMAIL_ENDPOINT=USERS_ENDPOINT +"/find-by-email/{emailId}";


}
