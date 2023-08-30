package com.ibcs.idsdp.feasibilitystudy.web.dto;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class MarketAnalysisDTO extends UuidIdHolderRequestBodyDTO {

    private String prbStatement;

    private String relevanceProjectIdea;

    private String proposedProjectInterventions;

    private String stakeholders;

    private String currentDemand;

    private String futureDemand;

    private String variousDemand;

    private String swotAnalysis;

    private Attachment attachment;

    private Long fsrMasterId;
}
