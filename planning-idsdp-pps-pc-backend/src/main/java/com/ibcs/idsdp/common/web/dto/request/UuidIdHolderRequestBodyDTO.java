package com.ibcs.idsdp.common.web.dto.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class UuidIdHolderRequestBodyDTO implements IUuidIdHolderRequestBodyDTO {


    @NotBlank
    private Long id;

    @NotBlank
    private String uuid;

}
