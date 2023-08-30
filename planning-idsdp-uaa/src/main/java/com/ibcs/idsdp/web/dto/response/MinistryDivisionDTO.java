package com.ibcs.idsdp.web.dto.response;

import lombok.Data;


@Data
public class MinistryDivisionDTO {
    private Long id;
    private String uuid;
    private String code;
    private String entryCode;
    private String nameEn;
    private String nameBn;
    private String shortName;
    private String description;
    private boolean status;
}
