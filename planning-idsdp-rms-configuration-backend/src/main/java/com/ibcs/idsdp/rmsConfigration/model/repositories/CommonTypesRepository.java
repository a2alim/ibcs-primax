package com.ibcs.idsdp.rmsConfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.CommonTypes;
import org.springframework.data.jpa.repository.QueryHints;

import javax.persistence.QueryHint;
import java.util.List;
import java.util.Optional;

public interface CommonTypesRepository extends ServiceRepository<CommonTypes> {

    @QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))

    long countByTypeNameAndForTypeAndIsDeleted(String typeName, String forType, Boolean isDelete);

    Optional<CommonTypes> findByTypeNameAndForTypeAndIsDeleted(String typeName, String forType, Boolean isDelete);

    List<CommonTypes> findByTypeNoAndIsDeleted(Integer typeNo, Boolean isDelete);
}
