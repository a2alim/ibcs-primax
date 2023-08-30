package com.ibcs.idsdp.common.model.repositories;

import com.ibcs.idsdp.common.model.domain.DashboardAttachment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface DashboardAttachmentRepository extends ServiceRepository<DashboardAttachment> {
    Page<DashboardAttachment> findAllByIsDeletedAndFspMasterId(Boolean isDelete, Long id, Pageable pageable);
}
