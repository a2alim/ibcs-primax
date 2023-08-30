package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.LinkupProposalWithEvaluatorsConstant;
import com.ibcs.idsdp.rpm.model.domain.LinkupProposalWithEvaluators;
import com.ibcs.idsdp.rpm.services.LinkupProposalWithEvaluatorsService;
import com.ibcs.idsdp.rpm.web.dto.request.LinkupProposalWithEvaluatorsRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.LinkupProposalWithEvaluatorsResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(LinkupProposalWithEvaluatorsConstant.LINKUP_PROPOSAL_WITH_EVALUATORS)
public class LinkupProposalWithEvaluatorsController extends
		BaseController<LinkupProposalWithEvaluators, LinkupProposalWithEvaluatorsRequestDto, LinkupProposalWithEvaluatorsResponseDto> {

	private final LinkupProposalWithEvaluatorsService linkupProposalWithEvaluatorsService;

	public LinkupProposalWithEvaluatorsController(
			BaseService<LinkupProposalWithEvaluators, LinkupProposalWithEvaluatorsRequestDto, LinkupProposalWithEvaluatorsResponseDto> service,
			LinkupProposalWithEvaluatorsService linkupProposalWithEvaluatorsService) {
		super(service);

		this.linkupProposalWithEvaluatorsService = linkupProposalWithEvaluatorsService;
	}


	@PostMapping(path = "save-linkup-proposal-with-evaluators", produces = "application/json")
	public Response<LinkupProposalWithEvaluatorsResponseDto> saveLinkupProposalWithEvaluators(@RequestBody LinkupProposalWithEvaluatorsRequestDto linkupProposalWithEvaluatorsRequestDto) {		
		return linkupProposalWithEvaluatorsService.saveLinkupProposalWithEvaluators(linkupProposalWithEvaluatorsRequestDto);
	}


}
