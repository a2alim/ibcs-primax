package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.rpm.model.domain.notApplicable.NotApplicableForms;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotApplicableFormsRepository extends JpaRepository<NotApplicableForms, Long> {

    Optional<NotApplicableForms> findByM1ResearcherProfilePersonalInfoIdAndModelName(Long m1ResearcherProfilePersonalInfoId, String modelName);
}
