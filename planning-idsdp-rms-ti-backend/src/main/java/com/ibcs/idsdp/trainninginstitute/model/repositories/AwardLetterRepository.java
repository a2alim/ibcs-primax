package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.trainninginstitute.model.domain.AwardLetterModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AwardLetterRepository extends JpaRepository<AwardLetterModel, Long> {
    Page<AwardLetterModel> findAllByProposalModel_TrainingInstituteProfileModel_IdAndIsDeleted(String loggedUserId, boolean b, Pageable pageable);

    Page<AwardLetterModel> findAllByIsDeleted(Pageable pageable, boolean b);

    AwardLetterModel findByFiscalYearIdAndProposalModelAndIsDeleted(Long fiscalYearId, ProposalModel proposalModel, boolean b);
}
