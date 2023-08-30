package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.dpptapp.model.domain.EffectImpact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EffectImpactRepository extends JpaRepository<EffectImpact, Long> {

    EffectImpact findByUuid(String uuid);

    EffectImpact findByProjectConceptUuid(String projectId);

    Optional<EffectImpact> findAllByProjectConceptUuid(String id);

    Optional<EffectImpact> findByProjectConceptMasterId(Long id);
}
