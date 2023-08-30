package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "dpp_project_managements")
@EntityListeners(AuditingEntityListener.class)
public class DppProjectManagement extends BaseEntity {

    @Column(name="project_concept_master_id")
    private Long projectConceptMasterId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dpp_master_id")
    private DppObjectiveCost dppMasterId;

    @Column(name="implementation_arrangement", columnDefinition = "TEXT")
    private String implementationArrangement;

    @Column(name="revenue_budget", columnDefinition = "TEXT")
    private String revenueBudget;

    @Column(name="revenue_budget_2", columnDefinition = "TEXT")
    private String revenueBudget2;

    @Column(name="project_concept_uuid")
    private String projectConceptUuid;

    private Boolean isTransferableToRevenueBudget;
}
