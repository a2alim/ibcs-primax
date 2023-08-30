package com.ibcs.idsdp.feasibilitystudy.web.dto;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;


@Data
public class RiskAnalysisDTO extends UuidIdHolderRequestBodyDTO {

    private String envClimateChangeAnalysis;

    private String assessmentDisasterResilienceProject;

    private Attachment attachment;

    private Long fsrMasterId;
}
