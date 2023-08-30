package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.model.domain.AssignEcnecMeeting;
import com.ibcs.idsdp.dpptapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.dpptapp.model.domain.EcnecMeeting;
import com.ibcs.idsdp.dpptapp.model.domain.TermOfReferenceReport;
import com.ibcs.idsdp.dpptapp.model.repositories.AssignEcnecMeetingRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.EcnecMeetingRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.TermOfReferenceReportRepository;
import com.ibcs.idsdp.dpptapp.services.AssignEcnecMeetingService;
import com.ibcs.idsdp.dpptapp.services.TermOfReferenceReportService;
import com.ibcs.idsdp.dpptapp.web.dto.request.AssignEcnecMeetingRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.TermOfReferenceReportRequest;
import com.ibcs.idsdp.dpptapp.web.dto.response.AssignEcnecMeetingListResponse;
import com.ibcs.idsdp.dpptapp.web.dto.response.DetailsEstimatedCostResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class TermOfReferenceReportServiceImpl extends BaseService<TermOfReferenceReport, TermOfReferenceReportRequest> implements TermOfReferenceReportService {

    private TermOfReferenceReportRepository reportRepository;
    private IdGeneratorComponent idGeneratorComponent;

    public TermOfReferenceReportServiceImpl(ServiceRepository<TermOfReferenceReport> repository, TermOfReferenceReportRepository reportRepository, IdGeneratorComponent idGeneratorComponent) {
        super(repository);
        this.reportRepository = reportRepository;
        this.idGeneratorComponent = idGeneratorComponent;
    }

    @Override
    protected TermOfReferenceReport convertForCreate(TermOfReferenceReportRequest termOfReferenceReportRequest) {
        return super.convertForCreate(termOfReferenceReportRequest);
    }

    @Override
    protected void convertForUpdate(TermOfReferenceReportRequest termOfReferenceReportRequest, TermOfReferenceReport termOfReferenceReport) {
        super.convertForUpdate(termOfReferenceReportRequest, termOfReferenceReport);
    }

    @Override
    public TermOfReferenceReport findByPcUuidAndReportIndex(String pcUuid, long reportIndex){
        TermOfReferenceReport termOfReferenceReport = reportRepository.findByPcUuidAndReportIndexAndIsDeleted(pcUuid, reportIndex, false);
        return termOfReferenceReport;
    }
}
