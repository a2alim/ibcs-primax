package com.ibcs.idsdp.common.web.dto.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class UuidHolderRequestBodyDTO implements IUuidHolderRequestBodyDTO {

    @NotBlank
    private String uuid;

}
