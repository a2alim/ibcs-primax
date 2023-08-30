package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.model.domain.ResearchCategoryType;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ResearchCategoryTypeRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ResearchCategoryTypeService {

	Response<ResearchCategoryTypeResponseDto> createResearchCategoryType(
			ResearchCategoryTypeRequestDto researchCategoryTypeRequestDto);

	Response<ResearchCategoryTypeResponseDto> updateResearchCategoryType(
			ResearchCategoryTypeRequestDto researchCategoryTypeRequestDto);

	Response<ResearchCategoryType> findAllByActive(boolean isDeleted, boolean isActive);

}
