package com.ibcs.idsdp.trainninginstitute.model.domain;

import java.time.LocalDate;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.trainninginstitute.enums.Status;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_PARTIAL_FINAL_PAYMENT")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PartialFinalPaymentModel extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    private String letterText;

    private String installmentType;

    private LocalDate installmentDate;

    private Integer installmentAmount;

    private String chalanNo;

    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(cascade = CascadeType.MERGE)
    @JoinColumn(name= "M3_PARTIAL_FINAL_PAYMENT_ID")
    List<PaymentVoucherModel> paymentVoucherModels;

    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(cascade = CascadeType.MERGE)
    @JoinColumn(name= "M3_PARTIAL_FINAL_PAYMENT_ID")
    List<PaymentBillVoucherModel> paymentBillVoucherModels;

    private Status status;

    private Long fiscalYearId;

    private LocalDate dateOfAcceptance;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "M3_TRAINING_INSTITUTE_PROFILE_ID")
    private TrainingInstituteProfileModel trainingInstituteProfileModel;

    @ManyToOne(targetEntity = ProposalModel.class, fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinColumn(name = "M3_PROPOSAL_ID")
    private ProposalModel proposalModel;

//  private Long proposalId;


    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private GOLetterOldModel goLetter;
    
    private String memorandumNo;
    private LocalDate sendingDate;
    private String sourceNo;
    private LocalDate sourceDate;
}
