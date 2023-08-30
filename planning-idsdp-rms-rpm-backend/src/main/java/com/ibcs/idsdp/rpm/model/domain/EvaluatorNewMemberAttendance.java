package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.sun.istack.NotNull;

import lombok.Data;


@Data
@Entity
@Table(name = "m2_evaluator_new_member_attendance")
public class EvaluatorNewMemberAttendance extends BaseEntity{
	
	@NotNull
	@ManyToOne
	@JoinColumn(name = "m2_researcher_presentation_id")
	private ResearcherPresentation researcherPresentation;
	
	@NotNull
	@ManyToOne
	@JoinColumn(name = "m1_researcher_proposal_id")
	private ResearcherProposal researcherProposal;
	
	private Long stProfileOfExpertEvaluatorsId;

	@ManyToOne
	@JoinColumn(name = "m2_add_new_member_id")
	private NewMember newMember;	
	
	private Boolean isPresent;
	

}
