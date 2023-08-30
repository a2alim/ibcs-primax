package com.ibcs.idsdp.dpptapp.web.dto.response;

import lombok.Data;

import javax.validation.constraints.NotNull;


@Data
public class ProjectListDTO {
    @NotNull
    private String ppsCode;
    private String projectName;
    @NotNull
    private String projectType;
    @NotNull
    private String ecnecId;
}
