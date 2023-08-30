package com.ibcs.idsdp.rmsConfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = "st_category_wise_grant_amount")
//@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class CategoryWiseGrantAmount extends BaseEntity {

	@Column(name = "fiscal_year_id", nullable = false)
	private Long fiscalYearId;

	@Column(name = "research_category_type_id", nullable = false)
	private Long researchCategoryTypeId;

	@Column(name = "budget_all_amount_percent", nullable = false)
	private Double budgetAllAmountPercent;

	@Column(name = "total_budget_allocation_amount", nullable = false)
	private Double totalBudgetAllocationAmount;

	@Column(name = "min_grant_amount", nullable = false)
	private Double minGrantAmount;

    @Column(name = "max_grant_amount", nullable = false)
	private Double maxGrantAmount;

	@Column(name = "budget_source", nullable = false)
	private String budgetSource;

	@Column(name = "active", nullable = false)
	private Boolean active;

	@OneToMany(targetEntity = CategoryWiseGrantAmountFiles.class,cascade = CascadeType.ALL,fetch =FetchType.EAGER )
	@JoinColumn(name ="grant_amount_id_fk",referencedColumnName = "id")
	private List<CategoryWiseGrantAmountFiles> categoryWiseGrantAmountFiles;

}
