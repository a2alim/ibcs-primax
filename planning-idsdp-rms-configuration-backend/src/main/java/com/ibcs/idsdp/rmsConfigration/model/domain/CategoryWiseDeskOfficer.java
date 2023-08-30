package com.ibcs.idsdp.rmsConfigration.model.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Data
@Entity
@Table(name = "st_category_wise_desk_officer")
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class CategoryWiseDeskOfficer extends BaseEntity {

	@ManyToOne(optional = false)
	@JoinColumn(name = "st_fiscal_year_id")
	private FiscalYear stFiscalYearId;

	@ManyToOne(optional = false)
	@JoinColumn(name = "st_research_category_type_id")
	private ResearchCategoryType stResearchCategoryTypeId;

	@Column(name = "cat_wise_profile_mark", nullable = false, length = 2)
	private Integer catWiseProfileMark;

	@Column(name = "cat_wise_proposal_mark", nullable = false, length = 2)
	private Integer catWiseProposalMark;

	@Column(name = "active", nullable = false)
	private Boolean active;
	
	
	@Column(name = "user_id", length = 20)
	private Long userId;

}
