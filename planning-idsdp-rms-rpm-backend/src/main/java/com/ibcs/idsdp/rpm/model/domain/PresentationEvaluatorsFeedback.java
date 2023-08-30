package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.*;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.sun.istack.NotNull;

import lombok.Data;

@Data
@Entity
@Table(name = "m2_presentation_evaluators_feedback")
public class PresentationEvaluatorsFeedback extends BaseEntity {

	@NotNull
	@ManyToOne
	@JoinColumn(name = "m2_researcher_presentation_id")
	private ResearcherPresentation researcherPresentation;
	
	@NotNull
	@ManyToOne
	@JoinColumn(name = "m1_researcher_proposal_id")
	private ResearcherProposal researcherProposal;

	private Long researcherUserId;
	private Long stProfileOfExpertEvaluatorsId;

	@ManyToOne
	@JoinColumn(name = "m2_add_new_member_id")
	private NewMember newMember;
	
	
	private Boolean isPresent;

	@Column(columnDefinition = "TEXT")
	private String evaluatorFeedback;
	private Long pageNo1;

	@Column(columnDefinition = "TEXT")
	private String researcherFeedback;

	private Long pageNo2;
	private Boolean feedbackCompleted;

	private Boolean isResearcherVisible;
	private Boolean isNew;
	private Boolean isVisible;
	private Boolean isEditable;
	
	

}
