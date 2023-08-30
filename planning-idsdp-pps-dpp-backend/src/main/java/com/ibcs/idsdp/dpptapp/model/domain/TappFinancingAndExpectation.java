package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "tapp_financing_expectation")
@EntityListeners(AuditingEntityListener.class)
public class TappFinancingAndExpectation extends BaseEntity {

    @Column(name="project_concept_uuid", unique = true)
    private String pcUuid;

    @Column(name="project_concept_master_id", unique = true)
    private Long pcMasterId;

    @Column(name="required_amount")
    private Double requiredAmount;

    @Column(name="source_financing")
    private String sourceFinancing;

    @Column(columnDefinition = "TEXT")
    private String modeFinancing;

    @Column(columnDefinition = "TEXT")
    private String outcome;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="tapp_master_id", unique = true)
    private TappObjectiveCost tappMasterId;
}