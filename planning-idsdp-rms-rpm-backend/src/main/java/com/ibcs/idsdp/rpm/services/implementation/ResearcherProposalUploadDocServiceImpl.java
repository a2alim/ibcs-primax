package com.ibcs.idsdp.rpm.services.implementation;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.rpm.client.UaaClientService;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalBudgetDetailsResponseDto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalUploadDoc;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalUploadDocRepository;
import com.ibcs.idsdp.rpm.services.ResearcherProposalUploadDocService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalUploadDocRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalUploadDocResponseDto;
import com.ibcs.idsdp.util.Response;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ResearcherProposalUploadDocServiceImpl extends	BaseService<ResearcherProposalUploadDoc, ResearcherProposalUploadDocRequestDto, ResearcherProposalUploadDocResponseDto>	implements ResearcherProposalUploadDocService {

	private final MinioServerService minioServerService;
	private final ResearcherProposalUploadDocRepository researcherProposalUploadDocRepository;
	private final ResearcherProposalRepository researcherProposalRepository;

	@Autowired
	private IdGeneratorComponent idGeneratorComponent;

	@Value("${minio.host}")
	private String minIOHost;

	@Autowired
	private UaaClientService uaaClientService;

	protected ResearcherProposalUploadDocServiceImpl(ServiceRepository<ResearcherProposalUploadDoc> repository,
			MinioServerService minioServerService,
			ResearcherProposalUploadDocRepository researcherProposalUploadDocRepository,
			ResearcherProposalRepository researcherProposalRepository) {
		super(repository);
		this.minioServerService = minioServerService;
		this.researcherProposalUploadDocRepository = researcherProposalUploadDocRepository;
		this.researcherProposalRepository = researcherProposalRepository;
	}

	@Override
	protected ResearcherProposalUploadDoc convertForCreate(
			ResearcherProposalUploadDocRequestDto researcherProposalUploadDocRequestDto) {
		ResearcherProposalUploadDoc researcherProposalUploadDoc = super.convertForCreate(
				researcherProposalUploadDocRequestDto);

		Optional<ResearcherProposal> researcherProposal = null;

		if (researcherProposalUploadDocRequestDto.getResearcherProposalId() != null) {
			researcherProposal = researcherProposalRepository
					.findByIdAndIsDeleted(researcherProposalUploadDocRequestDto.getResearcherProposalId(), false);
		}

		if (researcherProposalUploadDocRequestDto.getResearcherProposalUuid() != null) {
			researcherProposal = researcherProposalRepository
					.findByUuidAndIsDeleted(researcherProposalUploadDocRequestDto.getResearcherProposalUuid(), false);
		}

		if (researcherProposal.isEmpty()) {
			log.info("Researcher Personal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
		}

		researcherProposalUploadDoc.setResearcherProposal(researcherProposal.get());
		return researcherProposalUploadDoc;
	}

	@Override
	protected ResearcherProposalUploadDocResponseDto convertForRead(ResearcherProposalUploadDoc e) {
		ResearcherProposalUploadDocResponseDto dto = super.convertForRead(e);
		dto.setResearcherProposalId(e.getResearcherProposal().getId());
		return dto;
	}

	@Transactional
	@Override
//	public Response<ResearcherProposalUploadDocResponseDto> uploadProposalDoc(String body,Optional<MultipartFile[]> files, String updatedFileList) {
//
//		ResearcherProposalUploadDocRequestDto[] uploadDocsList = new Gson().fromJson(body,ResearcherProposalUploadDocRequestDto[].class);
//
//		List<Long> updatedFileIdList = objectMapperReadArrayValue(updatedFileList, Long.class);
//
//		Optional<ResearcherProposal> researcherProposal = researcherProposalRepository
//				.findById(uploadDocsList[0].getResearcherProposalId());
//
//		if (researcherProposal.isEmpty()) {
//			return getErrorResponse("Researcher Proposal Not Found !.");
//		}
//
//		try {
//			List<ResearcherProposalUploadDocResponseDto> list = new ArrayList<>();
//
//			for (int i = 0; i < uploadDocsList.length; i++) {
//
//				if (uploadDocsList[i].getUuid() != null) {
//
//					if (uploadDocsList[i].getDeleted() == 1) {
//						deleteWithFile(uploadDocsList[i]);
//					} else {
//
//						Long id = uploadDocsList[i].getId();
//						Integer index = null;
//						Long updatedFIleId = null;
//
//						if (updatedFileIdList != null && !CollectionUtils.isEmpty(updatedFileIdList)) {
//							updatedFIleId = updatedFileIdList.stream().filter(f -> f.equals(id)).findFirst()
//									.orElse(null);
//						}
//
//						if (updatedFIleId != null) {
//							index = updatedFileIdList.indexOf(updatedFIleId);
//						}
//
//						list.add(convertForRead(updateWithFile(uploadDocsList[i], files, index,
//								researcherProposal.get(), updatedFIleId)));
//					}
//				} else {
//					Long ix = 1000l + i;
//					Integer index = null;
//
//					for (int start = 0; start < updatedFileIdList.size(); start++) {
//						Long s = updatedFileIdList.get(start);
//						Long e = ix;
//
//						System.out.println(updatedFileIdList.get(start).equals(ix));
//						if (updatedFileIdList.get(start).equals(ix)) {
//							index = start;
//						}
//					}
//					list.add(convertForRead(saveWithFile(uploadDocsList[i], files, index, researcherProposal.get())));
//				}
//			}
//
//			return new Response<>() {
//				{
//					setSuccess(true);
//					setItems(list);
//				}
//			};
//
//		} catch (Exception e) {
//			log.error(e.getMessage());
//			return getErrorResponse("Save Failed");
//		}
//	}

	public Response<ResearcherProposalUploadDocResponseDto> uploadProposalDoc(List<ResearcherProposalUploadDocRequestDto> requestDtoList) {
		AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder
				.getContext().getAuthentication().getDetails()).getDecodedDetails();

		try {
			List<ResearcherProposalUploadDocResponseDto> requestList = new ArrayList<>();


			for(ResearcherProposalUploadDocRequestDto request : requestDtoList)
			{
				ResearcherProposal researcherProposal1 = new ResearcherProposal();
				if(researcherProposal1.getId() == null){
					Optional<ResearcherProposal> researcherProposal = researcherProposalRepository.findById(request.getResearcherProposalId());
					researcherProposal1 = researcherProposal.get();
				}

				if(request.getUuid() != null)
				{
					if (request.getDeleted() == 1) {
						deleteWithFile(request);
					} else {
						Optional<ResearcherProposalUploadDoc> researcherProposalUploadDoc = researcherProposalUploadDocRepository.findByUuidAndIsDeleted(request.getUuid(), false);
						ResearcherProposalUploadDoc model = researcherProposalUploadDoc.get();
						BeanUtils.copyProperties(request, model);
						model.setResearcherProposal(researcherProposal1);
						model.setUpdatedBy(accessTokenDetail.getId());
						model.setUpdatedOn(LocalDate.now());
						model.setIsDeleted(false);
						researcherProposalUploadDocRepository.save(model);
						requestList.add(convertForRead(model));
					}
				}
				else {
					ResearcherProposalUploadDoc model = new ResearcherProposalUploadDoc();
					BeanUtils.copyProperties(request, model);
					model.setUuid(UUID.randomUUID().toString());
					model.setResearcherProposal(researcherProposal1);
					model.setCreatedBy(accessTokenDetail.getId());
					model.setCreatedOn(LocalDate.now());
					model.setIsDeleted(false);
					researcherProposalUploadDocRepository.save(model);
					requestList.add(convertForRead(model));
				}
			}
//			requestDtoList.forEach(e -> {
//				if (e.getUuid() != null) {
//					requestList.add(new ModelMapper().map(update(e).getObj(),ResearcherProposalUploadDocResponseDto.class));
//				} else {
//				requestList.add(new ModelMapper().map(create(e).getObj(), ResearcherProposalUploadDocResponseDto.class));
//				}
//			});

//			requestDtoList.forEach(val ->{
//				if(val.getUuid() != null || val.getUuid() != ""){
//					requestList.add(new ModelMapper().map(update(val).getObj(), ResearcherProposalUploadDocResponseDto.class));
//				}
//				else{
//					requestList.add(new ModelMapper().map(create(val).getObj(), ResearcherProposalUploadDocResponseDto.class));
//				}
//			});
			return new Response<>() {
				{
					setSuccess(true);
					setItems(requestList);
				}
			};
		}catch (Exception e){
			log.error(e.getMessage());
			return getErrorResponse("Save Failed");
		}
	}

	public ResearcherProposalUploadDoc saveWithFile(ResearcherProposalUploadDocRequestDto uploadDocReduestDto,
			Optional<MultipartFile[]> files, Integer index, ResearcherProposal researcherProposal) {

		ResearcherProposalUploadDoc uploadDoc = new ResearcherProposalUploadDoc();
		BeanUtils.copyProperties(uploadDocReduestDto, uploadDoc);
		FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[index], "rms");

		uploadDoc.setUuid(UUID.randomUUID().toString());
		uploadDoc.setResearcherProposal(researcherProposal);
		uploadDoc.setFileDownloadUrl(fileUploadResponse.getDownloadUrl());
		uploadDoc.setBucketName(fileUploadResponse.getBucketName());
		uploadDoc.setFileName(fileUploadResponse.getFileName());

		return researcherProposalUploadDocRepository.save(uploadDoc);
	}

	public ResearcherProposalUploadDoc updateWithFile(ResearcherProposalUploadDocRequestDto uploadDocReduestDto,
			Optional<MultipartFile[]> files, Integer index, ResearcherProposal researcherProposal, Long uplotedFileId) {

		ResearcherProposalUploadDoc uploadDoc = new ResearcherProposalUploadDoc();
		BeanUtils.copyProperties(uploadDocReduestDto, uploadDoc);
		uploadDoc.setResearcherProposal(researcherProposal);

		Optional<ResearcherProposalUploadDoc> optional = researcherProposalUploadDocRepository
				.findByIdAndIsDeleted(uploadDoc.getId(), false);
		if (!optional.isPresent()) {
			return null;
		}

		ResearcherProposalUploadDoc exgistingDoc = optional.get();
		uploadDoc.setCreatedBy(exgistingDoc.getCreatedBy());
		uploadDoc.setCreatedOn(exgistingDoc.getCreatedOn());
		uploadDoc.setIsDeleted(exgistingDoc.getIsDeleted());

		if (index != null && files.isPresent() && !files.get()[index].isEmpty() && uplotedFileId != null) {

			minioServerService.setFileDownloadUrlDeleteFile(uploadDoc.getBucketName(), uploadDoc.getFileName());
			FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[index], "rms");
			uploadDoc.setFileDownloadUrl(fileUploadResponse.getDownloadUrl());
			uploadDoc.setBucketName(fileUploadResponse.getBucketName());
			uploadDoc.setFileName(fileUploadResponse.getFileName());
		}

		return researcherProposalUploadDocRepository.save(uploadDoc);
	}

	public void deleteWithFile(ResearcherProposalUploadDocRequestDto uploadDocReduestDto) {

		BooleanValueHolderDTO response = delete(uploadDocReduestDto.getUuid());
		if (response.isSuccess()) {
			minioServerService.setFileDownloadUrlDeleteFile(uploadDocReduestDto.getBucketName(),uploadDocReduestDto.getFileName());
		}

	}

	@Override
	public Response<ResearcherProposalUploadDocResponseDto> getByResearcherProposalId(Long researcherProposalId) {

		List<ResearcherProposalUploadDoc> list = researcherProposalUploadDocRepository
				.findAllByResearcherProposalIdAndIsDeleted(researcherProposalId, false);

		if (list.isEmpty()) {
			return new Response<>() {
				{
					setSuccess(false);
					setMessage("Data Not Found");
					setObj(null);
				}
			};
		}
		return new Response<>() {
			{
				setMessage("Data Found");
				setItems(convertForRead(list));
			}
		};
	}

	@Override
	public Response<ResearcherProposalUploadDocResponseDto> uploadProposalDocFromPresentation(String data,Optional<MultipartFile> file) {

		ResearcherProposalUploadDocRequestDto requestDto = objectMapperReadValue(data,ResearcherProposalUploadDocRequestDto.class);

		FileUploadResponse fileUploadResponse = null;

		if (file.isPresent()) {
			fileUploadResponse = minioServerService.getFileDownloadUrl(file.get(), "rms");
		}

		if (fileUploadResponse == null) {
			return getErrorResponse("File not save !.");
		}

		requestDto.setFileDownloadUrl(fileUploadResponse.getDownloadUrl());
		requestDto.setBucketName(fileUploadResponse.getBucketName());
		requestDto.setFileName(fileUploadResponse.getFileName());

		return create(requestDto);
	}

	@Override
	public Response<ResearcherProposalUploadDocResponseDto> getByResearcherProposalUuid(String researcherProposalUuid) {

		Optional<ResearcherProposal> optional = researcherProposalRepository
				.findByUuidAndIsDeleted(researcherProposalUuid, false);

		if (optional.isEmpty()) {
			return getErrorResponse("Researcher Proposal Not Found!.");
		}

		List<ResearcherProposalUploadDoc> list = researcherProposalUploadDocRepository
				.findAllByResearcherProposalIdAndIsDeleted(optional.get().getId(), false);



		if (list.isEmpty()) {
			return new Response<>() {
				{
					setSuccess(false);
					setMessage("Data Not Found");
					setObj(null);
				}
			};
		}




		return new Response<>() {
			{
				setMessage("Data Found");
				setItems(convertForRead(list.stream()
				        .sorted(Comparator.comparingLong(ResearcherProposalUploadDoc::getId).reversed())
				        .collect(Collectors.toList())));
			}
		};
	}

}
