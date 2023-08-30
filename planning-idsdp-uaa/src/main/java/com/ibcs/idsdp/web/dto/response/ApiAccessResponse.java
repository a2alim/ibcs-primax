package com.ibcs.idsdp.web.dto.response;

import com.ibcs.idsdp.model.domain.ApiEndpoints;
import lombok.Data;

@Data
public class ApiAccessResponse {
    private Module module;
    private ApiEndpoints apiEndpoints;
}
