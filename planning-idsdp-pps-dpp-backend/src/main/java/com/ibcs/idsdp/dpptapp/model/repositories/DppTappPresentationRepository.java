package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.dpptapp.model.domain.DppTappPresentation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DppTappPresentationRepository extends JpaRepository<DppTappPresentation, Long> {
    List<DppTappPresentation> findBySourceIdAndSourceModule(Long sourceId, String sourceModule);

}
