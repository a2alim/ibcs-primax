package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Table(name = "m1_linkup_proposal_with_evaluators")
@Entity
@Data
public class LinkupProposalWithEvaluators extends BaseEntity {

	@NotNull
	@OneToOne
	@JoinColumn(name = "researcher_proposal_id")
	private ResearcherProposal researcherProposal;

	private Long stProfileOfExpertEvaluatorsId;
	
	private Long stProfileOfExpertEvaluatorsIdForProMarks;

	@Column(columnDefinition = "TEXT")
	private String mailBodyContent;
	
	@Column(columnDefinition = "TEXT")
	private String mailBodyContentForProMarks;

	private String subject;
	
	private String subjectForProMarks;

	private Integer mailStatus;
	
	private Integer mailStatusForProMarks;

	private Integer reviewStatus;
	
	private Integer reviewStatusForProMarks;

	private Integer isEditable;
	
	private Long stProfileOfExpertEvaluatorsIdForResearch;
	private String mailBodyContentForResearch;
	private String subjectForResearch;
	private Integer mailStatusForResearch;
	private Integer reviewStatusForResearch;

}
