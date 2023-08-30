package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.trainninginstitute.model.domain.GOLetterOldModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GOLetterOldRepository extends JpaRepository<GOLetterOldModel, Long> {

    Optional<GOLetterOldModel> findByIdAndIsDeleted(Long id, boolean b);
}
