package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
@Entity
@Table(name = "m1_agreement_installment")
public class AgreementInstallment extends BaseEntity {

    @ManyToOne(optional = false,fetch = FetchType.LAZY)
    @JoinColumn(name = "m1_agreement_with_researcher_id")
   private AgreementWithResearcher agreementWithResearcherId;

    @Column(name = "st_installment_type_id")
    private Long stInstallmentTypeId;

    @Column(name = "percentage_amount", nullable = false)
    private Integer percentageAmount;

    @Column(name = "tk_amount", nullable = false)
    private Double tkAmount;

    @Transient
    private String stInstallmentType;

}
