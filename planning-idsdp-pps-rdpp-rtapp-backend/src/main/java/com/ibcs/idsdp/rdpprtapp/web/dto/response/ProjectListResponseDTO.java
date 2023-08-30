package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class ProjectListResponseDTO {
    private String ppsCode;
    private String projectName;
    private String projectType;
}
