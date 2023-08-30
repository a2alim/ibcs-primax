package com.ibcs.idsdp.trainninginstitute.services;

import org.springframework.data.domain.Page;

import com.ibcs.idsdp.trainninginstitute.web.dto.request.TiSpeakerEvaluationRequestDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TiSpeakerEvaluationInfoResponseDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TiSpeakerEvaluationResponseDto;
import com.ibcs.idsdp.util.Response;

public interface TiSpeakerEvaluationService {

	Response<TiSpeakerEvaluationResponseDto> createEvaluation(TiSpeakerEvaluationRequestDto proposalRequest);

	Page<TiSpeakerEvaluationInfoResponseDto> gridList(TiSpeakerEvaluationInfoResponseDto reques);

}
