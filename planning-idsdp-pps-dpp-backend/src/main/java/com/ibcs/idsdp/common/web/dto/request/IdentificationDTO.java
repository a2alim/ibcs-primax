package com.ibcs.idsdp.common.web.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;


@Setter
@Getter
@AllArgsConstructor
@Builder
public class IdentificationDTO {

    @NotBlank
    private String uuid;
}
