package com.ibcs.idsdp.web.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AgencyDTO {
    private Long id;
    private String uuid;
    private long ministryDivisionId;
    private String code;
    private String entryCode;
    private String nameEn;
    private String nameBn;
    private LocalDate fiscalYear;
    private Double ceilingAmount;
    private String shortName;
    private String description;
    private boolean status;
    private MinistryDivisionDTO ministryDivision;
}
