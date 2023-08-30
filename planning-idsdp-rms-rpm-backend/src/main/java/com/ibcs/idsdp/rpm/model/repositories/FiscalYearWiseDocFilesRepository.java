package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.FiscalYearWiseDocFiles;

@Repository
public interface FiscalYearWiseDocFilesRepository extends ServiceRepository<FiscalYearWiseDocFiles>{
	
	List<FiscalYearWiseDocFiles> findAllByStFiscalYearIdAndIsDeleted(Long stFiscalYearId,Boolean isDeleted);

}
