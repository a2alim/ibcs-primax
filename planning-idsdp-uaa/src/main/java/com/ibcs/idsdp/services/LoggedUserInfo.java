package com.ibcs.idsdp.services;

import com.google.gson.Gson;
import com.ibcs.idsdp.web.dto.request.LoggedUserDto;
import org.apache.commons.codec.binary.Base64;
import org.springframework.stereotype.Service;

/**
 *
 * For finding logged user info
 */
@Service
public class LoggedUserInfo {
    public static LoggedUserDto decodeJWTBody(String jwtToken) {
        String[] splitToken = jwtToken.split("\\.");
        String encodedBody= splitToken[1];
        Base64 base64Url = new Base64(true);
        String body = new String(base64Url.decode(encodedBody));
        Gson g = new Gson();
        LoggedUserDto loggedUserDto = g.fromJson(body, LoggedUserDto.class);
        return loggedUserDto;
    }
}
