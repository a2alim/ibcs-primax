package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "dpp_mtbf_fiscal_year_detail")
@EntityListeners(AuditingEntityListener.class)
public class DppMtbfFiscalYearDetail extends BaseEntity {
    private String fiscalYear;
    private Double resourcesInFiveYearPlan;
    private Double allocationAndProjection;
    private Double allocationRequiredForProject;
    private Double allocationOfApprovedProject;
    private Double allocationOfRecommendedProject;
    private Double allocationRequiredForProposedProject;
    private Double totalRequirementOfAllocation;
    private Double fiscalSpace;
}
