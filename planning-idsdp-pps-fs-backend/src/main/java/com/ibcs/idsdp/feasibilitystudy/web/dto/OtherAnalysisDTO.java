package com.ibcs.idsdp.feasibilitystudy.web.dto;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class OtherAnalysisDTO extends UuidIdHolderRequestBodyDTO {

    private String humanResourceAnalysis;

    private String institutionalAnalysis;

    private String riskSensitivityAnalysis;

    private String alternativesAnalysis;

    private String recommendationConclution;

    private Attachment attachment;

    private Long fsrMasterId;
}
