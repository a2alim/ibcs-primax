package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.Data;

@Data
public class FinancialAnalysisRequest {
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    private String weatherAppraisalStudy;
    private Double financialNpv;
    private Double economicNpv;
    private Double financialBcr;
    private Double economicBcr;
    private Double fiancialIrr;
    private Double economicIrr;
    private Long attachmentSummaryId;
    private Long finacialAnalysisAttachmentId;
    private Long economicAnalysisAttachmentId;
    private Boolean preAppraisal;
}
