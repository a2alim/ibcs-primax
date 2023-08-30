package com.ibcs.idsdp.trainninginstitute.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.trainninginstitute.model.domain.AgreementInstallmentModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.AgreementStatus;
import com.ibcs.idsdp.trainninginstitute.model.domain.AgreementModel;
import com.ibcs.idsdp.trainninginstitute.services.AgreementService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.AgreementRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.AgreementInstallmentResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.AgreementViewList;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@AllArgsConstructor
@RequestMapping("/agreements")
public class AgreementController {

	private final AgreementService agreementService;

	@PostMapping()
	public ResponseEntity<ApiMessageResponse> createAgreement(@RequestBody AgreementRequest agreementRequest) {
		return agreementService.createAgreement(agreementRequest);
	}

	@GetMapping()
	public ResponseEntity<PaginationResponse<List<AgreementModel>>> getAgreements(
			@RequestParam(defaultValue = "0") int pageNo, @RequestParam(defaultValue = "25") int pageSize,
			@RequestParam(required = false) String search, @RequestHeader(name = "Authorization") String token) {
		return agreementService.getAgreements(pageNo, pageSize, search);
	}

	@DeleteMapping("/{agreementId}")
	public ResponseEntity<ApiMessageResponse> deleteAgreement(@PathVariable Long agreementId) {
		return agreementService.deleteAgreement(agreementId);
	}

	@PutMapping("/{agreementId}")
	public ResponseEntity<ApiMessageResponse> editAgreement(@PathVariable Long agreementId,
			@RequestBody AgreementRequest agreementRequest) {
		return agreementService.editAgreement(agreementId, agreementRequest);
	}

	@GetMapping("/{agreementId}")
	public ResponseEntity<AgreementModel> getAgreement(@PathVariable Long agreementId) {
		return agreementService.getSingleAgreement(agreementId);
	}

	@PutMapping("/change-status/{agreementId}")
	public ResponseEntity<ApiMessageResponse> changeAgreementStatus(@PathVariable Long agreementId,
			@RequestParam AgreementStatus agreementStatus) {
		return agreementService.changeStatus(agreementId, agreementStatus);
	}

	@GetMapping("/view-listData/{id}")
	public ResponseEntity<AgreementViewList> getAllAgreementViewList(@PathVariable Long id) {
		return new ResponseEntity(agreementService.getAllAgreementLetter(id), HttpStatus.OK);
	}

	@GetMapping("/proposal/{id}")
	public ResponseEntity<AgreementModel> getAgreementByProposalId(@PathVariable Long id) {
		return agreementService.getAgreementByProposalId(id);
	}

	@GetMapping("/installments/{proposalId}")
	public ResponseEntity<List<AgreementInstallmentResponse>> getInstallmentsByProposalId(@PathVariable Long proposalId) {
		return agreementService.getInstallmentsByProposalId(proposalId);
	}

	@GetMapping("/find-proposal-by-ti-user-id")
	public ResponseEntity<List<AgreementModel>> findProposalList() {
		return agreementService.findProposalList();
	}

}
