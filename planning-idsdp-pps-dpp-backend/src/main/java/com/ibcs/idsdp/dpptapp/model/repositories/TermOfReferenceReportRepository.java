package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.AssignEcnecMeeting;
import com.ibcs.idsdp.dpptapp.model.domain.TermOfReferenceReport;

import java.util.List;


public interface TermOfReferenceReportRepository extends ServiceRepository<TermOfReferenceReport> {

    TermOfReferenceReport findByPcUuidAndReportIndexAndIsDeleted(String pcUuid, long reportIndex, boolean isDeleted);
}
