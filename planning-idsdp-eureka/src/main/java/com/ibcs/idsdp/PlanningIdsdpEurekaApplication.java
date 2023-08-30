package com.ibcs.idsdp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class PlanningIdsdpEurekaApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlanningIdsdpEurekaApplication.class, args);
	}
}
