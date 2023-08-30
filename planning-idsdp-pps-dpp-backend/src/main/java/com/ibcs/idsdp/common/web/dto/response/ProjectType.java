package com.ibcs.idsdp.common.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProjectType {
    private Long id;
    private String code;
    private String projectTypeCode;
    private String nameEn;
    private String nameBn;
    private String description;
    private Boolean status;
}
