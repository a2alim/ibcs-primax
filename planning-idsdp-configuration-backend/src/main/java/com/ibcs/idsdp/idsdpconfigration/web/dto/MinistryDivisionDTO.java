package com.ibcs.idsdp.idsdpconfigration.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Setter
@Getter
public class MinistryDivisionDTO extends UuidIdHolderRequestBodyDTO {

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
}
