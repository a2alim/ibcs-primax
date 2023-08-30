package com.ibcs.idsdp.web.dto.request;

import lombok.Data;

import java.util.Map;

@Data
public class ApiSetupRequest {
    private Long id;
    private String name;
    private String apiType;
    private Map<String, Long> endpointUrl;
    private String methodType;
    private Map<String, Long> subModule;
    private Map<String, Integer> permission;
}

