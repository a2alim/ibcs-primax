package com.ibcs.idsdp.common.services;

import com.ibcs.idsdp.config.model.AccessTokenDetail;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;

/**
 * @author moniruzzaman.rony
 * @create 11/17/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Service
public class LoggedUsersService {

    public String getLoggedUserId() {
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        return accessTokenDetail.getId();
    }

    public String getLoggedUserType() {
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        return accessTokenDetail.getUserType();
    }

    public String getLoggedUserEmail() {
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        return accessTokenDetail.getUserName();
    }

    public String getLoggedUserName() {
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        return accessTokenDetail.getUserName();
    }

    public String getLoggedFullName() {
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        return accessTokenDetail.getName();
    }
}
