package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.idsdpconfigration.web.dto.CategoryPerEnvironmentConservationRulesDTO;

import java.util.List;

public interface CategoryEnvironmentService {

    List<CategoryPerEnvironmentConservationRulesDTO> getAllActiveCategoryEnvironmentList();
}
