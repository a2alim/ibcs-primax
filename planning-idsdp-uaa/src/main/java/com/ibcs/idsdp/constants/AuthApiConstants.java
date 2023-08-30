package com.ibcs.idsdp.constants;

public interface AuthApiConstants extends ApiConstants {

    String AUTH_ENDPOINT = PRIVATE_API_ENDPOINT + "/auth";
    String EMAIL_ID = "email";
    String EMAIL_ID_VAR = "/{" + EMAIL_ID + "}";
    String PASSWORD = "password";
    String PASSWORD_VAR = "/{" + PASSWORD + "}";

    String FORGET_PASSWORD_ENDPOINT = AUTH_ENDPOINT + "/forget-password";
    String RESET_PASSWORD_ENDPOINT = AUTH_ENDPOINT + "/reset-password";

}
