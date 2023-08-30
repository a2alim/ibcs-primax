package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.TppAnnexureSaven;

import java.util.Optional;

public interface TppAnnexureSavenRepository extends ServiceRepository<TppAnnexureSaven> {
    Optional<TppAnnexureSaven> findByUuid(String uuid);
    TppAnnexureSaven findByProjectConceptUuid(String uuid);


}
