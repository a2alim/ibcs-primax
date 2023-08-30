package com.ibcs.idsdp.projectconcept.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import java.util.Set;

@Setter
@Getter
public class ProjectConceptLocationDTO extends UuidIdHolderRequestBodyDTO {

    @NotNull
    private Long projectConceptMasterId;

    @NotEmpty
    private Set<Long> division;

    @NotEmpty
    private Set<Long> zilla;

    @NotEmpty
    private Set<Long> upazila;

    @NotEmpty
    private Set<Long> municipality;
}
