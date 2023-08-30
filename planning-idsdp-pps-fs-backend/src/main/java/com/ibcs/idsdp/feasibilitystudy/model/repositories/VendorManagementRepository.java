package com.ibcs.idsdp.feasibilitystudy.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.feasibilitystudy.model.domain.VendorManagement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VendorManagementRepository extends ServiceRepository<VendorManagement> {
    Page<VendorManagement> findAllByFspMasterIdAndIsDeletedOrderByIdDesc(Long fspMasterId, Boolean isDeleted, Pageable pageable);
}
