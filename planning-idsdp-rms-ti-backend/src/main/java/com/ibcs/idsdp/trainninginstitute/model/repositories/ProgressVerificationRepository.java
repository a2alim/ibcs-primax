package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.trainninginstitute.model.domain.ProgressVerificationModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProgressVerificationRepository extends JpaRepository<ProgressVerificationModel, Long> {

    Page<ProgressVerificationModel> findAllByIsDeleted(Boolean isDeleted, Pageable pageable);

    Optional<ProgressVerificationModel> findByIdAndIsDeleted(Long progressVerificationId, boolean b);
}
