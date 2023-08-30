package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "rdpp_project_managements")
@EntityListeners(AuditingEntityListener.class)
public class DppProjectManagement extends BaseEntity {

    @Column(name="project_concept_master_id")
    private Long projectConceptMasterId;

    private Long rdppMasterId;

    @Column(name="implementation_arrangement", columnDefinition = "TEXT")
    private String implementationArrangement;

    @Column(name="revenue_budget", columnDefinition = "TEXT")
    private String revenueBudget;

    @Column(name="project_concept_uuid")
    private String projectConceptUuid;
}
