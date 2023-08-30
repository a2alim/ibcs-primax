package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class DppMtbfFiscalYearDetailDTO extends UuidIdHolderRequestBodyDTO {
    private String fiscalYear;
    private Double resourcesInFiveYearPlan;
    private Double allocationAndProjection;
    private Double allocationRequiredForProject;
    private Double allocationOfApprovedProject;
    private Double allocationOfRecommendedProject;
    private Double allocationRequiredForProposedProject;
    private Double totalRequirementOfAllocation;
    private Double fiscalSpace;
}
