package com.ibcs.idsdp.rmsConfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;


@Data
@Entity
public class ExpertEvaluatorBySsrc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private long verifiedBy;

    private boolean acceptAsEvaluator;

    private long stFiscalYearId;

    private String researchCategoryIds;

    private Double apprxFeeOfEngagement;

    private String suitability;

    private Boolean isVerified;

}
