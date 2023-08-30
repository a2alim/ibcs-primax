package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.TappWorkSchedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface TappWorkScheduleRepository extends ServiceRepository<TappWorkSchedule> {

    Page<TappWorkSchedule> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    TappWorkSchedule findByIdAndIsDeleted(Long id, Boolean isDelete);

    List<TappWorkSchedule> findAllByTappMasterIdAndIsDeletedOrderById(Long rtappMasterId, Boolean isDeleted);

}
