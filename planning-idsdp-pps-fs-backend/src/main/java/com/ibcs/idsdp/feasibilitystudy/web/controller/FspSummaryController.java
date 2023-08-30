package com.ibcs.idsdp.feasibilitystudy.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.feasibilitystudy.constants.FspSummaryConstant;
import com.ibcs.idsdp.feasibilitystudy.model.domain.FspSummary;
import com.ibcs.idsdp.feasibilitystudy.services.FspSummaryService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.FspSummaryDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(FspSummaryConstant.FSP_SUMMARY)
public class FspSummaryController extends BaseController<FspSummary, FspSummaryDTO> {

    private final FspSummaryService fspSummaryService;

    public FspSummaryController(BaseService<FspSummary, FspSummaryDTO> baseService, FspSummaryService fspSummaryService) {
        super(baseService);
        this.fspSummaryService = fspSummaryService;
    }

    //Get all feasibility study proposal summary list
    @GetMapping(path = FspSummaryConstant.GET_FSP_SUMMARY_LIST, produces = "application/json")
    public FspSummaryDTO getFspSummary(@PathVariable String projectConceptMasterUuid) {
        return fspSummaryService.getFspSummaryByProjectConceptUuid(projectConceptMasterUuid);
    }
}
