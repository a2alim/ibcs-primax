package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.rpm.model.domain.ResearchFinalSubmission;
import com.ibcs.idsdp.rpm.services.ResearchFinalSubmissionService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearchFinalSubmissionRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearchFinalSubmissionResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("research-final-submission")
public class ResearchFinalSubmissionController extends BaseController<ResearchFinalSubmission, ResearchFinalSubmissionRequestDto, ResearchFinalSubmissionResponseDto> {

    private final ResearchFinalSubmissionService researchFinalSubmissionService;

    public ResearchFinalSubmissionController(BaseService<ResearchFinalSubmission, ResearchFinalSubmissionRequestDto, ResearchFinalSubmissionResponseDto> service, ResearchFinalSubmissionService researchFinalSubmissionService) {
        super(service);
        this.researchFinalSubmissionService = researchFinalSubmissionService;
    }

    @GetMapping("/find-by-m1-researcher-proposal-id/{m1ResearcherProposalId}")
    public Response<ResearchFinalSubmissionResponseDto> findByM1ResearcherProposalId(@PathVariable Long m1ResearcherProposalId){
        return researchFinalSubmissionService.findByM1ResearcherProposalId(m1ResearcherProposalId);
    }

    @GetMapping(value = "/final-submit/{id}")
    public Response finalSubmitCompletionReport(@PathVariable("id") Long id){
        return researchFinalSubmissionService.submitFinalCompletionReport(id);
    }


}
