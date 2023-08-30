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
                .antMatchers("/rms-configuration/api/expert-evaluator/**").permitAll()
                .antMatchers("/rms-configuration/api/research-category-type/**").permitAll()
                .antMatchers("/rms-configuration/api/profile-marks-setup/find-by-St-research-cat-type-id/**").permitAll()
                .antMatchers("/rms-configuration/api/research-guide-line/**").permitAll()
                .antMatchers("/rms-configuration/public/**").permitAll()
                .antMatchers("/rms-configuration/**").authenticated();
    }
}
