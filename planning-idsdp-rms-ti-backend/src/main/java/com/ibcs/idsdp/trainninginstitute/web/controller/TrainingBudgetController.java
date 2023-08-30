package com.ibcs.idsdp.trainninginstitute.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingBudgetModel;
import com.ibcs.idsdp.trainninginstitute.services.TrainingBudgetService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.TrainingBudgetRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@AllArgsConstructor
@RequestMapping("/research-budgets")
public class TrainingBudgetController {

	private final TrainingBudgetService trainingBudgetService;

	@PostMapping()
	public ResponseEntity<ApiMessageResponse> createResearchBudget(
			@RequestBody TrainingBudgetRequest trainingBudgetRequest) {
		return trainingBudgetService.createResearchBudget(trainingBudgetRequest);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiMessageResponse> editResearchBudget(@PathVariable Long id,
			@RequestBody TrainingBudgetRequest trainingBudgetRequest) {
		return trainingBudgetService.editResearchBudget(id, trainingBudgetRequest);
	}

	@GetMapping()
    public ResponseEntity<PaginationResponse<List<TrainingBudgetModel>>> getResearchBudgetList(@RequestParam(required = false) String instituteName,
                                                                                               @RequestParam(defaultValue = "0") int pageNo,
                                                                                               @RequestParam(defaultValue = "25") int pageSize,                                                                                               
    		                                                                                   @RequestParam("proposalId") Long proposalId){
    	
        return trainingBudgetService.getResearchBudgetList(instituteName, pageNo, pageSize,proposalId);
    }

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiMessageResponse> deleteResearchBudget(@PathVariable Long id) {
		return trainingBudgetService.deleteResearchBudget(id);
	}

	@GetMapping("/{id}")
	public ResponseEntity<TrainingBudgetModel> getSingleResearchBudget(@PathVariable Long id) {
		return trainingBudgetService.getSingleResearchBudget(id);
	}

	@GetMapping("/fiscal-year/{fiscalYearId}")
	public ResponseEntity<List<TrainingBudgetModel>> getResearchBudgetListByFiscalYear(
			@PathVariable Long fiscalYearId) {
		return trainingBudgetService.getResearchBudgetListByFiscalYear(fiscalYearId);
	}

	@GetMapping("/proposal-id/{proposalId}")
	public ResponseEntity<List<TrainingBudgetModel>> getResearchBudgetListByProposalId(@PathVariable Long proposalId) {
		return trainingBudgetService.getResearchBudgetListByProposalId(proposalId);
	}

}
