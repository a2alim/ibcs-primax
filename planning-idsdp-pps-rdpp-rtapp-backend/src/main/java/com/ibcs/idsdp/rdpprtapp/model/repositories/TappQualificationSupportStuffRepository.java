package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappQualificationOfSupportStaff;

import java.util.Optional;

public interface TappQualificationSupportStuffRepository extends ServiceRepository<TappQualificationOfSupportStaff> {

    Optional<TappQualificationOfSupportStaff> findAllByProjectConceptUuidAndIsDeleted(String pcUuid, boolean delete);
}
