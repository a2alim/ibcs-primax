package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.rpm.enums.EvaluationFieldType;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Table(name = "m1_researcher_proposal_marks")
@Entity
@Data
public class ResearcherProposalMarks extends BaseEntity {

	@NotNull
	@ManyToOne
	@JoinColumn(name = "researcher_proposal_id")
	private ResearcherProposal researcherProposal;

	@NotNull
	private EvaluationFieldType evaluationFieldType;

	@NotNull
	private Integer markOne;

	@NotNull
	private Integer markTwo;

	@NotNull
	private Integer markThree;

	@NotNull
	private Integer markFour;

	@NotNull
	private Integer markFive;

	@NotNull
	private Integer markSix;

	@NotNull
	private Integer markSeven;

	@NotNull
	private Integer markEight;

	@NotNull
	private Integer markNine;

	@NotNull
	private Integer markTen;

	@Column(columnDefinition = "TEXT")
	private String comments;

	@NotNull
	private Integer totalMarks;

	private Boolean isDraft;

}
