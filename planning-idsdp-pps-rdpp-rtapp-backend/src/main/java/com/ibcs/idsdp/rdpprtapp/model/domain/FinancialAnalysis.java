package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "rdpp_financial_analysis")
public class FinancialAnalysis extends BaseEntity {
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    private Long financialDiscountFactor;
    private Long economicDiscountFactor;
    private Long financialNpv;
    private Long economicNpv;
    private Long financialBcr;
    private Long economicBcr;
    private Long financialIrr;
    private Long economicIrr;

    private String mainFeaturesOfRevision;
    private String cumulativeExpenditure;

    @OneToOne
    private Attachment financialAttachmentId;
    @OneToOne
    private Attachment economicAttachmentId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "rdpp_master_id")
    private DppObjectiveCost objectiveCost;

}
