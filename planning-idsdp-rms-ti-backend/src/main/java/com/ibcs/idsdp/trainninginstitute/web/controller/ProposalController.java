package com.ibcs.idsdp.trainninginstitute.web.controller;

import java.util.List;

import com.ibcs.idsdp.trainninginstitute.web.dto.request.PagableRequestDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.*;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.services.ProposalService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ProposalRequest;
import com.ibcs.idsdp.util.Response;

@RestController
@RequestMapping("proposals")
public class ProposalController extends BaseController<ProposalModel, ProposalRequest, ProposalRequest> {

	private final ProposalService proposalService;
	
	public ProposalController(BaseService<ProposalModel, ProposalRequest, ProposalRequest> service, ProposalService proposalService) {
		super(service);
		this.proposalService = proposalService;		
	}
	

	@PostMapping("/save-proposal")
	public Response<ProposalRequest> createProposal(@RequestBody ProposalRequest proposalRequest) {
		return proposalService.createProposal(proposalRequest);
	}
	
	@PutMapping("/update-proposal")
	public Response<ProposalRequest> editProposal(@RequestBody ProposalRequest proposalRequest) {
		return proposalService.editProposal(proposalRequest);
	}

	@GetMapping()
	public ResponseEntity<PaginationResponse<List<ProposalResponse>>> getProposalList(
			@RequestParam(defaultValue = "0") int pageNo, @RequestParam(defaultValue = "25") int pageSize,
			@RequestParam(required = false) String proposalTitle) {
		return proposalService.getProposalList(pageNo, pageSize, proposalTitle);
	}

	@GetMapping("/all")
	public ResponseEntity<List<ProposalResponse>> getAllProposalList() {
		return proposalService.getAllProposalList();
	}	

	@DeleteMapping("/{proposalId}")
	public ResponseEntity<ApiMessageResponse> deleteProposal(@PathVariable Long proposalId) {
		return proposalService.deleteProposal(proposalId);
	}

	@GetMapping("/{proposalId}")
	public ResponseEntity<ProposalResponse> getSingleProposal(@PathVariable Long proposalId) {
		return proposalService.getSingleProposal(proposalId);
	}

	@GetMapping("/view-listData/{uuid}")
	public ResponseEntity<ProposalListView> getAllViewDataList(@PathVariable String uuid) {
		return new ResponseEntity(proposalService.getAllProposalByUuid(uuid), HttpStatus.OK);
	}

	@PutMapping("/{proposalId}/submit")
	public ResponseEntity<ProposalModel> submitProposal(@PathVariable Long proposalId) {
		return proposalService.submitProposal(proposalId);
	}
	
	@PostMapping("/find-by-fiscal-year-id")
	public Response<ProposalRequest> findByFiscalYearId(@RequestBody ProposalRequest proposalRequest) {
		return proposalService.findByFiscalYearId(proposalRequest);
	}

	@GetMapping("/get-proposal-by-instPro-id/{instProfileId}")
	public ResponseEntity<List<ProposalListResponse>> getAllProposalByInstProfileId(@PathVariable Long instProfileId) {
		return proposalService.getAllProposalByInstProfileId(instProfileId);
	}

	@PostMapping("/get-list")
	public Response<ProposalResponse> getProposalList(@RequestBody PagableRequestDto pagableRequestDto){
		return proposalService.getProposalList(pagableRequestDto);
	}

	@PostMapping("/get-my-list")
	public Response<ProposalResponse> getProposalMyList(@RequestBody PagableRequestDto pagableRequestDto){
		return proposalService.getProposalList(pagableRequestDto);
	}
}
