package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.rpm.model.domain.ViewResearchFinalSubmissionReport;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ibcs.idsdp.rpm.model.domain.ViewResearchListPublic;
import com.ibcs.idsdp.rpm.services.ViewResearchListPublicService;
import com.ibcs.idsdp.util.Response;

@RestController
@RequestMapping(value = "api/view-research-public")
public class ViewResearchListPublicController {

	private final ViewResearchListPublicService viewResearchListPublicService;
	
	ViewResearchListPublicController(ViewResearchListPublicService viewResearchListPublicService){
		this.viewResearchListPublicService = viewResearchListPublicService;
	}
	

	@PostMapping(path = "/researcher-grid-list", produces = "application/json")
	public Page<ViewResearchListPublic> criteriaBasedSearch(@RequestBody ViewResearchListPublic request) {
		return viewResearchListPublicService.criteriaBasedSearch(request);
	}
	@PostMapping(path = "/get-public-proposal-info", produces = "application/json")
	public Page<ViewResearchFinalSubmissionReport> researchProposalInfo(@RequestBody ViewResearchFinalSubmissionReport request) {
		return viewResearchListPublicService.findByUserKeyWords(request);
	}
	
//
//	@GetMapping(path = "/find-all-by-st-fiscal-year-id" + "/{stFiscalYearId}", produces = "application/json")
//	public Response<ViewResearcherDto> findAllByStFiscalYearId(@PathVariable Long stFiscalYearId) {
//		return viewResearchListPublicService.findAllByStFiscalYearId(stFiscalYearId);
//	}
//
//	@PostMapping(path = "/find-all-by-st-fiscal-year-id-and-profile-id", produces = "application/json")
//	public Response<ViewResearcherList> findAllByStFiscalYearIdAndProfileId(
//			@RequestBody ViewResearcherDto viewResearcherDto) {
//		return viewResearchListPublicService.findAllByStFiscalYearIdAndProfileId(viewResearcherDto);
//	}
//
//	@GetMapping(path = "/view-resercher-profile-by-profile-uuid" + "/{profileUuId}", produces = "application/json")
//	public Response<ViewResearcherDto> viewResercherProfile(@PathVariable String profileUuId) {
//		return viewResearchListPublicService.viewResercherProfile(profileUuId);
//	}
//
//	@GetMapping(path = "/view-researcher-profile-by-profile-id" + "/{profileId}", produces = "application/json")
//	public Response<ViewResearcherDto> viewResearcherProfileById(@PathVariable Long profileId) {
//		return viewResearchListPublicService.viewResearcherProfileById(profileId);
//	}
//
//	@PostMapping(path = "/get-proposal-list", produces = "application/json")
//	public Response<ViewResearcherProposalResponse> getProposalByFiscalYearAndCategory(@RequestBody ViewResearcherList request) {
//		return viewResearchListPublicService.getProposalByFiscalYearAndCategory(request);
//	}
//
//	@PostMapping(path = "/get-profile-proposal-marks", produces = "application/json")
//	public Response<ViewProfileProposalMarksResponse> getMarksByFiscalYear(@RequestBody ViewResearcherList request) {
//		return viewResearchListPublicService.getMarksByFiscalYear(request);
//	}
//	
	
	@PostMapping(path = "/find-by-key-word", produces = "application/json")
	public Response<ViewResearchListPublic> findByKeyWord(@RequestBody ViewResearchListPublic request) {
		return viewResearchListPublicService.findByKeyWord(request);
	}


	
	

}
