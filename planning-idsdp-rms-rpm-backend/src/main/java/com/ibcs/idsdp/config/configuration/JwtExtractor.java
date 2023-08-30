package com.ibcs.idsdp.config.configuration;

import com.ibcs.idsdp.config.model.AccessTokenDetail;
import org.springframework.boot.autoconfigure.security.oauth2.resource.JwtAccessTokenConverterConfigurer;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.DefaultAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;

import java.util.Map;

@Configuration
public class JwtExtractor extends DefaultAccessTokenConverter implements JwtAccessTokenConverterConfigurer {
    @Override
    public void configure(JwtAccessTokenConverter jwtAccessTokenConverter) {
        jwtAccessTokenConverter.setAccessTokenConverter(this);
    }


    @Override
    public OAuth2Authentication extractAuthentication(Map<String, ?> map) {
        OAuth2Authentication auth = super.extractAuthentication(map);
        AccessTokenDetail details = new AccessTokenDetail();

        if (map.get("id") != null)
            details.setId((String) map.get("id"));

        if (map.get("userName") != null)
            details.setUserName((String) map.get("userName"));

        if (map.get("name") != null)
            details.setName((String) map.get("name"));

        if (map.get("userType") != null)
            details.setUserType((String) map.get("userType"));

        auth.setDetails(details);
        return auth;
    }
}
