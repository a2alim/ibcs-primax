package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.ResearchFinalSubmission;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResearchFinalSubmissionRepository extends ServiceRepository<ResearchFinalSubmission> {

    Optional<ResearchFinalSubmission> findByM1ResearcherProposalIdAndIsDeleted(Long m1ResearcherProposalId, Boolean isDeleted);

}
