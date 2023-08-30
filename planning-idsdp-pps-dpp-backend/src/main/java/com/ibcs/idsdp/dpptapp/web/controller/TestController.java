package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RefreshScope
@RestApiController
@RequestMapping("config/")
public class TestController {

    @Value("${mgs}")
    private String message;

    @GetMapping(path = "message", produces = "application/json")
    public String getMessage() {
        return message;
    }
}
