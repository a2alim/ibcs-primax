package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.dpptapp.model.domain.AssignEcnecMeeting;
import com.ibcs.idsdp.dpptapp.model.domain.EcnecMeeting;
import com.ibcs.idsdp.dpptapp.model.repositories.AssignEcnecMeetingRepository;
import com.ibcs.idsdp.dpptapp.web.dto.request.AssignEcnecMeetingRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.EcnecMeetingRequest;
import com.ibcs.idsdp.dpptapp.web.dto.response.AssignEcnecMeetingListResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AssignEcnecMeetingService {

    AssignEcnecMeetingRequest createAssingMeeting(AssignEcnecMeetingRequest request);

    AssignEcnecMeeting findByPcUuidAndIsDeleted(String pcUuid);

    ResponseEntity<ResponseStatus> deleteAssignMeeting(String pcUuid);

    List<AssignEcnecMeetingListResponse> findAllByMeetingId(long meetingId);


}
