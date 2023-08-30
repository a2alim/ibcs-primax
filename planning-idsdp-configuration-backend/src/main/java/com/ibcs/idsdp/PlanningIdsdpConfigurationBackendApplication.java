package com.ibcs.idsdp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;

@EnableResourceServer
@EnableFeignClients
@Configuration
@SpringBootApplication
public class PlanningIdsdpConfigurationBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlanningIdsdpConfigurationBackendApplication.class, args);
	}

}
