package com.ibcs.idsdp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@EnableEurekaClient
@SpringBootApplication
public class PlanningIdsdpGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlanningIdsdpGatewayApplication.class, args);
	}

}
