package com.ibcs.idsdp;

import com.ibcs.idsdp.common.config.AttachmentStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@EnableConfigurationProperties({
		AttachmentStorageProperties.class
})
@SpringBootApplication
@EnableResourceServer
@Configuration
@EnableFeignClients
public class PlanningIdsdpRmsRpmBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(PlanningIdsdpRmsRpmBackendApplication.class, args);
	}

	@Bean
	public RestTemplate restTemplate(RestTemplateBuilder restTemplateBuilder) {

		return restTemplateBuilder
				.setConnectTimeout(Duration.ofSeconds(500))
				.setReadTimeout(Duration.ofSeconds(500))
				.build();
	}
}
