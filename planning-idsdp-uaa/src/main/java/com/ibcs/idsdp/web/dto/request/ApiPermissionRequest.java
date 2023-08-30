package com.ibcs.idsdp.web.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.ibcs.idsdp.web.dto.response.ComponentResponse;
import lombok.Data;

import java.util.List;

@Data
public class ApiPermissionRequest {
    private int roleId;
    private int userId;
    @JsonAlias("objList")
    private List<ComponentResponse> componentResponse;
}
