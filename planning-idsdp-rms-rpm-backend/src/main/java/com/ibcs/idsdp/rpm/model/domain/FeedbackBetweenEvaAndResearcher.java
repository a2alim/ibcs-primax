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
@Table(name = "m2_send_feedback_between_eva_and_researcher")
public class FeedbackBetweenEvaAndResearcher extends BaseEntity {

	@NotNull
	@ManyToOne
	@JoinColumn(name = "m2_researcher_presentation_id")
	private ResearcherPresentation researcherPresentation;
	
	private String sendTo;
	
//	@NotNull
//	@ManyToOne
//	@JoinColumn(name = "m2_create_seminar_id")
//	private CreateSeminar m2CreateSeminarId;
	
	Long m2CreateSeminarId;
	
	@NotNull
	@ManyToOne
	@JoinColumn(name = "m2_create_seminar_id")
	private ResearcherProposal m1ResearcherProposalId;
	
	private String subject;
	
	private String receiverMailAddress;
	
	private String mailBody;
	
	private Boolean isSent;

}
