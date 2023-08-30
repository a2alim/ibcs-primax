package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;


@ToString
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_TRAINING_BUDGET")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TrainingBudgetModel extends BaseEntity {

    @Column(name = "ITEM_OF_EXPENDITURE")
    private Long itemOfExpenditureId;

    @Column(name = "EXPENDITURE_AMOUNT")
    private int expenditureAmount;

    private Long fiscalYearId;

    private boolean isEditable;

    private boolean isSubmitted;

    @JsonIgnore
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "M3_TRAINING_INSTITUTE_PROFILE_ID")
    private TrainingInstituteProfileModel m3TrainingInstituteProfileId;

    @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.EAGER, targetEntity = ProposalModel.class)
    @JoinColumn(name = "M3_PROPOSAL_ID")
    private ProposalModel proposalModel;

}
