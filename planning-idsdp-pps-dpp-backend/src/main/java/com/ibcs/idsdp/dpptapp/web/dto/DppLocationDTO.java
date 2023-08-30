package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import java.util.Set;

@Setter
@Getter
public class DppLocationDTO extends UuidIdHolderRequestBodyDTO {

    private Long projectConceptMasterId;
    private Long dppMasterId;

    @NotEmpty
    private Set<Long> division;

    @NotEmpty
    private Set<Long> zilla;

    @NotEmpty
    private Set<Long> upazila;

    @NotEmpty
    private Set<Long> municipality;

    private String projectAreaJustification;
}
