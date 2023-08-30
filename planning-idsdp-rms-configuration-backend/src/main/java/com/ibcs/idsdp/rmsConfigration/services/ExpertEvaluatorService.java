package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.model.domain.ExpertEvaluator;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ExpertEvaluatorRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ExpertEvaluatorResponseDto;
import com.ibcs.idsdp.util.Response;

import java.util.List;
import java.util.Set;

import org.springframework.web.bind.annotation.PathVariable;

public interface ExpertEvaluatorService {

    Response create(ExpertEvaluatorRequestDto expertEvaluator);

    Response findById(Long id);

    Response update(ExpertEvaluatorRequestDto expertEvaluator,long id);

    Response getAllExpertEvaluator();

    Response deleteById(Long id);

    Response<ExpertEvaluatorResponseDto> getByIds(Set<Long> ids);
    
    Response findByUserId(Long userId);
}
