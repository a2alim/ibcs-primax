package com.ibcs.idsdp.trainninginstitute.services.implementation;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.trainninginstitute.client.RmsConfigurationClientService;
import com.ibcs.idsdp.trainninginstitute.model.domain.GoLetter;
import com.ibcs.idsdp.trainninginstitute.model.domain.PartialFinalPaymentNewModel;
import com.ibcs.idsdp.trainninginstitute.model.repositories.GoLetterRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.PartialFinalPaymentNewRepository;
import com.ibcs.idsdp.trainninginstitute.services.GoLetterService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.GoLetterRequstDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.GoLetterResponseDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PredefineTemplateResponseDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TemplateTypeResponseDto;
import com.ibcs.idsdp.util.Response;

@Service
public class GoLetterServiceImpl extends BaseService<GoLetter, GoLetterRequstDto, GoLetterResponseDto>	implements GoLetterService {

	private final GoLetterRepository goLetterRepository;
	private final MinioServerService minioServerService;
	private final RmsConfigurationClientService rmsConfigurationClientService;
	private final PartialFinalPaymentNewRepository finalPaymentNewRepository;

	protected GoLetterServiceImpl(ServiceRepository<GoLetter> repository, GoLetterRepository goLetterRepository,
			MinioServerService minioServerService, RmsConfigurationClientService rmsConfigurationClientService,
			PartialFinalPaymentNewRepository finalPaymentNewRepository) {
		super(repository);
		this.goLetterRepository = goLetterRepository;
		this.minioServerService = minioServerService;
		this.rmsConfigurationClientService = rmsConfigurationClientService;
		this.finalPaymentNewRepository = finalPaymentNewRepository;
	}

	@Override
	protected GoLetter convertForCreate(GoLetterRequstDto dto) {
		GoLetter entity = super.convertForCreate(dto);
		if (dto.getPartialFinalPaymentId() != null) {
			Optional<PartialFinalPaymentNewModel> option = finalPaymentNewRepository
					.findByIdAndIsDeleted(dto.getPartialFinalPaymentId(), false);
			entity.setPartialFinalPaymentId(option.orElse(new PartialFinalPaymentNewModel() {
				{
					setId(dto.getPartialFinalPaymentId());
				}
			}));
		}
		return entity;
	}

	@Override
	protected void convertForUpdate(GoLetterRequstDto dto, GoLetter entity) {
		if (dto.getPartialFinalPaymentId() != null) {
			Optional<PartialFinalPaymentNewModel> option = finalPaymentNewRepository
					.findByIdAndIsDeleted(dto.getPartialFinalPaymentId(), false);
			entity.setPartialFinalPaymentId(option.orElse(new PartialFinalPaymentNewModel() {
				{
					setId(dto.getPartialFinalPaymentId());
				}
			}));
		}
		super.convertForUpdate(dto, entity);
	}

	@Override
	public Response<GoLetterResponseDto> findByUuid(String uuid) {

		GoLetterResponseDto dto = super.getByUuid(uuid).getObj();

		if (dto.getUuid() == null) {
			return getErrorResponse("Data Not Found !.");
		}

		Optional<PartialFinalPaymentNewModel> option = finalPaymentNewRepository.findByIdAndIsDeleted(dto.getPartialFinalPaymentId(), false);
		dto.setPartialFinalPaymentModel(option.get());

		// Template Type
		if (dto.getTemplateTypeId() != null) {
			Response<TemplateTypeResponseDto> templateTypeResponse = rmsConfigurationClientService
					.getTemplateTypeById(dto.getTemplateTypeId());
			if (templateTypeResponse != null) {
				dto.setTemplateType(templateTypeResponse.getObj());
			}
		}

		// Predefined template
		if (dto.getPredefinedTemplateId() != null) {
			Response<PredefineTemplateResponseDto> predeifnedtempalteResponse = rmsConfigurationClientService
					.getPredefinedTempalteById(dto.getPredefinedTemplateId());
			if (predeifnedtempalteResponse != null) {
				dto.setPredefineTemplate(predeifnedtempalteResponse.getObj());
			}
		}

		return new Response<GoLetterResponseDto>() {
			{
				setSuccess(true);
				setMessage("Data Found!.");
				setObj(dto);
			}
		};
	}

}
