package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.Data;


@Data
public class DppOtherDetailsRequest extends UuidHolderRequestBodyDTO {
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    private String specificationLinkagePerspective;
    private String contributionProjectAchieving;
    private String relationProjectAllocation;
    private String whetherPrivateSector;
    private String majorConditionalityForeignAid;
    private String involvementCompensation;
    private String riskAnalysisMitigation;
    private Boolean isPrivateSector;
}
