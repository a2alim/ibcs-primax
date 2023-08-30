package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.TappQualificationOfSupportStaff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TappQualificationSupportStuffRepository extends ServiceRepository<TappQualificationOfSupportStaff> {

    Optional<TappQualificationOfSupportStaff> findAllByProjectConceptUuidAndIsDeleted(String pcUuid, boolean delete);
}
