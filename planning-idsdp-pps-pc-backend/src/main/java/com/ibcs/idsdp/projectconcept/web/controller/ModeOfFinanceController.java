package com.ibcs.idsdp.projectconcept.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.projectconcept.constants.ModeOfFinanceConstant;
import com.ibcs.idsdp.projectconcept.model.domain.ModeOfFinance;
import com.ibcs.idsdp.projectconcept.services.ModeOfFinanceService;
import com.ibcs.idsdp.projectconcept.web.dto.ModeOfFinanceDTO;
import com.ibcs.idsdp.projectconcept.web.dto.request.ModeOfFianceRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(ModeOfFinanceConstant.PC_MODE_OF_FINANCE)
public class ModeOfFinanceController extends BaseController<ModeOfFinance, ModeOfFinanceDTO> {

    private final ModeOfFinanceService modeOfFinanceService;

    public ModeOfFinanceController(BaseService<ModeOfFinance, ModeOfFinanceDTO> baseService, ModeOfFinanceService modeOfFinanceService) {
        super(baseService);
        this.modeOfFinanceService = modeOfFinanceService;
    }

    // get MODE_OF_FINANCE_LIST_BY_PROJECT_SUMMARY_ID
    @PostMapping(path = ModeOfFinanceConstant.MODE_OF_FINANCE_LIST_BY_PROJECT_SUMMARY_ID, produces = "application/json")
    // receive json request->ModeOfFianceRequest
    public Page<ModeOfFinanceDTO> getModeOfFinanceListByProjectSummary(@RequestBody ModeOfFianceRequest request) {
        //call getProjectSummaryByProjectType from ModeOfFinanceService class
        return modeOfFinanceService.getProjectSummaryByProjectType(request);
        //return Object ModeOfFinanceDTO;
    }

    // get MODE_OF_FINANCE_LIST_BY_PROJECT_SUMMARY_ID
    @GetMapping(path = ModeOfFinanceConstant.GET_MODE_OF_FINANCE_LIST_BY_PROJECT_SUMMARY_ID + "/{projectSummaryId}", produces = "application/json")
    public List<ModeOfFinanceDTO> getModeOfFinanceListByProjectSummary(@PathVariable Long projectSummaryId) {
        return modeOfFinanceService.getProjectSummaryByProjectType(projectSummaryId);
    }
}