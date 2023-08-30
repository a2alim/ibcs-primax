package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.CategoryPerEnvironmentConservationRules;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryEnvironmentRepository extends ServiceRepository<CategoryPerEnvironmentConservationRules> {

    List<CategoryPerEnvironmentConservationRules> findAllByStatus(boolean status);

    List<CategoryPerEnvironmentConservationRules> findAllByStatusAndIsDeleted(boolean status, boolean isDeleted);

    Optional<CategoryPerEnvironmentConservationRules> findAllByUuid(String Uuid);

}
