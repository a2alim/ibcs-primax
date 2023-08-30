package com.ibcs.idsdp.feasibilitystudy.web.dto;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;


@Data
public class TechnicalAnalysisDTO extends UuidIdHolderRequestBodyDTO {

    private String location;

    private String technicalDesign;

    private String outputPlan;

    private String costEstimates;

    private String impTimeline;

    private Attachment attachment;

    private Long fsrMasterId;
}
