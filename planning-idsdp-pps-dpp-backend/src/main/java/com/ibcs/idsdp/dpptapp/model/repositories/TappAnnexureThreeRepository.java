package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.TappAnnexureThree;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;


public interface TappAnnexureThreeRepository extends ServiceRepository<TappAnnexureThree> {

    Optional<TappAnnexureThree> findByUuid(String id);

    List<TappAnnexureThree> findAllByProjectConceptUuidAndIsDeleted(String id, Boolean isDelete);
};
