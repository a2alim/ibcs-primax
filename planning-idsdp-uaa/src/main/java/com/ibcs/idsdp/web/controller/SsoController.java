package com.ibcs.idsdp.web.controller;

import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.client.SsoLoginService;
import com.ibcs.idsdp.config.SsoConfig;
import com.ibcs.idsdp.constants.SsoConstants;
import com.ibcs.idsdp.exceptions.UserNotFoundException;
import com.ibcs.idsdp.model.domain.ExtractData;
import com.ibcs.idsdp.model.domain.OfficeInfo;
import com.ibcs.idsdp.model.domain.UserData;
import com.ibcs.idsdp.web.dto.SsoUser;
import com.ibcs.idsdp.web.dto.request.SsoRequest;
import com.ibcs.idsdp.web.dto.response.SsoTokenResponse;
import com.ibcs.idsdp.web.dto.response.SsoUserResponse;
import feign.FeignException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;

@Slf4j
@AllArgsConstructor
@ApiController
public class SsoController {

    SsoLoginService ssoLoginService;
    SsoConfig ssoConfig;

    @PostMapping(SsoConstants.SSO_END_POINTS)
    public ResponseEntity<?> ssoLogin(@RequestBody SsoRequest ssoRequest, HttpServletRequest request) throws Exception {
        System.out.println("uaa");
        ResponseEntity<SsoUserResponse> ssoUserResponse = null;
        try {
            ssoUserResponse = ssoLoginService.ssoLogin(ssoRequest);
            System.out.println(ssoUserResponse);
        } catch (FeignException.FeignClientException ex) {
            if (ex.status() == 404)
                throw new UserNotFoundException("User Not Found");
            else
                throw new Exception("Unexpected error occurred in communicating with ek-sheba");
        }


        log.info("Signed In with doptor.");
        SsoUser ssoUser = new SsoUser(ssoRequest.getUserId(), ssoRequest.getPassword(), Arrays.asList());
        ssoUser.setUserData(ssoUserResponse.getBody().getData());
        String token = ssoConfig.generateToken(ssoUser, ssoUser);
        SsoTokenResponse ssoTokenResponse = new SsoTokenResponse();
        ssoTokenResponse.setAccess_token(token);
        ssoTokenResponse.setUser(ssoUserResponse.getBody().getData().getUser());
        System.out.println("sso = "+ssoTokenResponse);
        return new ResponseEntity(ssoTokenResponse, HttpStatus.OK);
    }

    @GetMapping("/api/token-extract")
    public ExtractData extractToken(@RequestHeader("token") String token){
        String userName=null;
        ExtractData extractedUserData =ssoConfig.getSsoUser(token);
        return extractedUserData;
    }


}
