package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcess;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcessExpenditureItems;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstallmentProcessExpenditureItemsRepository extends ServiceRepository<InstallmentProcessExpenditureItems> {

    List<InstallmentProcessExpenditureItems> findByM2InstallmentProcessId(InstallmentProcess installmentProcess);
 
    List<InstallmentProcessExpenditureItems> findAllByM2InstallmentProcessIdAndIsDeleted(InstallmentProcess installmentProcess, boolean isDeleted);
}
