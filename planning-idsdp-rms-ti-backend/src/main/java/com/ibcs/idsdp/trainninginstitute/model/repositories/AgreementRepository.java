package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.trainninginstitute.model.domain.AgreementModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AgreementRepository extends JpaRepository<AgreementModel, Long> {
	
    Page<AgreementModel> findAllByIsDeleted(Boolean isDeleted, Pageable pageable);
    
    List<AgreementModel> findAllByIsDeleted(Boolean isDeleted);

    Optional<AgreementModel> findByIdAndIsDeleted(Long id, Boolean isDeleted);

    Optional<AgreementModel> findAllByUuid(String uuid);

    Optional<AgreementModel> findByIsDeletedAndProposalModel_Id(boolean b, Long id);

    boolean existsByProposalModel_IdAndIsDeleted(Long proposalId, boolean b);
}
