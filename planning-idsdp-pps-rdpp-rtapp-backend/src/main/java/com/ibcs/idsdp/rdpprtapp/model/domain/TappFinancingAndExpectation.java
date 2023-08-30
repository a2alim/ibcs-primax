package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "rtapp_financing_expectation")
@EntityListeners(AuditingEntityListener.class)
public class TappFinancingAndExpectation extends BaseEntity {

    @Column(name="project_concept_uuid")
    private String pcUuid;

    @Column(name="project_concept_master_id")
    private Long pcMasterId;

    @Column(name="required_amount")
    private Double requiredAmount;

    @Column(name="source_financing")
    private Double sourceFinancing;

    @Column(columnDefinition = "TEXT")
    private String modeFinancing;

    @Column(columnDefinition = "TEXT")
    private String outcome;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="rtapp_master_id")
    private TappObjectiveCost tappMasterId;
}