package com.ibcs.idsdp;

import com.ibcs.idsdp.config.AttachmentStorageProperties;
import com.ibcs.idsdp.config.ImageStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.web.client.RestTemplate;

@EnableConfigurationProperties({
        ImageStorageProperties.class,
        AttachmentStorageProperties.class
})
@SpringBootApplication
@EnableAuthorizationServer
@EnableFeignClients
@Configuration
public class PlanningIdsdpUaaApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlanningIdsdpUaaApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
