package com.ibcs.idsdp.feasibilitystudy.model.domain;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "fsr_cost_benefit_analysis")
@EntityListeners(AuditingEntityListener.class)
public class CostBenefitAnalysis extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    private String financialAnalysis;

    private Double financialNetPresentVal;

    private Double financialBenefitCostRatio;

    private Double financialInternalRateReturn;

    @Column(columnDefinition = "TEXT")
    private String economicAnalysis;

    private Double economicNetPresentVal;

    private Double economicBenefitCostRatio;

    private Double economicInternalRateReturn;

    @OneToOne
    Attachment attachment;

    private Long fsrMasterId;

}
