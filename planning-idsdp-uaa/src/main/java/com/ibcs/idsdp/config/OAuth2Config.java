package com.ibcs.idsdp.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class OAuth2Config extends AuthorizationServerConfigurerAdapter {

    @Autowired
    PasswordEncoder passwordEncoder;
    @Value("${config.oauth2.clientid}")
    private String clientid;
    @Value("${config.oauth2.clientSecret}")
    private String clientSecret;
    @Value("${config.oauth2.privateKey}")
    private String privateKey;
    @Value("${config.oauth2.publicKey}")
    private String publicKey;
    @Autowired
    @Qualifier("authenticationManagerBean")
    private AuthenticationManager authenticationManager;

    // For Create urlCORS
    @Override
    public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {
        security.tokenKeyAccess("permitAll()").checkTokenAccess("permitAll()");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        /*CorsConfiguration config = new CorsConfiguration();
        config.applyPermitDefaultValues();
        source.registerCorsConfiguration("/oauth/token", config);
        CorsFilter filter = new CorsFilter(source);
        security.addTokenEndpointAuthenticationFilter(filter);*/
    }

    // For Create token time
    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.inMemory().withClient(clientid).secret(passwordEncoder.encode(clientSecret)).scopes("read", "write")
                .authorizedGrantTypes("password", "refresh_token").accessTokenValiditySeconds(3600000)
                .refreshTokenValiditySeconds(18000);
    }

    // For Store
    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        endpoints.authenticationManager(authenticationManager).tokenStore(tokenStore())
                .accessTokenConverter(tokenEnhancer());
    }

    @Bean
    public JwtTokenStore tokenStore() {
        return new JwtTokenStore(tokenEnhancer());
    }

    @Bean
    public JwtAccessTokenConverter tokenEnhancer() {
        JwtAccessTokenConverter converter = new CustomTokenEnhancer();
        converter.setSigningKey(privateKey);
        converter.setVerifierKey(publicKey);
        return converter;
    }
    // For Store Token
}
