package com.ibcs.idsdp.trainninginstitute.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.*;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static springfox.documentation.builders.PathSelectors.regex;

@Configuration
@EnableSwagger2
public class ApiConfig {

    @Bean
    public Docket postsApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("IBCS")
                .apiInfo(apiInfo())
                .securityContexts(Arrays.asList(securityContext()))
                .securitySchemes(Arrays.asList(apiKey()))
                .select()
                .apis(RequestHandlerSelectors.any())
                .paths(regex("/.*"))
                .build()
                .globalOperationParameters(operationParameters());
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder().title("RMS-BACKEND")
                .description("Sample Documentation Generateed Using SWAGGER2 for RMS-BACKEND Rest API")
                .termsOfServiceUrl("")
                .license("ibcs")
                .licenseUrl("").version("1.0").build();
    }

    private List<Parameter> operationParameters() {
        List<Parameter> headers = new ArrayList<>();
        Parameter authHeader = new ParameterBuilder()
                .parameterType("header")
                .name("Authorization")
                .modelRef(new ModelRef("string"))
                .build();

        headers.add(authHeader);
        return headers;
    }

    private ApiKey apiKey() {
        return new ApiKey("JWT", "Authorization", "header");
    }

    private SecurityContext securityContext() {
        return SecurityContext.builder().securityReferences(defaultAuth()).build();
    }

    private List<SecurityReference> defaultAuth() {
        AuthorizationScope authorizationScope = new AuthorizationScope("global", "accessEverything");
        AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
        authorizationScopes[0] = authorizationScope;
        return Arrays.asList(new SecurityReference("JWT", authorizationScopes));
    }
}
