package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcess;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcessUploadBillVoucherFiles;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstallmentProcessUploadBillVoucherFilesRepository extends ServiceRepository<InstallmentProcessUploadBillVoucherFiles> {

    List<InstallmentProcessUploadBillVoucherFiles> findByM2InstallmentProcessId(InstallmentProcess byId);
}
