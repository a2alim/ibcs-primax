package com.ibcs.idsdp.feasibilitystudy.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.feasibilitystudy.model.domain.Committee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface CommitteeRepository extends ServiceRepository<Committee> {
    Page<Committee> findAllByFspMasterIdAndIsDeletedOrderByIdDesc(Long fspMasterId, Boolean isDeleted, Pageable pageable);
}
