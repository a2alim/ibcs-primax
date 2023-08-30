package com.ibcs.idsdp.projectconcept.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Component;

@Component
public class FeignClientInterceptor implements RequestInterceptor {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String TOKEN_TYPE = "bearer";

    @Override
    public void apply(RequestTemplate requestTemplate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication!=null && authentication.getDetails() instanceof OAuth2AuthenticationDetails){
            OAuth2AuthenticationDetails oAuth2AuthenticationDetails = (OAuth2AuthenticationDetails) authentication.getDetails();
            String token = TOKEN_TYPE + " " + oAuth2AuthenticationDetails.getTokenValue();
            requestTemplate.header(AUTHORIZATION_HEADER, token);
        }
    }
}
