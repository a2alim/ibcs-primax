package com.ibcs.idsdp;

import com.ibcs.idsdp.common.config.AttachmentStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;


@EnableConfigurationProperties({
		AttachmentStorageProperties.class
})
@EnableResourceServer
@SpringBootApplication
@Configuration
@EnableFeignClients
public class PlanningIdsdpPpsPcBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlanningIdsdpPpsPcBackendApplication.class, args);
	}

}
