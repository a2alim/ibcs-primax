package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.ResearchExperience;
import com.ibcs.idsdp.rpm.model.domain.StCategoryWiseActionPlan;
import com.ibcs.idsdp.rpm.web.dto.response.StCategoryWiseActionPlanResponseDto;

import java.util.List;

public interface StCategoryWiseActionPlanRepository extends ServiceRepository<StCategoryWiseActionPlan> {
    List<StCategoryWiseActionPlan> findAllByStFiscalYearIdAndStResearchCategoryTypeIdAndIsActiveAndIsDeleted(Long stFiscalYearId, Long stResearchCategoryTypeId, Boolean isActive, Boolean isDeleted );
}
