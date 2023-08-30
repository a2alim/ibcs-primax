package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = "dpp_similar_project_studies")
public class SimilarProjectStudy extends BaseEntity {
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    @Column(columnDefinition = "TEXT")
    private String indicateIssuesMakeProject;
    @Column(columnDefinition = "TEXT")
    private String indicateIssuesNotWork;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "item_wise_cost_id")
    private List<ItemWiseCostEstimated> itemWiseCostEstimatedList;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "cost_of_major_item_id")
    private List<CostOfMajorItem> costOfMajorItemList;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dpp_master_id")
    private DppObjectiveCost objectiveCost;

    private String similarOngoingProjectsName;
    private String similarCompletedProjectsName;
}
