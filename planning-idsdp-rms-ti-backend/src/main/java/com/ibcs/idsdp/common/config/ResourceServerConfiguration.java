package com.ibcs.idsdp.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;

/**
 * @author moniruzzaman.rony
 * @create 11/17/21
 * @github `https://github.com/moniruzzamanrony`
 */
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
                .antMatchers("/rms-ti/v2/api-docs").permitAll()
                .antMatchers("/rms-ti/public/participants/**").permitAll()
                .antMatchers("/rms-ti/configuration/ui").permitAll()
                .antMatchers("/rms-ti/swagger-resources/**").permitAll()
                .antMatchers("/rms-ti/configuration/security").permitAll()
                .antMatchers("/rms-ti/swagger-ui.html").permitAll()
                .antMatchers("/rms-ti/webjars/**").permitAll()
                .antMatchers("/rms-ti/**").authenticated();
    }

}
