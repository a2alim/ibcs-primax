package com.ibcs.idsdp.feasibilitystudy.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.sun.istack.NotNull;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import java.util.Set;

@Data
public class ProjectLocationDTO extends UuidIdHolderRequestBodyDTO {

    @NotEmpty
    private Set<Long> division;

    @NotEmpty
    private Set<Long> zilla;

    @NotEmpty
    private Set<Long> upazila;

    @NotEmpty
    private Set<Long> municipality;

    private Long fsrMasterId;
}
