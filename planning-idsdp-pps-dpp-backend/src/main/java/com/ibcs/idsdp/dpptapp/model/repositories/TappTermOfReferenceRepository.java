package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.TappTermOfReference;

import java.util.List;
import java.util.Optional;


public interface TappTermOfReferenceRepository extends ServiceRepository<TappTermOfReference> {

    Optional<TappTermOfReference> findByProjectConceptUuid(String id);
};
