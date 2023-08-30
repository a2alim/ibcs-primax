package com.ibcs.idsdp.idsdpconfigration.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Setter
@Getter
public class ModeOfFinanceDTO extends UuidIdHolderRequestBodyDTO {

    private String code;
    private Long orderId;

    @NotBlank
    private String nameEn;

    @NotBlank
    private String nameBn;

    private String description;

    @NotNull
    private boolean status;

    @NotNull
    private boolean editable;
}
