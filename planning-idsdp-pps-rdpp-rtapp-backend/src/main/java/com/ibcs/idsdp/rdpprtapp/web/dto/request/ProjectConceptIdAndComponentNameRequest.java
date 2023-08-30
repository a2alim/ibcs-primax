package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.IRequestBodyDTO;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Setter
@Getter
public class ProjectConceptIdAndComponentNameRequest implements IRequestBodyDTO {


    private Long rdppMasterId;

    private Long rtappMasterId;

    @NotNull
    private Long projectConceptId;

    @NotBlank
    private String componentName;
}
