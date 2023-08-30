package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "dpp_financial_analysis")
public class FinancialAnalysis extends BaseEntity {
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    @Column(columnDefinition = "TEXT")
    private String weatherAppraisalStudy;
    private Long financialProjectLifeTime;
    private Long economicProjectLifeTime;
    private Long financialDiscountFactor;
    private Long economicDiscountFactor;
    private Double financialNpv;
    private Double economicNpv;
    private Double financialBcr;
    private Double economicBcr;
    private Double fiancialIrr;
    private Double economicIrr;
    private Boolean preAppraisal;

    @OneToOne
    private Attachment SummaryFindingAttachmentId;
    @OneToOne
    private Attachment financialAttachmentId;
    @OneToOne
    private Attachment economicAttachmentId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dpp_master_id")
    private DppObjectiveCost objectiveCost;

}
