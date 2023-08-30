package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.model.domain.ResearchCategoryType;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.CategoryWiseDeskOfficerRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.util.Response;

public interface CategoryWiseDeskOfficerService {


    Response<ResearchCategoryTypeResponseDto> createCategoryWiseDeskOfficer(CategoryWiseDeskOfficerRequestDto categoryWiseDeskOfficerRequestDto);

    Response<ResearchCategoryTypeResponseDto> updateCategoryWiseDeskOfficer(CategoryWiseDeskOfficerRequestDto categoryWiseDeskOfficerRequestDto);
    
    Response<ResearchCategoryType> findAllByActive(boolean isDeleted, boolean isActive);

}
