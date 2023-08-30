package com.ibcs.idsdp.rpm.web.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.ResearcherProposalConstant;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.services.ResearcherProposalService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalDetailsResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(ResearcherProposalConstant.RESEARCHER_PROPOSAL)
public class ResearcherProposalController
		extends BaseController<ResearcherProposal, ResearcherProposalRequestDto, ResearcherProposalResponseDto> {

	private final ResearcherProposalService service;

	public ResearcherProposalController(
			BaseService<ResearcherProposal, ResearcherProposalRequestDto, ResearcherProposalResponseDto> service,
			ResearcherProposalService service1) {
		super(service);
		this.service = service1;
	}

	@GetMapping(path = ResearcherProposalConstant.GET_RESEARCHER_PROPOSAL_DETAILS_BY_UUID
			+ "/{researcherProfileInfoUuid}", produces = "application/json")
	public Response<ResearcherProposalDetailsResponseDto> getByResearcherProposalId(
			@PathVariable String researcherProfileInfoUuid) {
		return service.getResearcherProposalDetailsByUuid(researcherProfileInfoUuid);
	}

	@GetMapping(path = ResearcherProposalConstant.GET_BY_RESEARCHER_PROFILE_INFO_ID_GRID_LIST + "/{page}" + "/{size}"
			+ "/{resProfilePersonalInfoId}", produces = "application/json")
	public Response<ResearcherProposalDetailsResponseDto> getListFindByResProfilePersonalInfoId(
			@PathVariable("page") int page, @PathVariable("size") int size,
			@PathVariable("resProfilePersonalInfoId") Long resProfilePersonalInfoId) {
		return service.getListFindByResProfilePersonalInfoId(new PageableRequestBodyDTO() {
			{
				setPage(page);
				setSize(size);
			}
		}, resProfilePersonalInfoId);
	}

	@GetMapping("/researcher-proposal/{fiscalYearId}")
	public Response<ResearcherProposalResponseDto> getListFindByFiscalYear(
			@PathVariable("fiscalYearId") Long fiscalYearId) {
		return service.getResearcherProfileByFiscalYear(fiscalYearId);
	}

	@PostMapping(path = "/find-all-by-st-fiscal-year-id", produces = "application/json")
	public Response<ResearcherProposalResponseDto> findAllByStFiscalYearId(@RequestBody ResearcherProposalRequestDto researcherProposalRequestDto) {
		return service.findAllByStFiscalYearId(researcherProposalRequestDto);
	}

	@GetMapping(path = ResearcherProposalConstant.GET_BY_FISCAL_YEAR_ID + "/{fiscalYearId}")
	public Response<ResearcherProposalResponseDto> getByFiscalYearId(@PathVariable("fiscalYearId") Long fiscalYearId) {
		return service.getResearcherProfileByFiscalYear(fiscalYearId);
	}

	@PostMapping(path = "/update-approval-status", produces = "application/json")
	public Response<ResearcherProposalResponseDto> updateApprovalStatus(@RequestBody ResearcherProposalRequestDto researcherProposalRequestDto) {
		return service.updateApprovalStatus(researcherProposalRequestDto);
	}
	
	@PostMapping(path = "/update-final-submit-status", produces = "application/json")
	public Response<ResearcherProposalResponseDto> updateFinalSubmitStatus(@RequestBody ResearcherProposalRequestDto researcherProposalRequestDto) {
		return service.updateFinalSubmitStatus(researcherProposalRequestDto);
	}

	@GetMapping("/get-all")
	public Response<ResearcherProposalResponseDto> getListFindByFiscalYear() {
		return service.getAllResearcherProposal();
	}

	@GetMapping(ResearcherProposalConstant.GET_BY_USER_ID)
	public Response<List<ResearcherProposalResponseDto>> getResearcherProposalsByUserid(@PathVariable Long id) {
		return service.getResearcherProposalsByUserid(id);
	}

	@GetMapping("/research-information-find-by-uuid/{uuid}")
	public Response<ResearcherProposalResponseDto> getResearchInformation(@PathVariable String uuid) {
		return service.getResearchInformation(uuid);
	}


	@GetMapping("/check-proposal-by-profile-uuid/{uuid}")
	public Response<ResearcherProposalResponseDto> checkProposalByProfileUuid (@PathVariable String uuid) {
		return service.getProposalByProfileUuid(uuid);
	}
	@GetMapping("/get-list/{byFinalSubmit}")
	public Response<ResearcherProposalResponseDto> getListByFinalSubmit (@PathVariable Boolean byFinalSubmit) {
		return service.getProposalListByFinalSubmit(byFinalSubmit);
	}

	@GetMapping("/get-list-by-fiscalYearId-ResearchCatId/{stFiscalYearId}/{stResearchCatId}")
	public Response<ResearcherProposalResponseDto> getListByFiscalYearIdResearchCatId (@PathVariable Long stFiscalYearId, @PathVariable Long stResearchCatId) {
		return service.getListByFiscalYearIdResearchCatId(stFiscalYearId, stResearchCatId);
	}

}
