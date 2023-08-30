package com.ibcs.idsdp.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;

@Configuration
public class ResourceServerConfiguration extends ResourceServerConfigurerAdapter {
    @Override
    public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
        super.configure(resources);
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.anonymous()
                .and()
                .authorizeRequests()
                .antMatchers("/rms-rpm/api/view-research-public/**").permitAll()
                .antMatchers("/rms-rpm/api/presentation-evaluators-feedback/**").permitAll()
                .antMatchers("/rms-rpm/api/eligibility-checker/**").permitAll()
                .antMatchers("/rms-rpm/api/mail-service/send-mail/**").permitAll()
                .antMatchers("/rms-rpm/api/sms/send/**").permitAll()
                .antMatchers("/rms-rpm/**").authenticated();
    }
}
