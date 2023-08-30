package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.trainninginstitute.model.domain.CourseScheduleModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.Trainer;

import lombok.Data;

@Data
public class TiSpeakerEvaluationInfoResponseDto extends UuidIdHolderRequestBodyDTO{	
	
	private Long stCommonTypeId;	
	private Long proposalId;
	private Long trainerId;	
	private Long sessionId;	
	private Long good;
	private Long very_good;	
	private Long excellent;
	
	private ProposalModel proposalModel;
	private CourseScheduleModel session;	
	private Trainer trainer;
	
	 private PageableRequestBodyDTO pageableRequestBodyDTO;
	

}
