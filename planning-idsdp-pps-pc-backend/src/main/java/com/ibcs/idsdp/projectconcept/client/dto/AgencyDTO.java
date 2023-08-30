package com.ibcs.idsdp.projectconcept.client.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.projectconcept.client.dto.response.MinistryDivision;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

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

    private String shortName;

    private String description;

    @NotNull
    private boolean status;

    private MinistryDivision ministryDivisionDTO;
}
