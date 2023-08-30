package com.ibcs.idsdp.feasibilitystudy.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.List;

@Data
public class WorkPlanDTO extends UuidIdHolderRequestBodyDTO {
    public List<WorkPlanDtoDetails> workPlanDtoDetails;
}
