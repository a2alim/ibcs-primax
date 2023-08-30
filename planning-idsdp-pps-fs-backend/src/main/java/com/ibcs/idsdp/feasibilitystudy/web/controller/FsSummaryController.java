package com.ibcs.idsdp.feasibilitystudy.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.feasibilitystudy.constants.FsSummaryConstant;
import com.ibcs.idsdp.feasibilitystudy.model.domain.FsSummary;
import com.ibcs.idsdp.feasibilitystudy.services.FsSummaryService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.FsLinkWithDto;
import com.ibcs.idsdp.feasibilitystudy.web.dto.FsSummaryDTO;
import org.springframework.web.bind.annotation.*;


@RestApiController
@RequestMapping(FsSummaryConstant.FS_SUMMARY)
public class FsSummaryController extends BaseController<FsSummary, FsSummaryDTO> {

    private final FsSummaryService fsSummaryService;

    public FsSummaryController(BaseService<FsSummary, FsSummaryDTO> baseService, FsSummaryService fsSummaryService) {
        super(baseService);
        this.fsSummaryService = fsSummaryService;
    }

    @GetMapping("/getFsSummary/{projectConceptMasterUuid}")
    public FsSummaryDTO getFsSummary(@PathVariable String projectConceptMasterUuid) {
        return fsSummaryService.getFsSummaryByProjectConceptUuid(projectConceptMasterUuid);
    }

    @GetMapping("/getFsSummary-by-pc-id/{pcId}")
    public FsSummaryDTO getFsSummaryByPCId(@PathVariable Long pcId) {
        return fsSummaryService.getFsSummaryByProjectConceptId(pcId);
    }

    @GetMapping(FsSummaryConstant.GET_FS_REPORT_LIST_WHICH_NOT_LINK_WITH_DPP)
    public ResponseWithResults getFsReportListWhichNotLinkWithDpp() {
        return fsSummaryService.getFsReportListWhichNotLinkWithDpp();
    }

    @GetMapping(FsSummaryConstant.GET_FS_REPORT_LIST)
    public ResponseWithResults getFsReportList(@PathVariable("projectConceptMasterUuid") String projectConceptMasterUuid) {
        return fsSummaryService.getFsReportList(projectConceptMasterUuid);
    }

    @PostMapping(FsSummaryConstant.LINK_FS_WITH_DPP)
    public ResponseStatus linkFsWithDpp(@RequestBody FsLinkWithDto fsLinkWithDto) {
        return fsSummaryService.linkFsWithDpp(fsLinkWithDto);
    }


}
