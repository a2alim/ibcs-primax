package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.EcnecMeeting;
import com.ibcs.idsdp.dpptapp.web.dto.request.EcnecMeetingRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface EcnecMeetingRepository extends ServiceRepository<EcnecMeeting> {

    Page<EcnecMeeting> findAllByIsDeletedOrderByIdDesc(Boolean isDelete, Pageable pageable);

    List<EcnecMeeting> findAllByStatusAndIsDeleted(boolean status, boolean isDeleted);

}
