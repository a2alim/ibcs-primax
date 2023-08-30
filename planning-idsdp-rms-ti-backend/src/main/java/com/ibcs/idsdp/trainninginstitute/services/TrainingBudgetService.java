package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingBudgetModel;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.TrainingBudgetRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface TrainingBudgetService {
    ResponseEntity<ApiMessageResponse> createResearchBudget(TrainingBudgetRequest trainingBudgetRequest);

    ResponseEntity<PaginationResponse<List<TrainingBudgetModel>>> getResearchBudgetList(String instituteName, int pageNo, int pageSize, Long proposalId);

    ResponseEntity<ApiMessageResponse> editResearchBudget(Long id, TrainingBudgetRequest trainingBudgetRequest);

    ResponseEntity<ApiMessageResponse> deleteResearchBudget(Long id);

    ResponseEntity<TrainingBudgetModel> getSingleResearchBudget(Long id);

    ResponseEntity<List<TrainingBudgetModel>> getResearchBudgetListByFiscalYear(Long fiscalYearId);

    ResponseEntity<List<TrainingBudgetModel>> getResearchBudgetListByProposalId(Long proposalId);
}
