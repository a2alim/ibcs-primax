package com.ibcs.idsdp.rpm.model.domain;

import java.time.LocalDate;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Data
@Entity
@Table(name = "m2_take_action_for_research")
public class ResearchAction extends BaseEntity {

	@Column(name = "m1_researcher_proposal_id", nullable = false)
	private Long researcherProposalInfoId;

	@Column(name = "formula")
	private String formula;

	@Column(name = "action_for")
	private String actionFor;

	@Column(name = "new_research_start_date")
	private LocalDate newResearchStartDate;

	@Column(name = "new_research_end_date")
	private LocalDate newResearchEndDate;

	@Column(name = "new_research_duration_month")
	private String newResearchDurationMonth;

	@Column(name = "new_total_grant_amount")
	private Double newTotalGrantAmount;

	@Column(name = "subject")
	private String subject;

	@Column(columnDefinition = "TEXT")
	private String details;

	@Column(name = "status")
	private String status;
}
