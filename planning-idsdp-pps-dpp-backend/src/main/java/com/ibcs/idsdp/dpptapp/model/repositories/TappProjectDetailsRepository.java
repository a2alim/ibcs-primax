package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.dpptapp.model.domain.TappProjectDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TappProjectDetailsRepository extends JpaRepository<TappProjectDetails, Long> {
    Optional<TappProjectDetails> findByUuid(String uuid);
    Optional<TappProjectDetails> findByPcUuid(String pcUuid);
}
