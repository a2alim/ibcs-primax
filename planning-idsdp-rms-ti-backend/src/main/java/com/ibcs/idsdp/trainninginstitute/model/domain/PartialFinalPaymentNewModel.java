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
@Table(name = "M3_PARTIAL_FINAL_PAYMENT_NEW")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PartialFinalPaymentNewModel extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    private String letterText;

    private String installmentType;

    private LocalDate installmentDate;

    private Integer installmentAmount;

    private String chalanNo;    

    private Status status;

    private Long fiscalYearId;

    private LocalDate dateOfAcceptance;   

    @ManyToOne(targetEntity = ProposalModel.class, fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinColumn(name = "M3_PROPOSAL_ID")
    private ProposalModel proposalModel;  
    
    @ManyToOne(targetEntity = TrainingInstituteProfileModel.class, fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinColumn(name = "M3_TRAINING_INSTITUTE_PROFILE_ID")
    private TrainingInstituteProfileModel trainingInstituteProfileId;
    
    private String memorandumNo;
    
    private LocalDate sendingDate;
    
    private String sourceNo;
    
    private LocalDate sourceDate;
}
