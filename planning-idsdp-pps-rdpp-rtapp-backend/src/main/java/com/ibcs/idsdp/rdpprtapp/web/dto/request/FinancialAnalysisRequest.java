package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import lombok.Data;

@Data
public class FinancialAnalysisRequest {
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    private Long financialNpv;
    private Long economicNpv;
    private Long financialBcr;
    private Long economicBcr;
    private Long financialIrr;
    private Long economicIrr;
    private String mainFeaturesOfRevision;
    private String cumulativeExpenditure;
    private Long financialAnalysisAttachmentId;
    private Long economicAnalysisAttachmentId;
}
