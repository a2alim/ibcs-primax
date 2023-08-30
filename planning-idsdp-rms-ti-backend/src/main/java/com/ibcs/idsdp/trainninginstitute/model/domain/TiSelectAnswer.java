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
@Table(name = "m3_ti_select_answer")
public class TiSelectAnswer extends BaseEntity {
	
	@NotNull
	@ManyToOne
	@JoinColumn(name = "m3_ti_speaker_evaluation_id")
	private TiSpeakerEvaluation speakerEvaluationId;	
	
	private Long stCommonTypeId;
	
	
	private Integer answer;
	

}
