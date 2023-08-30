package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Municipality;

import java.util.List;
import java.util.Set;

public interface MunicipalityRepository extends ServiceRepository<Municipality> {

    List<Municipality> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);

    List<Municipality> findAllByUpaZillaIdAndStatusAndIsDeleted(Long upazilaId, Boolean status, Boolean isDelete);

    List<Municipality> findAllByUpaZillaIdInAndStatusAndIsDeleted(Set<Long> upazilaId, Boolean status, Boolean isDelete);
}
