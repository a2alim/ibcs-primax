package com.ibcs.idsdp.common.web.dto.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.Set;

@Data
public class UuidSetRequestBodyDTO implements IRequestBodyDTO {

    @NotEmpty
    private Set<@NotBlank String> uuids;

}
