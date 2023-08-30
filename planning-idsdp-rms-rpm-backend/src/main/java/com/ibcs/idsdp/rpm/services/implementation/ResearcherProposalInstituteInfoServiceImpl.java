package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalInstituteInfo;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalInstituteInfoRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.services.ResearcherProposalInstituteInfoService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalInstituteInfoRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalUploadDocRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalInstituteInfoResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Slf4j
@Service
public class ResearcherProposalInstituteInfoServiceImpl extends
		BaseService<ResearcherProposalInstituteInfo, ResearcherProposalInstituteInfoRequestDto, ResearcherProposalInstituteInfoResponseDto>
		implements ResearcherProposalInstituteInfoService {

	private final ResearcherProposalInstituteInfoRepository researcherProposalInstituteInfoRepository;
	private final ResearcherProposalRepository researcherProposalRepository;
	private final MinioServerService minioServerService;

	protected ResearcherProposalInstituteInfoServiceImpl(ServiceRepository<ResearcherProposalInstituteInfo> repository,
			ResearcherProposalInstituteInfoRepository researcherProposalInstituteInfoRepository,
			ResearcherProposalRepository researcherProposalRepository, MinioServerService minioServerService) {
		super(repository);
		this.researcherProposalInstituteInfoRepository = researcherProposalInstituteInfoRepository;
		this.researcherProposalRepository = researcherProposalRepository;
		this.minioServerService = minioServerService;
	}

	@Override
	protected ResearcherProposalInstituteInfo convertForCreate(
			ResearcherProposalInstituteInfoRequestDto researcherProposalInstituteInfoRequestDto) {
		ResearcherProposalInstituteInfo researcherProposalInstituteInfo = super.convertForCreate(
				researcherProposalInstituteInfoRequestDto);
		Optional<ResearcherProposal> researcherProposal = researcherProposalRepository
				.findByIdAndIsDeleted(researcherProposalInstituteInfoRequestDto.getResearcherProposalId(), false);
		if (researcherProposal.isEmpty()) {
			log.info("Researcher Personal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
		}
		researcherProposalInstituteInfo.setResearcherProposal(researcherProposal.get());
		return researcherProposalInstituteInfo;
	}

	@Override
	protected void convertForUpdate(ResearcherProposalInstituteInfoRequestDto researcherProposalInstituteInfoRequestDto,
			ResearcherProposalInstituteInfo researcherProposalInstituteInfo) {
		Optional<ResearcherProposal> researcherProposal = researcherProposalRepository
				.findByIdAndIsDeleted(researcherProposalInstituteInfoRequestDto.getResearcherProposalId(), false);
		if (researcherProposal.isEmpty()) {
			log.info("Researcher Personal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
		}
		researcherProposalInstituteInfo.setResearcherProposal(researcherProposal.get());
		super.convertForUpdate(researcherProposalInstituteInfoRequestDto, researcherProposalInstituteInfo);
	}

	@Override
	protected ResearcherProposalInstituteInfoResponseDto convertForRead(
			ResearcherProposalInstituteInfo researcherProposalInstituteInfo) {
		ResearcherProposalInstituteInfoResponseDto dto = super.convertForRead(researcherProposalInstituteInfo);
		dto.setResearcherProposalId(researcherProposalInstituteInfo.getResearcherProposal().getId());
		dto.setResearcherProposalDto(new ModelMapper().map(researcherProposalInstituteInfo.getResearcherProposal(),
				ResearcherProposalResponseDto.class));
		return dto;
	}

	@Override
	public Response<ResearcherProposalInstituteInfoResponseDto> findByResearcherProposalId(Long researcherProposalId) {
		Response response = new Response();

		ResearcherProposalInstituteInfo data = researcherProposalInstituteInfoRepository
				.findByResearcherProposalId(researcherProposalId);
		if (data != null) {
			response.setObj(convertForRead(data));
			return getSuccessResponse("Data Found", response);
		}
		return getErrorResponse("Data Not Found!");
	}

	@Override
	public Response<ResearcherProposalInstituteInfoResponseDto> updateResearcherProposalInstituteInfo(String data,
			Optional<MultipartFile> file) {

		ResearcherProposalInstituteInfoRequestDto requestDto = objectMapperReadValue(data,
				ResearcherProposalInstituteInfoRequestDto.class);

		if (file.isPresent()) {

			if (requestDto.getBucketName() != null && requestDto.getFileName() != null) {
				minioServerService.setFileDownloadUrlDeleteFile(requestDto.getBucketName(), requestDto.getFileName());
			}

			FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(file.get(), "rms");
			requestDto.setFileDownloadUrl(fileUploadResponse.getDownloadUrl());
			requestDto.setBucketName(fileUploadResponse.getBucketName());
			requestDto.setFileName(fileUploadResponse.getFileName());
		}

		return update(requestDto);
	}

	@Override
	public Response<ResearcherProposalInstituteInfoResponseDto> createResearcherProposalInstituteInfo(String data,Optional<MultipartFile> file) {

		ResearcherProposalInstituteInfoRequestDto requestDto = objectMapperReadValue(data,ResearcherProposalInstituteInfoRequestDto.class);

		if (file.isPresent()) {

			FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(file.get(), "rms");
			
			if (fileUploadResponse != null) {
				requestDto.setFileDownloadUrl(fileUploadResponse.getDownloadUrl());
				requestDto.setBucketName(fileUploadResponse.getBucketName());
				requestDto.setFileName(fileUploadResponse.getFileName());
			}

			if (fileUploadResponse == null) {
				return getErrorResponse("File Not Save!.");
			}
		}

		return create(requestDto);
	}

}
