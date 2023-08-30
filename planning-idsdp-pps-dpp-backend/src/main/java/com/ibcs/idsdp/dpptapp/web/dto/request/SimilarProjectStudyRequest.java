package com.ibcs.idsdp.dpptapp.web.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class SimilarProjectStudyRequest {
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    private String indicateIssuesMakeProject;
    private String indicateIssuesNotWork;

    public List<ItemWiseCostEstimatedRequest> itemWiseCostEstimatedList;

    public List<CostOfMajorItemRequest> costOfMajorItemList;

    private String similarOngoingProjectsName;
    private String similarCompletedProjectsName;

}
