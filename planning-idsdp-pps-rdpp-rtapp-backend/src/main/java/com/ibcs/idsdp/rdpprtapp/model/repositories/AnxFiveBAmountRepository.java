package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.rdpprtapp.model.domain.AnxFiveBAmount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AnxFiveBAmountRepository extends JpaRepository<AnxFiveBAmount, Long> {
    Optional<AnxFiveBAmount> findByProjectConceptUuid(String proConceptId);
}
