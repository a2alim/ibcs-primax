package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Table(name = "m1_researcher_proposal_info")
@Entity
@Data
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ResearcherProposalInfo extends BaseEntity {

	@NotNull
	@OneToOne
	@JoinColumn(name = "researcher_proposal_id")
	private ResearcherProposal researcherProposal;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String introduction;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String statementOfProblem;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String objectivesOfTheStudy;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String formulationResearch;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String conceptualFramework;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String reviewOfLiterature;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String rationaleOfTheStudy;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String scopeOfTheStudy;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String methodsOfTheStudy;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String expectedOutput;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String relationWithSocialPolicy;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String tentativeChapterization;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String actionPlanTentativeBudget;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String tentativeBudget;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String bibliographyReferences;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String additionalInfoTopicProposal;

	private Integer isEditable;

}
