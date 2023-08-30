package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Data
@Entity
@Table(name = "m2_submit_research_progress_report")
public class ResearchProgressReport extends BaseEntity {

	@Column(name = "m1_researcher_proposal_info_id", nullable = false)
	private Long researcherProposalInfoId;

	@Column(name = "research_title")
	private String researchTitle;

	@Column(name = "st_fiscal_year_id")
	private Long fiscalYearId;

	@Column(name = "st_research_category_type_id")
	private Long researchCatTypeId;

	@Column(name = "research_completed_percentage")
	private Double researchCompletedPercentage;

	@Column(name = "details")
	private String details;

	@Column(name = "is_send")
	private Boolean isSend;

	@Column(name = "is_editable")
	private Boolean isEditable;

	@Column(name = "bucket_name")
	private String bucketName;

	@Column(name = "file_name")
	private String fileName;

	@Column(name = "download_url")
	private String downloadUrl;
}
