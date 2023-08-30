package com.ibcs.idsdp.constants;

public interface DoptorUserApiConstants extends ApiConstants {

    String DOPTOR_USERS_ENDPOINT = PRIVATE_API_ENDPOINT + "/doptor-users";
    String CHANGE_DOPTOR_USER_STATUS = DOPTOR_USERS_ENDPOINT + "/changeStatus";
    String DOPTOR_USER_BY_STATUS = DOPTOR_USERS_ENDPOINT + "/filterByStatus";
}
