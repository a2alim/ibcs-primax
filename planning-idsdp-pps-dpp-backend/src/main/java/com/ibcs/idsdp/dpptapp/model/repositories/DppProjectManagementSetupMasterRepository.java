package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.dpptapp.model.domain.DppProjectManagementSetupMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DppProjectManagementSetupMasterRepository extends JpaRepository<DppProjectManagementSetupMaster, Long> {
    Optional<DppProjectManagementSetupMaster> findByProjectConceptUuid(String uuid);
    Optional<DppProjectManagementSetupMaster> findByProjectConceptId(Long id);
}
