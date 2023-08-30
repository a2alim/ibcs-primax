package com.ibcs.idsdp.rmsConfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "st_fiscal_year_wise_budget")
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class FiscalYearWiseBudget extends BaseEntity {

	@Column(name = "st_fiscal_year_id", nullable = false)
	private Long fiscalYearId;

	@Column(name = "revision_no", nullable = false)
	private Long revisionNo;

	@Column(name = "total_allocated_budget_amount")
	private Double totalAllocatedBudgetAmount;

	@Column(name = "active", nullable = false)
	private Boolean active;

}
