package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.trainninginstitute.model.domain.SpeakerEvaluationModel;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.SpeakerEvaluationRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface SpeakerEvaluationService {
    ResponseEntity<ApiMessageResponse> addEvaluation(SpeakerEvaluationRequest speakerEvaluationRequest);

    ResponseEntity<PaginationResponse<List<SpeakerEvaluationModel>>> getEvaluation(int pageNo, int pageSize, Long evaluationId);

    ResponseEntity<ApiMessageResponse> deleteEvaluation(Long evaluationId);
}
