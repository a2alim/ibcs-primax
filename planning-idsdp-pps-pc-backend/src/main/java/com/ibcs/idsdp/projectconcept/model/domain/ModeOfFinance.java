package com.ibcs.idsdp.projectconcept.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Table(name = "pc_mode_of_finance")
@EntityListeners(AuditingEntityListener.class)
public class ModeOfFinance extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "project_concept_master_id", nullable = false)
    private ProjectConceptMaster projectConceptMaster;

    @NotNull
    private Long modeId;

    @NotNull
    private Double totalAmount;

    @NotNull
    private Double gobAmount;

    @NotNull
    private Double feGobAmount;

    @NotNull
    private Double ownFundAmount;

    @NotNull
    private Double feOwnFundAmount;

    @NotNull
    private Double paAmount;

    @NotNull
    private Double rpaAmount;

    @NotNull
    private Double dpaAmount;

    private Double otherAmount;

    private Double feOtherAmount;

//    @NotNull
//    private Long pcProjectSummaryId;

}
