package com.ibcs.idsdp.projectconcept.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.List;

@Data
public class ScopeOfWorkDto extends UuidIdHolderRequestBodyDTO {
    public List<ScopeOfWorkDtoDetails> scopeOfWorkDtoDetails;
}
