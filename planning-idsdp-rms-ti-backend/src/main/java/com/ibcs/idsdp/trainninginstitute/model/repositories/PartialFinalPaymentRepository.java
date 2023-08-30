package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.trainninginstitute.model.domain.PartialFinalPaymentModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PartialFinalPaymentRepository extends JpaRepository<PartialFinalPaymentModel, Long> {

    Page<PartialFinalPaymentModel> findAllByIsDeleted( boolean isDeleted, Pageable pageable);

    Optional<PartialFinalPaymentModel> findByIdAndIsDeleted(Long id, boolean b);

    List<PartialFinalPaymentModel> findAllByIsDeletedAndProposalModel_Id(boolean isDeleted, Long proposalId);
}
