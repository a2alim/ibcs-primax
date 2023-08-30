package com.ibcs.idsdp.dpptapp.web.dto.response;

import lombok.Data;

@Data
public class ProjectDetailsPartBResponse {
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    private String uuid;
    private String backgroundStatement;
    private String linkages;
    private String povertySituation;
    private String objective;
    private String output;
    private String outcomes;
    private String activities;
    private String sexDisaggregated;
    private String populationCoverage;
}
