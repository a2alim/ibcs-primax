package com.ibcs.idsdp.trainninginstitute.web.controller;

import com.ibcs.idsdp.trainninginstitute.model.domain.SpeakerEvaluationModel;
import com.ibcs.idsdp.trainninginstitute.services.SpeakerEvaluationService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.SpeakerEvaluationRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("speaker-evaluation")
public class SpeakerEvaluationController {

    private final SpeakerEvaluationService speakerEvaluationService;

    @PostMapping()
    public ResponseEntity<ApiMessageResponse> addEvaluation(@RequestBody SpeakerEvaluationRequest speakerEvaluationRequest) {
        return speakerEvaluationService.addEvaluation(speakerEvaluationRequest);
    }

    @GetMapping()
    public ResponseEntity<PaginationResponse<List<SpeakerEvaluationModel>>> getEvaluation(@RequestParam(defaultValue = "0") int pageNo,
                                                                                          @RequestParam(defaultValue = "25") int pageSize,
                                                                                          @RequestParam(required = false) Long evaluationId) {
        return speakerEvaluationService.getEvaluation(pageNo, pageSize, evaluationId);
    }

    @DeleteMapping("/{evaluationId}")
    public ResponseEntity<ApiMessageResponse> deleteEvaluation(@PathVariable Long evaluationId) {
        return speakerEvaluationService.deleteEvaluation(evaluationId);
    }
}
