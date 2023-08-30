package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.NewMember;
import com.ibcs.idsdp.rpm.model.domain.ResearcherPresentation;

@Repository
public interface NewMemberRepository extends ServiceRepository<NewMember>{
	
	List<NewMember> findAllByResearcherPresentationIdAndIsDeleted(Long m2ResearcherPresentationId, Boolean isDeleted);
}
