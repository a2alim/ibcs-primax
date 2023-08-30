package com.ibcs.idsdp.rmsConfigration.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.TemplateType;
import com.ibcs.idsdp.rmsConfigration.model.repositories.TemplateTypeRepository;
import com.ibcs.idsdp.rmsConfigration.services.TemplateTypeService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.TemplateTypeRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.InstallmentTypeResponseDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.TemplateTypeResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.transaction.Transactional;
import java.util.List;


@Service
@Transactional

public class TemplateTypeServiceImpl extends BaseService<TemplateType, TemplateTypeRequestDto, TemplateTypeResponseDto>	implements TemplateTypeService {

	private final TemplateTypeRepository templateTypeRepository;

	public TemplateTypeServiceImpl(ServiceRepository<TemplateType> repository, TemplateTypeRepository templateTypeRepository) {
		super(repository);
		this.templateTypeRepository = templateTypeRepository;
	}

	@Override
	public Response<TemplateTypeResponseDto> createTemplateType(TemplateTypeRequestDto templateTypeRequestDto) {
		Boolean isExists = isExistsBeforeSave("st_template_type", "template_type",
				templateTypeRequestDto.getTemplateType());

		if (!isExists) {
			return create(templateTypeRequestDto);
		}

		return getErrorResponse("Already Exist!.");
	}

	@Override
	public Response<TemplateTypeResponseDto> updateTemplateType(TemplateTypeRequestDto templateTypeRequestDto) {
		Boolean isExists = isExistsBeforeUpdate("st_template_type", "template_type",
				templateTypeRequestDto.getId(), templateTypeRequestDto.getTemplateType());

		if (!isExists) {
			return update(templateTypeRequestDto);
		}

		return getErrorResponse("Already Exist!.");
	}

	@Override
	public Response<TemplateType> findAllByActive(boolean isDeleted, boolean isActive) {
		Response<TemplateType> response = new Response();
		List<TemplateType> list=templateTypeRepository.findAllByIsDeletedAndActive(isDeleted,isActive);
		if (!CollectionUtils.isEmpty(list) && list.size() > 0) {
			response.setItems(list);
			return getSuccessResponse("Data Found!", response);
		}
		return getErrorResponse("Data Not Found!");
	}

	@Override
	public Response<TemplateTypeResponseDto> findById(Long id) {
		return this.getById(id);
	}

	
}
