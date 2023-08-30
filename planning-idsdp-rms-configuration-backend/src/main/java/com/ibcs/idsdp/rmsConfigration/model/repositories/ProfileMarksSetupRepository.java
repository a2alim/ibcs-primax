package com.ibcs.idsdp.rmsConfigration.model.repositories;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.ProfileMarksSetup;

@Repository
public interface ProfileMarksSetupRepository extends ServiceRepository<ProfileMarksSetup> {

	Optional<ProfileMarksSetup> findByStResearchCatTypeIdAndIsDeleted(Long stResearchCatTypeId, Boolean isDeleted);
	Optional<ProfileMarksSetup> findByResearchCategoryAndIsDeleted(String researchCategory, Boolean isDeleted);

}
