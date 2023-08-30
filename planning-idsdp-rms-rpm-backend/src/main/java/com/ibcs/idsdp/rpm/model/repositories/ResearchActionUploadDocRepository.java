package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.ResearchActionUploadDoc;

@Repository
public interface ResearchActionUploadDocRepository extends ServiceRepository<ResearchActionUploadDoc> {

	List<ResearchActionUploadDoc> findAllByTakeActionForResearchIdAndIsDeleted(Long takeActionForResearchId,
			Boolean isDeleted);
}
