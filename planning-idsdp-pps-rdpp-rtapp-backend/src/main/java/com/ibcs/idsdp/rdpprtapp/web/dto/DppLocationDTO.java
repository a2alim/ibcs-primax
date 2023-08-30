package com.ibcs.idsdp.rdpprtapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import java.util.Set;

@Setter
@Getter
public class DppLocationDTO extends UuidIdHolderRequestBodyDTO {


    private Long rdppMasterId;

    @NotEmpty
    private Set<Long> division;

    @NotEmpty
    private Set<Long> zilla;

    @NotEmpty
    private Set<Long> upazila;

    @NotEmpty
    private Set<Long> municipality;
}
