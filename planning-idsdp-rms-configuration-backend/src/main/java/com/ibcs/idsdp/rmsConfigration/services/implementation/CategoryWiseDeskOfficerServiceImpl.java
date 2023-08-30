package com.ibcs.idsdp.rmsConfigration.services.implementation;

import java.util.Collections;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.CategoryWiseDeskOfficer;
import com.ibcs.idsdp.rmsConfigration.model.domain.ResearchCategoryType;
import com.ibcs.idsdp.rmsConfigration.model.repositories.ResearchCategoryTypeRepository;
import com.ibcs.idsdp.rmsConfigration.services.CategoryWiseDeskOfficerService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.CategoryWiseDeskOfficerRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.CategoryWiseDeskOfficerResponseDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.util.Response;

@Service
@Transactional
public class CategoryWiseDeskOfficerServiceImpl extends
		BaseService<CategoryWiseDeskOfficer, CategoryWiseDeskOfficerRequestDto, CategoryWiseDeskOfficerResponseDto>
		implements CategoryWiseDeskOfficerService {

	private final ResearchCategoryTypeRepository researchCategoryTypeRepository;

	protected CategoryWiseDeskOfficerServiceImpl(ServiceRepository<CategoryWiseDeskOfficer> repository,
			ResearchCategoryTypeRepository researchCategoryTypeRepository) {
		super(repository);
		this.researchCategoryTypeRepository = researchCategoryTypeRepository;

	}

	@Override
	public Response<ResearchCategoryTypeResponseDto> createCategoryWiseDeskOfficer(
			CategoryWiseDeskOfficerRequestDto categoryWiseDeskOfficerRequestDto) {

		return create(categoryWiseDeskOfficerRequestDto);
	}

	@Override
	public Response<ResearchCategoryTypeResponseDto> updateCategoryWiseDeskOfficer(
			CategoryWiseDeskOfficerRequestDto categoryWiseDeskOfficerRequestDto) {

		return update(categoryWiseDeskOfficerRequestDto);
	}

	@Override
	public Response<ResearchCategoryType> findAllByActive(boolean isDeleted, boolean isActive) {

		Response<ResearchCategoryType> response = new Response();
		List<ResearchCategoryType> list = researchCategoryTypeRepository.findAllByIsDeletedAndActive(isDeleted,isActive);
		if(!CollectionUtils.isEmpty(list)&& list.size()>0) {
			response.setItems(list);
			return getSuccessResponse("Data Found!",response);
		}
		return getErrorResponse("Data Not Found!");
	}

}
