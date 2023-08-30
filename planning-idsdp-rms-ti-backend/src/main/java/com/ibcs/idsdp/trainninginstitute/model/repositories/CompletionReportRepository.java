package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.trainninginstitute.model.domain.CompletionReportModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompletionReportRepository extends JpaRepository<CompletionReportModel, Long> {

    Page<CompletionReportModel> findByIsDeletedAndCreatedBy(boolean b, String loggedUserId, Pageable pageable);

    Page<CompletionReportModel> findAllByIsDeleted(boolean b, Pageable pageable);

    Optional<CompletionReportModel> findByIsDeletedAndId(boolean b, Long completionReportId);

    boolean existsByProposalModel_IdAndIsDeleted(Long proposalId, boolean b);
}
