package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.AssignEcnecMeeting;
import com.ibcs.idsdp.dpptapp.model.domain.EcnecMeeting;
import com.ibcs.idsdp.dpptapp.web.dto.request.AssignEcnecMeetingRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface AssignEcnecMeetingRepository extends ServiceRepository<AssignEcnecMeeting> {

    AssignEcnecMeeting findByPcUuidAndIsDeleted(String pcUuid, boolean isDeleted);

    List<AssignEcnecMeeting> findAllByMeetingIdAndIsDeleted(long meetingId, boolean isDeleted);

}
