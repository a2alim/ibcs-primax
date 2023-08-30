package com.ibcs.idsdp.trainninginstitute.web.controller;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.trainninginstitute.model.domain.TiSpeakerEvaluation;
import com.ibcs.idsdp.trainninginstitute.services.TiSpeakerEvaluationService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ProposalRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.TiSpeakerEvaluationRequestDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.NominatedInstituteResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TiSpeakerEvaluationInfoResponseDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TiSpeakerEvaluationResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping("ti-speaker-evaluation")
public class TiSpeakerEvaluationController
		extends BaseController<TiSpeakerEvaluation, TiSpeakerEvaluationRequestDto, TiSpeakerEvaluationResponseDto> {

	private final TiSpeakerEvaluationService speakerEvaluationService;

	public TiSpeakerEvaluationController(
			BaseService<TiSpeakerEvaluation, TiSpeakerEvaluationRequestDto, TiSpeakerEvaluationResponseDto> service,
			TiSpeakerEvaluationService speakerEvaluationService) {
		super(service);
		this.speakerEvaluationService = speakerEvaluationService;
	}

	@PostMapping("/save-evaluation")
	public Response<TiSpeakerEvaluationResponseDto> createEvaluation(
			@RequestBody TiSpeakerEvaluationRequestDto proposalRequest) {
		return speakerEvaluationService.createEvaluation(proposalRequest);
	}

	@PostMapping("/grid-list")
	public Page<TiSpeakerEvaluationInfoResponseDto> gridList(@RequestBody TiSpeakerEvaluationInfoResponseDto request) {
		return speakerEvaluationService.gridList(request);
	}

}
