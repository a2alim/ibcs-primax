package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = "rdpp_similar_project_studies")
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
    @JoinColumn(name = "rdpp_cost_of_major_item_id")
    private List<CostOfMajorItem> costOfMajorItemList;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "rdpp_master_id")
    private DppObjectiveCost objectiveCost;
}
