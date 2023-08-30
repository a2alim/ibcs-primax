package com.ibcs.idsdp.common.web.dto.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class IdHolderRequestBodyDTO implements IIdHolderRequestBodyDTO {

    @NotBlank
    private Long id;
}
