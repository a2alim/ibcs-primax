package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "dpp_project_details")
public class ProjectDetailsPartB extends BaseEntity {
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    @Column(columnDefinition = "TEXT")
    private String backgroundStatement;
    @Column(columnDefinition = "TEXT")
    private String linkages;
    @Column(columnDefinition = "TEXT")
    private String povertySituation;
    @Column(columnDefinition = "TEXT")
    private String objective;
    @Column(columnDefinition = "TEXT")
    private String outcomes;
    @Column(columnDefinition = "TEXT")
    private String output;
    @Column(columnDefinition = "TEXT")
    private String activities;
    @Column(columnDefinition = "TEXT")
    private String sexDisaggregated;
    @Column(columnDefinition = "TEXT")
    private String populationCoverage;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dpp_master_id")
    private DppObjectiveCost objectiveCost;
}
