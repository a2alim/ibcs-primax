package com.ibcs.idsdp.constants;

public interface NothiUserApiConstants extends ApiConstants {

    String NOTHI_USERS_ENDPOINT = PRIVATE_API_ENDPOINT + "/nothi-users";
    String CHANGE_NOTHI_USER_STATUS = NOTHI_USERS_ENDPOINT + "/changeStatus";
    String NOTHI_USER_BY_STATUS = NOTHI_USERS_ENDPOINT + "/filterByStatus";
    String CREATE_NOTHI_USER = NOTHI_USERS_ENDPOINT + "/create";
    String NOTHI_USER_ENDPOINT_BY_NOTHI_ID = PRIVATE_API_ENDPOINT + "/nothi-user-by-nothiId";
}
