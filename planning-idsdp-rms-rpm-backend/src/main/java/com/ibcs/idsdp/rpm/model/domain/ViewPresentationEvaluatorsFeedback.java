package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.*;

import com.ibcs.idsdp.rpm.client.dto.response.ExpertEvaluatorResponseDto;
import lombok.Data;

@Table(name = "m2_presentation_evaluators_feedback_view_web")
@Entity
@Data
public class ViewPresentationEvaluatorsFeedback {

	@Id
	@Column(name = "id")
	private Long id;
	
	@Column(name = "m2_create_seminar_id")
	private Long m2CreateSeminarId;
	
	@Column(name = "m1_researcher_proposal_id")
	private Long m1ResearcherProposalId;
	
	@Column(name = "concerned_person_user_id")
	private Long concernedPersonUserId;
	
	@Column(name = "st_profile_of_expert_evaluators_id")
	private Long stProfileOfExpertEvaluatorsId;
	
//	@Column(name = "m2_researcher_presentation_id")
//	private Long m2ResearcherPresentationId;
//	
//	@Column(name = "m2_evaluators_feedback_id")
//	private Long m2EvaluatorsFeedbackId;
//	
//	@Column(name = "is_present")
//	private Boolean isPresent;

	@Transient
	private ExpertEvaluatorResponseDto expertEvaluatorDto;

}
