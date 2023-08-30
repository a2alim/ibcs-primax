package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="rdpp_others_important_details")
public class DppOtherImportantDetails extends BaseEntity {
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    @Column(columnDefinition = "TEXT")
    private String sustainabilityBenefit;
    @Column(columnDefinition = "TEXT")
    private String steeringCommitteeTor;
    @Column(columnDefinition = "TEXT")
    private String implementationCommitteeTor;
    @Column(columnDefinition = "TEXT")
    private String others;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "rdpp_master_id")
    private DppObjectiveCost objectiveCost;
}
