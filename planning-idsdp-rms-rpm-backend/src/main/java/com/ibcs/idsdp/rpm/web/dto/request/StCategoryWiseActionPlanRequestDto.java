package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;
@Data
public class StCategoryWiseActionPlanRequestDto extends UuidIdHolderRequestBodyDTO {
    private Long stFiscalYearId;
    private Long stResearchCategoryTypeId;
    private String taskName;
    private Integer totalDays;
    private Boolean isActive;
}
