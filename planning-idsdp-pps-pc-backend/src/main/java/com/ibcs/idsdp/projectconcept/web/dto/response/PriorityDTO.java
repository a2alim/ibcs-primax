package com.ibcs.idsdp.projectconcept.web.dto.response;

import lombok.Data;

@Data
public class PriorityDTO {
    private Long id;
    private String uuid;
    private String code;
    private String nameEn;
    private String nameBn;
    private String description;
    private Boolean status;
}
