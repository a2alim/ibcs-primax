package com.ibcs.idsdp.trainninginstitute.services.implementation;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.trainninginstitute.model.domain.TiSelectAnswer;
import com.ibcs.idsdp.trainninginstitute.model.domain.TiSpeakerEvaluation;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TiSelectAnswerRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TiSpeakerEvaluationRepository;
import com.ibcs.idsdp.trainninginstitute.services.TiSelectAnswerService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.TiSelectAnswerRequestDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TiSelectAnswerResponseDto;

@Service
public class TiSelectAnswerImpl extends BaseService<TiSelectAnswer, TiSelectAnswerRequestDto, TiSelectAnswerResponseDto> implements TiSelectAnswerService{

	
	private final TiSelectAnswerRepository selectAnswerRepository;
	private final TiSpeakerEvaluationRepository speakerEvaluationRepository;
	
	protected TiSelectAnswerImpl(ServiceRepository<TiSelectAnswer> repository , TiSelectAnswerRepository selectAnswerRepository, TiSpeakerEvaluationRepository speakerEvaluationRepository) {
		super(repository);	
		this.selectAnswerRepository  = selectAnswerRepository;
		this.speakerEvaluationRepository = speakerEvaluationRepository; 
	}
	
	
	@Override
	protected TiSelectAnswer convertForCreate(TiSelectAnswerRequestDto dto) {		
		TiSelectAnswer entity =  super.convertForCreate(dto);		
		if(dto.getSpeakerEvaluationId()!=null) {
			Optional<TiSpeakerEvaluation> optional = speakerEvaluationRepository.findByIdAndIsDeleted(dto.getSpeakerEvaluationId(), false);
			entity.setSpeakerEvaluationId(optional.get());
		}		
		return entity;
	}

}
