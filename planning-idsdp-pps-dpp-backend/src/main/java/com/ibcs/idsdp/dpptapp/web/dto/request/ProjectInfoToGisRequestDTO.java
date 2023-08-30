package com.ibcs.idsdp.dpptapp.web.dto.request;

import lombok.Data;

@Data
public class ProjectInfoToGisRequestDTO {
    private String pcUuid;
    private String projectType;
    private String access_token;
    private String doptor_token;
}
