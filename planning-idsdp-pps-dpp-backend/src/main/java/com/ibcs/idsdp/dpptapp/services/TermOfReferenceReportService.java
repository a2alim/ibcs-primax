package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.dpptapp.model.domain.AssignEcnecMeeting;
import com.ibcs.idsdp.dpptapp.model.domain.TermOfReferenceReport;
import com.ibcs.idsdp.dpptapp.web.dto.request.AssignEcnecMeetingRequest;
import com.ibcs.idsdp.dpptapp.web.dto.response.AssignEcnecMeetingListResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface TermOfReferenceReportService {
    TermOfReferenceReport findByPcUuidAndReportIndex(String pcUuid, long reportIndex);

}
