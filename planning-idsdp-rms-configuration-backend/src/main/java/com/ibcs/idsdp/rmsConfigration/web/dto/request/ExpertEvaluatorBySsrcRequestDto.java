package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import lombok.Data;

@Data
public class ExpertEvaluatorBySsrcRequestDto {
    private long id;

    private long verifiedBy;

    private boolean acceptAsEvaluator;

    private long stFiscalYearId;

    private String researchCategoryIds;

    private Double apprxFeeOfEngagement;

    private String suitability;

    private Boolean isVerified;
}
