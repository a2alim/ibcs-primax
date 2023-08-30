package com.ibcs.idsdp.common.model.repositories;

import com.ibcs.idsdp.common.model.domain.DashboardAttachment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DashboardAttachmentRepository extends ServiceRepository<DashboardAttachment> {
    Page<DashboardAttachment> findAllByIsDeletedAndProjectSummaryIdAndProjectTypeOrderByIdDesc(Boolean isDelete, Long id, String projectType, Pageable pageable);
    List<DashboardAttachment> findAllByIsDeletedAndProjectSummaryIdAndProjectType(Boolean isDelete, Long id, String projectType);
    Page<DashboardAttachment> findAllByRdppRtappMasterIdAndProjectTypeAndIsDeletedOrderByIdDesc(Long RdppRtappMasterId, String projectType, Boolean isDeleted, Pageable pageable);
}
