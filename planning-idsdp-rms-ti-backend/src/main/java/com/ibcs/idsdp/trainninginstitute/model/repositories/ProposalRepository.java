package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProposalRepository extends ServiceRepository<ProposalModel> {

    Page<ProposalModel> findAllByIsDeleted(Boolean isDeleted, Pageable pageable);

    List<ProposalModel> findAllByIsDeleted(Boolean isDeleted);

    Optional<ProposalModel> findByIsDeletedAndId(Boolean isDeleted, Long id);

    Optional<ProposalModel> findAllByUuid(String uuid);

    Optional<ProposalModel> findByIdAndIsDeleted(Long id, Boolean isDeleted);

    boolean existsByIsDeletedAndFiscalYearIdAndTrainingInstituteProfileModel_Id(Boolean isDeleted, Long fiscalYearId, Long id);

    Page<ProposalModel> findByIsDeletedAndTrainingInstituteProfileModel_Id(Boolean isDeleted, Long id, Pageable pageable);

    Page<ProposalModel> findByIsDeletedAndTrainingInstituteProfileModel_IdAndIsShortListed(Boolean isDeleted, Long m3TrainingInstituteProfileId_id, Boolean isShortListed, Pageable pageable);

    Page<ProposalModel> findAllByIsDeletedAndTrainingInstituteProfileModel_Id(boolean b, Long trainingInstituteId, Pageable pageable);

    Page<ProposalModel> findAllByIsDeletedAndIsShortListed(boolean b, Boolean isShortListed, Pageable pageable);

    Page<ProposalModel> findByIsDeletedAndIsShortListedAndFiscalYearId(@Nullable Boolean isDeleted, @Nullable Boolean isShortListed, @Nullable Long fiscalYearId, Pageable pageable);

    List<ProposalModel> findAllByIsDeletedAndFiscalYearId(Boolean isDeleted, Long fiscalYearId);

    List<ProposalModel> findAllByIsDeletedAndFiscalYearIdAndIsSubmitted(Boolean isDeleted, Long fiscalYearId, Boolean isSubmitted);

    List<ProposalModel> findAllByIsDeletedAndIsSubmitted(Boolean isDeleted, Boolean isSubmitted);

    List<ProposalModel> findAllByTrainingInstituteProfileModel_IdAndIsDeletedAndIsSubmitted(Long id, boolean b, boolean b1);
    //trainingInstituteProfileModel
    Page<ProposalModel> findAllByIsSubmittedAndIsDeletedOrderByIdDesc(Boolean isSubmitted, Boolean isDeleted, Pageable pageable);
    Page<ProposalModel> findAllByCreatedByAndIsDeletedOrderByIdDesc(String createdBy, Boolean isDeleted, Pageable pageable);
}
