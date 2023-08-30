package com.ibcs.idsdp.common.web.dto.request;

import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Set;

@Data
public class IdSetRequestBodyDTO implements IRequestBodyDTO {

    @NotEmpty
    private Set<@NotNull Long> ids;

}
