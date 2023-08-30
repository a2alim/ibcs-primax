package com.ibcs.idsdp.rmsConfigration.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.PredefineTemplate;
import com.ibcs.idsdp.rmsConfigration.model.repositories.PredefineTemplateRepository;
import com.ibcs.idsdp.rmsConfigration.model.repositories.TemplateTypeRepository;
import com.ibcs.idsdp.rmsConfigration.services.PredefineTemplateService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.PredefineTemplateRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.PredefineTemplateResponseDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.TemplateTypeResponseDto;
import com.ibcs.idsdp.util.Response;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;


@Service
@Transactional
public class PredefineTemplateServiceImpl extends BaseService<PredefineTemplate, PredefineTemplateRequestDto, PredefineTemplateResponseDto> implements PredefineTemplateService {

    private final PredefineTemplateRepository repository;
    private final TemplateTypeRepository templateTypeRepository;

    public PredefineTemplateServiceImpl(ServiceRepository<PredefineTemplate> repository, PredefineTemplateRepository repository1, TemplateTypeRepository templateTypeRepository) {
        super(repository);
        this.repository = repository1;
        this.templateTypeRepository = templateTypeRepository;
    }

    @Override
    protected PredefineTemplateResponseDto convertForRead(PredefineTemplate predefineTemplate) {
        PredefineTemplateResponseDto dto = super.convertForRead(predefineTemplate);
        dto.setTemplateTypeDto(new ModelMapper().map(templateTypeRepository.findByIdAndIsDeleted(Long.valueOf(predefineTemplate.getTemplateTypeId()), false), TemplateTypeResponseDto.class));
        return dto;
    }

    @Override
    public Response<PredefineTemplateResponseDto> createPredefineTemplate(PredefineTemplateRequestDto predefineTemplateRequestDto) {
        Boolean isExists = isExistsBeforeSave("st_predefined_template", "subject",
                predefineTemplateRequestDto.getSubject());

        if (!isExists) {
            return create(predefineTemplateRequestDto);
        }

        return getErrorResponse("Already Exist!.");
    }

    @Override
    public Response<PredefineTemplateResponseDto> updatePredefineTemplate(PredefineTemplateRequestDto predefineTemplateRequestDto) {
        Boolean isExists = isExistsBeforeUpdate("st_predefined_template", "subject",
                predefineTemplateRequestDto.getId(), predefineTemplateRequestDto.getSubject());

        if (!isExists) {
            return update(predefineTemplateRequestDto);
        }

        return getErrorResponse("Already Exist!.");

    }

    @Override
    public Response<PredefineTemplate> getActiveById(Integer id) {
     List<PredefineTemplate> templateList= repository.findAllByTemplateTypeIdAndIsDeletedAndActive(id,false,true);
        Response<PredefineTemplate> response=new Response<>();
        if (templateList.isEmpty()) {
            return getErrorResponse("Data Not found");
        }
        response.setSuccess(true);
        response.setMessage("Data Found");
        response.setItems(templateList);
        return response;
    }

    @Override
    public Response<PredefineTemplateResponseDto> getByTemplateTypeId(Integer templateTypeId) {
        Response<PredefineTemplateResponseDto> response = new Response<>();
        List<PredefineTemplate> list = repository.findByTemplateTypeIdAndIsDeleted(templateTypeId, false);

        if (list.isEmpty()) {
            return getErrorResponse("Data Mot found");
        }

        response.setSuccess(true);
        response.setMessage("Data Found");
        response.setItems(convertForRead(list));
        return response;
    }

	@Override
	public Response<PredefineTemplateResponseDto> findById(Long id) {
		return this.getById(id);
	}

    
}
