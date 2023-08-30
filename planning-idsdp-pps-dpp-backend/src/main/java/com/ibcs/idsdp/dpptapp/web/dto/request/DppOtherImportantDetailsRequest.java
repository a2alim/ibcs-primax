package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.Data;

@Data
public class DppOtherImportantDetailsRequest extends UuidHolderRequestBodyDTO {
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    private String sustainabilityBenefit;
    private String steeringCommitteeTor;
    private String implementationCommitteeTor;
    private String others;
}
