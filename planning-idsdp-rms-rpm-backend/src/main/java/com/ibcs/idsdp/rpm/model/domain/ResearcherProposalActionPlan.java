package com.ibcs.idsdp.rpm.model.domain;

import java.time.LocalDate;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Table(name = "m1_researcher_proposal_action_plan")
@Entity
@Data
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ResearcherProposalActionPlan extends BaseEntity {

	@NotNull
	@ManyToOne
	@JoinColumn(name = "researcher_proposal_id")
	private ResearcherProposal researcherProposal;

	@NotNull
	private String taskName;
	private Integer totalDays;
	private LocalDate startDate;
	private LocalDate endDate;
	private String remarks;
	private Boolean isAgree;
	@NotNull
	private Long catWiseActPlanId;
}
