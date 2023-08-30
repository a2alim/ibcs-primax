package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.ResearcherProposalActionPlanConstant;
import com.ibcs.idsdp.rpm.model.domain.EducationInfo;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalActionPlan;
import com.ibcs.idsdp.rpm.services.ResearcherProposalActionPlanService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalActionPlanRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalActionPlanResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(ResearcherProposalActionPlanConstant.RESEARCHER_PROPOSAL_ACTION_PLAN)
public class ResearcherProposalActionPlanController extends	BaseController<ResearcherProposalActionPlan, ResearcherProposalActionPlanRequestDto, ResearcherProposalActionPlanResponseDto>{

	private final ResearcherProposalActionPlanService service;

	public ResearcherProposalActionPlanController(
			BaseService<ResearcherProposalActionPlan, ResearcherProposalActionPlanRequestDto, ResearcherProposalActionPlanResponseDto> service, ResearcherProposalActionPlanService service1) {
		super(service);
		this.service = service1;
	}

	@GetMapping(path = ResearcherProposalActionPlanConstant.GET_BY_RESEARCHER_PROPOSAL_ID + "/{researcherProposalId}", produces = "application/json")
	public Response<ResearcherProposalActionPlanResponseDto> getByResearcherProposalId(@PathVariable Long researcherProposalId) {
		return service.getByResearcherProposalId(researcherProposalId);
	}

	@PostMapping(path = ResearcherProposalActionPlanConstant.SAVE_LIST, produces = "application/json")
	public Response<ResearcherProposalActionPlanResponseDto> saveList(@RequestBody List<ResearcherProposalActionPlanRequestDto> requestDtoList) {
		return service.saveList(requestDtoList);
	}

	@PostMapping(path = ResearcherProposalActionPlanConstant.SAVE_LIST2, produces = "application/json")
	public Response<ResearcherProposalActionPlanResponseDto> saveProposalActionPlanList(@RequestBody List<ResearcherProposalActionPlanRequestDto> actionPlans) {
		return service.saveList2(actionPlans);
	}

}
