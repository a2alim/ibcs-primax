package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.EcnecMeetingConstant;
import com.ibcs.idsdp.dpptapp.constants.TermOfReferenceReportConstant;
import com.ibcs.idsdp.dpptapp.model.domain.EcnecMeeting;
import com.ibcs.idsdp.dpptapp.model.domain.TermOfReferenceReport;
import com.ibcs.idsdp.dpptapp.services.EcnecMeetingService;
import com.ibcs.idsdp.dpptapp.services.TermOfReferenceReportService;
import com.ibcs.idsdp.dpptapp.web.dto.request.EcnecMeetingRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.TermOfReferenceReportRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(TermOfReferenceReportConstant.TERM_OF_REFERENCE_REPORT)
public class TermOfReferenceReportController extends BaseController<TermOfReferenceReport, TermOfReferenceReportRequest> {

    private final TermOfReferenceReportService service;

    public TermOfReferenceReportController(BaseService<TermOfReferenceReport, TermOfReferenceReportRequest> service, TermOfReferenceReportService service1) {
        super(service);
        this.service = service1;
    }

    /**
     * For Getting TermOfReferenceReport
     *
     * @param pcUuid
     * @return
     */
    @GetMapping(value = TermOfReferenceReportConstant.FIND_BY_PCUUID_AND_REPORT_INDEX+"/{pcUuid}"+"/{reportIndex}", produces = "application/json")
    public TermOfReferenceReport findByPcUuidAndReportIndex(@PathVariable String pcUuid, @PathVariable long reportIndex){
        return service.findByPcUuidAndReportIndex(pcUuid, reportIndex);
    }
}
