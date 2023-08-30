package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappTermOfReference;

import java.util.Optional;


public interface TappTermOfReferenceRepository extends ServiceRepository<TappTermOfReference> {

    Optional<TappTermOfReference> findByProjectConceptUuid(String id);
};
