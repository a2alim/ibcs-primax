package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.Data;

@Data
public class ProjectDetailsPartBRequest extends UuidHolderRequestBodyDTO {
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    private String backgroundStatement;
    private String linkages;
    private String povertySituation;
    private String objective;
    private String output;
    private String outcomes;
    private String activities;
    private String sexDisaggregated;
    private String populationCoverage;
    private String uuid;
}
