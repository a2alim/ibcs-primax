package com.ibcs.idsdp.dpptapp.client.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AgencyDTO extends UuidIdHolderRequestBodyDTO {
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
    private MinistryDivisionDTO ministryDivisionDTO;
}
