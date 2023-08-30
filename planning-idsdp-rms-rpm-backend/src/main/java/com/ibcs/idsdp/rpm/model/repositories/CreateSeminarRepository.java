package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;

@Repository
public interface CreateSeminarRepository extends ServiceRepository<CreateSeminar> {
	
	@Query(value = "select DISTINCT  c.st_fiscal_year_id from m2_create_seminar c",nativeQuery = true)
	Set<Long> findAllStFiscalYearId();

}
