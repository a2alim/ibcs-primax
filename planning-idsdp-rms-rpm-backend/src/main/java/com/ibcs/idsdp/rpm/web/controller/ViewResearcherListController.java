package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.rpm.model.domain.ViewResearcherList;
import com.ibcs.idsdp.rpm.services.ViewResearcherService;
import com.ibcs.idsdp.rpm.web.dto.response.ViewProfileProposalMarksResponse;
import com.ibcs.idsdp.rpm.web.dto.response.ViewResearcherDto;
import com.ibcs.idsdp.rpm.web.dto.response.ViewResearcherProposalResponse;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "api/view-researcher")
@AllArgsConstructor
public class ViewResearcherListController {

	private final ViewResearcherService viewResearcherService;

	@PostMapping(path = "/researcher-grid-list", produces = "application/json")
	public Page<ViewResearcherList> criteriaBasedSearch(@RequestBody ViewResearcherList request) {
		return viewResearcherService.criteriaBasedSearch(request);
	}

	@GetMapping(path = "/find-all-by-st-fiscal-year-id" + "/{stFiscalYearId}", produces = "application/json")
	public Response<ViewResearcherDto> findAllByStFiscalYearId(@PathVariable Long stFiscalYearId) {
		return viewResearcherService.findAllByStFiscalYearId(stFiscalYearId);
	}

	@PostMapping(path = "/find-all-by-st-fiscal-year-id-and-profile-id", produces = "application/json")
	public Response<ViewResearcherList> findAllByStFiscalYearIdAndProfileId(
			@RequestBody ViewResearcherDto viewResearcherDto) {
		return viewResearcherService.findAllByStFiscalYearIdAndProfileId(viewResearcherDto);
	}

	@GetMapping(path = "/view-resercher-profile-by-profile-uuid" + "/{profileUuId}", produces = "application/json")
	public Response<ViewResearcherDto> viewResercherProfile(@PathVariable String profileUuId) {
		return viewResearcherService.viewResercherProfile(profileUuId);
	}

	@GetMapping(path = "/view-researcher-profile-by-profile-id" + "/{profileId}", produces = "application/json")
	public Response<ViewResearcherDto> viewResearcherProfileById(@PathVariable Long profileId) {
		return viewResearcherService.viewResearcherProfileById(profileId);
	}

	@PostMapping(path = "/get-proposal-list", produces = "application/json")
	public Response<ViewResearcherProposalResponse> getProposalByFiscalYearAndCategory(@RequestBody ViewResearcherList request) {
		return viewResearcherService.getProposalByFiscalYearAndCategory(request);
	}

	@PostMapping(path = "/get-profile-proposal-marks", produces = "application/json")
	public Response<ViewProfileProposalMarksResponse> getMarksByFiscalYear(@RequestBody ViewResearcherList request) {
		return viewResearcherService.getMarksByFiscalYear(request);
	}
	
	

}
