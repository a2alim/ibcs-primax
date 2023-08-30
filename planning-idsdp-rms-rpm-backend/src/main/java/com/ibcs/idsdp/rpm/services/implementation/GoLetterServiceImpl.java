package com.ibcs.idsdp.rpm.services.implementation;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.model.domain.GoLetter;
import com.ibcs.idsdp.rpm.model.repositories.GoLetterRepository;
import com.ibcs.idsdp.rpm.model.repositories.InstallmentProcessRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.services.GoLetterService;
import com.ibcs.idsdp.rpm.services.InstallmentProcessService;
import com.ibcs.idsdp.rpm.web.dto.request.GoLetterRequstDto;
import com.ibcs.idsdp.rpm.web.dto.response.GoLetterResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.InstallmentProcessResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.PredefineTemplateResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.TemplateTypeResponseDto;
import com.ibcs.idsdp.util.Response;

@Service
public class GoLetterServiceImpl extends BaseService<GoLetter, GoLetterRequstDto, GoLetterResponseDto>
		implements GoLetterService {

	private final GoLetterRepository goLetterRepository;
	private final MinioServerService minioServerService;
	private final ResearcherProposalRepository researcherProposalRepository;
	private final InstallmentProcessRepository installmentProcessRepository;
	private final InstallmentProcessService installmentProcessService;
	private final RmsConfigurationClientService rmsConfigurationClientService;

	protected GoLetterServiceImpl(ServiceRepository<GoLetter> repository, GoLetterRepository goLetterRepository,
			MinioServerService minioServerService, ResearcherProposalRepository researcherProposalRepository,
			InstallmentProcessRepository installmentProcessRepository,
			InstallmentProcessService installmentProcessService,
			RmsConfigurationClientService rmsConfigurationClientService) {
		super(repository);
		this.goLetterRepository = goLetterRepository;
		this.minioServerService = minioServerService;
		this.researcherProposalRepository = researcherProposalRepository;
		this.installmentProcessRepository = installmentProcessRepository;
		this.installmentProcessService = installmentProcessService;
		this.rmsConfigurationClientService = rmsConfigurationClientService;
	}

	@Override
	public Response<GoLetterResponseDto> uploadDocument(String data, Optional<MultipartFile> file) {

		GoLetterRequstDto requestDto = objectMapperReadValue(data, GoLetterRequstDto.class);
		FileUploadResponse fileUploadResponse = new FileUploadResponse();

		Optional<GoLetter> optional = goLetterRepository.findByIdAndIsDeleted(requestDto.getId(), false);
		if (!optional.isPresent()) {
			return getErrorResponse("Go Letter Not Found !.");
		}

		if (!file.isPresent() && optional.get().getFileDownloadUrl() == null) {
			return getErrorResponse("File Not Found !.");
		}

		if (file.isPresent() && optional.get().getFileDownloadUrl() == null) {
			fileUploadResponse = minioServerService.getFileDownloadUrl(file.get(), "rms");
		}

		if (file.isPresent() && optional.get().getFileDownloadUrl() != null) {
			minioServerService.setFileDownloadUrlDeleteFile(optional.get().getBucketName(),
					optional.get().getFileName());
			fileUploadResponse = minioServerService.getFileDownloadUrl(file.get(), "rms");
		}

		if (fileUploadResponse == null && optional.get().getFileDownloadUrl() == null) {
			return getErrorResponse("File not save !.");
		}

		requestDto.setFileDownloadUrl(fileUploadResponse.getDownloadUrl() != null ? fileUploadResponse.getDownloadUrl()
				: optional.get().getFileDownloadUrl());
		requestDto.setBucketName(fileUploadResponse.getBucketName() != null ? fileUploadResponse.getBucketName()
				: optional.get().getBucketName());
		requestDto.setFileName(fileUploadResponse.getFileName() != null ? fileUploadResponse.getFileName()
				: optional.get().getFileName());

		return update(requestDto);

	}

	@Override
	protected void convertForUpdate(GoLetterRequstDto dto, GoLetter entity) {

		if (dto.getResearcherProposalId() != null) {
			entity.setResearcherProposalId(researcherProposalRepository
					.findByIdAndIsDeleted(dto.getResearcherProposalId(), false).orElseThrow());
		}

		if (dto.getInstallmentProcessId() != null) {
			entity.setInstallmentProcessId(installmentProcessRepository
					.findByIdAndIsDeleted(dto.getInstallmentProcessId(), false).orElseThrow());
		}

		super.convertForUpdate(dto, entity);

	}

	@Override
	public Response<GoLetterResponseDto> findByUuid(String uuid) {

		GoLetterResponseDto dto = super.getByUuid(uuid).getObj();

		if (dto.getUuid() == null) {
			return getErrorResponse("Data Not Found !.");
		}

		Response<InstallmentProcessResponseDto> installmentProcessRes = installmentProcessService.getInstallmentProcessById(dto.getInstallmentProcessId());
		
		if (installmentProcessRes != null) {
			dto.setInstallmentProcess(installmentProcessRes.getObj());
		}

		// Template Type
		if (dto.getTemplateTypeId() != null) {
			Response<TemplateTypeResponseDto> templateTypeResponse = rmsConfigurationClientService.getTemplateTypeById(dto.getTemplateTypeId());
			if (templateTypeResponse != null) {
				dto.setTemplateType(templateTypeResponse.getObj());
			}
		}

		// Predefined template
		if(dto.getPredefinedTemplateId() !=null) {
			Response<PredefineTemplateResponseDto> predeifnedtempalteResponse = rmsConfigurationClientService.getPredefinedTempalteById(dto.getPredefinedTemplateId());
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
