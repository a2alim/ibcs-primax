package com.ibcs.idsdp.feasibilitystudy.web.dto;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;


@Data
public class CostBenefitAnalysisDTO extends UuidIdHolderRequestBodyDTO {

    private String financialAnalysis;

    private Double financialNetPresentVal;

    private Double financialBenefitCostRatio;

    private Double financialInternalRateReturn;

    private String economicAnalysis;

    private Double economicNetPresentVal;

    private Double economicBenefitCostRatio;

    private Double economicInternalRateReturn;

    private Attachment attachment;

    private Long fsrMasterId;
}
