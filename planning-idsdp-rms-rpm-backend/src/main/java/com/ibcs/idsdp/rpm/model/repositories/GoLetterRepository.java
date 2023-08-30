package com.ibcs.idsdp.rpm.model.repositories;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.GoLetter;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcess;

@Repository
public interface GoLetterRepository extends ServiceRepository<GoLetter>{
	
 Optional<GoLetter>	findByInstallmentProcessIdAndIsDeleted(InstallmentProcess installmentProcessId , Boolean isDeleted);

}
