package com.ibcs.idsdp.rpm.model.repositories;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.model.domain.PresentationReport;

@Repository
public interface PresentationReportRepository extends ServiceRepository<PresentationReport> {

	Optional<PresentationReport> findByCreateSeminarAndIsDeleted(CreateSeminar createSeminar, Boolean isDeleted);
	Boolean existsByCreateSeminar(CreateSeminar createSeminar);
	
}
