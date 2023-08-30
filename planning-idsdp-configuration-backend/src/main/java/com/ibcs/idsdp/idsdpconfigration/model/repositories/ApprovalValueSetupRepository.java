package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ApprovalValueSetup;

import java.util.List;

public interface ApprovalValueSetupRepository extends ServiceRepository<ApprovalValueSetup> {

    List<ApprovalValueSetup> findAllByStatus(Boolean status);

}
