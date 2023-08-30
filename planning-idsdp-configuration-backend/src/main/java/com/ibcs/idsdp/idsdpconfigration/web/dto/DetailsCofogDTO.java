package com.ibcs.idsdp.idsdpconfigration.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Setter
@Getter
public class DetailsCofogDTO extends UuidIdHolderRequestBodyDTO {

    @NotBlank
    private long optionalCofogId;

    private String code;

    @NotBlank
    private String entryCode;

    @NotBlank
    private String nameEn;

    @NotBlank
    private String nameBn;

    private String description;

    @NotNull
    private boolean status;

    private OptionalCofogDTO optionalCofog;
}
