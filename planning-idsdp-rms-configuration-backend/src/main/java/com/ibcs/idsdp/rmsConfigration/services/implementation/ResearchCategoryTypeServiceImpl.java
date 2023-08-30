package com.ibcs.idsdp.rmsConfigration.services.implementation;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.CommitteeType;
import com.ibcs.idsdp.rmsConfigration.model.domain.ResearchCategoryType;
import com.ibcs.idsdp.rmsConfigration.model.repositories.ResearchCategoryTypeRepository;
import com.ibcs.idsdp.rmsConfigration.services.ResearchCategoryTypeService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ResearchCategoryTypeRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.util.Response;

@Service
@Transactional

public class ResearchCategoryTypeServiceImpl	extends BaseService<ResearchCategoryType, ResearchCategoryTypeRequestDto, ResearchCategoryTypeResponseDto>
		implements ResearchCategoryTypeService {

	private final ResearchCategoryTypeRepository researchCategoryTypeRepository;

	protected ResearchCategoryTypeServiceImpl(ServiceRepository<ResearchCategoryType> repository,
			ResearchCategoryTypeRepository researchCategoryTypeRepository) {
		super(repository);
		this.researchCategoryTypeRepository = researchCategoryTypeRepository;
	}

	@Override
	public Response<ResearchCategoryTypeResponseDto> createResearchCategoryType(
			ResearchCategoryTypeRequestDto researchCategoryTypeRequestDto) {

		Boolean isExists = isExistsBeforeSave("st_research_category_type", "category_name",
				researchCategoryTypeRequestDto.getCategoryName());

		if (!isExists) {
			return create(researchCategoryTypeRequestDto);
		}
		
		

		return getErrorResponse("Already Exist!.");
	}

	@Override
	public Response<ResearchCategoryTypeResponseDto> updateResearchCategoryType(
			ResearchCategoryTypeRequestDto researchCategoryTypeRequestDto) {
		Boolean isExists = isExistsBeforeUpdate("st_research_category_type", "category_name",
				researchCategoryTypeRequestDto.getId(), researchCategoryTypeRequestDto.getCategoryName());

		if (!isExists) {
			return update(researchCategoryTypeRequestDto);
		}

		return getErrorResponse("Already Exist!.");
	}

	@Override
	public Response<ResearchCategoryType> findAllByActive(boolean isDeleted, boolean isActive) {
		Response<ResearchCategoryType> response = new Response();
		List<ResearchCategoryType> list = researchCategoryTypeRepository.findAllByIsDeletedAndActive(isDeleted, isActive);
		if (!CollectionUtils.isEmpty(list) && list.size() > 0) {
			response.setItems(list);
			return getSuccessResponse("Data Found!", response);
		}
		return getErrorResponse("Data Not Found!");
	}

}
