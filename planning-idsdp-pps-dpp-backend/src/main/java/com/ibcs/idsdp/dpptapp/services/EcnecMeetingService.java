package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.model.domain.EcnecMeeting;
import com.ibcs.idsdp.dpptapp.web.dto.request.EcnecMeetingRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface EcnecMeetingService {

    Page<EcnecMeetingRequest> getActiveMeeting(PageableRequestBodyDTO pageableRequestBodyDTO);

    List<EcnecMeeting> getActiveList();

}
