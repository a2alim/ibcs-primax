package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.trainninginstitute.model.domain.GuarantorModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GuarantorRepository extends JpaRepository<GuarantorModel, Long> {
    Page<GuarantorModel> findByIsDeleted(boolean b, Pageable pageable);

    Page<GuarantorModel> findByIsDeletedAndGuarantorNameContainsIgnoreCase(boolean b, String GuarantorName, Pageable pageable);

    Optional<GuarantorModel> findByIsDeletedAndId(boolean b, Long guarantorId);

    Optional<GuarantorModel> getAllById(Long courseId);

    boolean existsByIsDeletedAndProposalModel(boolean b, ProposalModel proposalModel);

    Optional<GuarantorModel> findByIsDeletedAndProposalModel_Id(boolean b, Long proposalId);
}
