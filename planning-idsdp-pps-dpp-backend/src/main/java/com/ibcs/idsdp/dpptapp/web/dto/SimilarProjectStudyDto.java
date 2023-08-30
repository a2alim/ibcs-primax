package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.dpptapp.web.dto.request.CostOfMajorItemRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.ItemWiseCostEstimatedRequest;
import lombok.Data;

import java.util.List;

@Data
public class SimilarProjectStudyDto {

    private String uuid;
    private String indicateIssuesMakeProject;
    private String indicateIssuesNotWork;

    public List<ItemWiseCostEstimatedRequest> itemWiseCostEstimatedList;

    public List<CostOfMajorItemRequest> costOfMajorItemList;

    private String similarOngoingProjectsName;
    private String similarCompletedProjectsName;
}
