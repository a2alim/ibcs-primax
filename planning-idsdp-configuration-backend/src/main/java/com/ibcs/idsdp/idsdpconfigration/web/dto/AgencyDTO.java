package com.ibcs.idsdp.idsdpconfigration.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

@Setter
@Getter
public class AgencyDTO extends UuidIdHolderRequestBodyDTO {

    @NotBlank
    private long ministryDivisionId;

    private String code;

    @NotBlank
    private String entryCode;

    @NotBlank
    private String nameEn;

    @NotBlank
    private String nameBn;

    @NotBlank
    private LocalDate fiscalYear;

    @NotBlank
    private Double ceilingAmount;

    private String shortName;

    private String description;

    @NotNull
    private boolean status;

    private MinistryDivisionDTO ministryDivisionDTO;
}
