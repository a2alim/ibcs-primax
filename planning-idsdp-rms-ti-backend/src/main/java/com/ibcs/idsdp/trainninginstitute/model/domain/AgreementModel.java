package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@ToString
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_AGREEMENT")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AgreementModel extends BaseEntity {

    private LocalDate agreementDate;

    @ManyToOne(targetEntity = ProposalModel.class,cascade = CascadeType.DETACH, fetch = FetchType.EAGER)
    @JoinColumn(name = "M3_PROPOSAL_ID")
    private ProposalModel proposalModel;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "M3_AGREEMENT_PARTIES_ON_BEHALF_ID")
    private AgreementPartiesModel onBehalf;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "M3_AGREEMENT_PARTIES_WITNESS_ID")
    private AgreementPartiesModel witness;

    private Integer amountOfGrant;

    private Integer traineeRecommended;

    @ManyToOne(targetEntity = GuarantorModel.class, cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "M3_GUARANTOR_ID")
    private GuarantorModel guarantorModel;

    private Integer noOfInstallment;

    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(targetEntity = AgreementInstallmentModel.class, cascade = CascadeType.ALL)
    @JoinColumn(name = "M3_AGREEMENT_ID")
    private List<AgreementInstallmentModel> agreementInstallments;

    @Enumerated(EnumType.STRING)
    private AgreementStatus agreementStatus;

    private boolean isEditable;

    private Long fiscalYearId;

    private boolean isSubmitted;
}
