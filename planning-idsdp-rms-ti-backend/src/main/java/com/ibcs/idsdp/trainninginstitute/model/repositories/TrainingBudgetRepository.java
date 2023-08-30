package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingBudgetModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TrainingBudgetRepository extends JpaRepository<TrainingBudgetModel, Long> {
	
    Page<TrainingBudgetModel> findAllByIsDeleted(Boolean isDeleted, Pageable pageable);
    
    Page<TrainingBudgetModel> findAllByIsDeletedAndProposalModel(Boolean isDeleted, Pageable pageable, ProposalModel proposalModel);

    Optional<TrainingBudgetModel> findByIdAndIsDeleted(Long id, Boolean isDeleted);

    List<TrainingBudgetModel> findAllByFiscalYearId(Long fiscalId);

    List<TrainingBudgetModel> findAllByFiscalYearIdAndIsDeleted(Long fiscalId, boolean isDeleted);

    List<TrainingBudgetModel> findByFiscalYearIdAndIsDeletedAndM3TrainingInstituteProfileId_UserId(Long fiscalYearId, Boolean isDeleted, String userId, Sort sort);


    List<TrainingBudgetModel> findByProposalModel_IdAndIsDeleted(Long proposalId, boolean b, Sort sort);

    List<TrainingBudgetModel> findAllByProposalModel_IdAndIsDeleted(Long id, boolean b);
}
