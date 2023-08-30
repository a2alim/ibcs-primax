package com.ibcs.idsdp.trainninginstitute.model.domain;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;


@Data
@Entity
@Table(name = "M3_TI_SPEAKER_EVALUATION")
public class TiSpeakerEvaluation extends BaseEntity{
	
	@NotNull
	@ManyToOne
	@JoinColumn(name = "m3_proposal_Id")
	private ProposalModel proposalId;
	
	
	@NotNull
	@ManyToOne
	@JoinColumn(name = "m3_trainer_id")
	private Trainer trainerId;
	
	@NotNull
	@ManyToOne
	@JoinColumn(name = "m3_participant_id")
	private ParticipantModel participantId;
	
	
	@NotNull
	@ManyToOne
	@JoinColumn(name = "m3_session_id")
	private CourseScheduleModel sessionId;
	
	
	

}
