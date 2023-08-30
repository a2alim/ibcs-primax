package com.ibcs.idsdp.rpm.services.implementation;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.model.domain.ResearchAction;
import com.ibcs.idsdp.rpm.model.domain.ResearchActionUploadDoc;
import com.ibcs.idsdp.rpm.model.repositories.ResearchActionRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearchActionUploadDocRepository;
import com.ibcs.idsdp.rpm.services.ResearchActionUploadDocService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearchActionUploadDocRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearchActionUploadDocResponseDto;
import com.ibcs.idsdp.util.Response;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class ResearchActionUploadDocServiceImpl extends BaseService<ResearchActionUploadDoc, ResearchActionUploadDocRequestDto, ResearchActionUploadDocResponseDto> implements ResearchActionUploadDocService {

	private final ResearchActionUploadDocRepository researchActionUploadDocRepository;
	private final ResearchActionRepository researchActionRepository;
	private final MinioServerService minioServerService;

	protected ResearchActionUploadDocServiceImpl(ServiceRepository<ResearchActionUploadDoc> repository,
			ResearchActionUploadDocRepository researchActionUploadDocRepository,
			ResearchActionRepository researchActionRepository,
			MinioServerService minioServerService) {
		super(repository);
		this.researchActionUploadDocRepository = researchActionUploadDocRepository;
		this.minioServerService = minioServerService;
		this.researchActionRepository = researchActionRepository;
	}


	@Override
	public Response<ResearchActionUploadDocResponseDto> save(String body, Optional<MultipartFile[]> files, String updatedFileList) {

		ResearchActionUploadDocRequestDto[] uploadDocsList = new Gson().fromJson(body, ResearchActionUploadDocRequestDto[].class);
		List<Long> updatedFileIdList = objectMapperReadArrayValue(updatedFileList, Long.class);

		Optional<ResearchAction> researchAction = researchActionRepository.findById(uploadDocsList[0].getTakeActionForResearchId());
		if(researchAction.isEmpty()) {
			return getErrorResponse("Researcher Action Not Found !.");
		}

		try {
			List<ResearchActionUploadDocResponseDto> list = new ArrayList<>();

			for(int i = 0; i < uploadDocsList.length; i++) {

				if (uploadDocsList[i].getId() != null) {

					if(uploadDocsList[i].getDeleted() == 1) {
						deleteWithFile(uploadDocsList[i]);
					} else {
						Long id = uploadDocsList[i].getId();
						Integer index = null;
						Long updatedFIleId = null;

						if (updatedFileIdList != null && !CollectionUtils.isEmpty(updatedFileIdList)) {
							updatedFIleId = updatedFileIdList.stream().filter(f -> f.equals(id)).findFirst().orElse(null);
						}
						
						if (updatedFIleId != null) {
							index = updatedFileIdList.indexOf(updatedFIleId);
						}

						list.add(convertForRead(updateWithFile(uploadDocsList[i], files, index, researchAction.get(), updatedFIleId)));
					}

				} else {
					Long ix = 1000l+i;
					Integer index = null;

					for (int start = 0; start < updatedFileIdList.size(); start++) {
						Long s =updatedFileIdList.get(start);
						Long e = ix;

						if (updatedFileIdList.get(start).equals(ix)) {
							index=start;
						}
					}
					list.add(convertForRead(saveWithFile(uploadDocsList[i], files, index, researchAction.get())));
				}
			}

			return new Response<>() {
				{
					setSuccess(true);
					setItems(list);
				}
			};

		} catch (Exception e) {
			log.error("Error is : {}, {}", e.getMessage(), e);
			return getErrorResponse("Save Failed");
		}
	}
	
	public void deleteWithFile(ResearchActionUploadDocRequestDto uploadDocReduestDto) {
		BooleanValueHolderDTO response = delete(uploadDocReduestDto.getUuid());
		if (response.isSuccess()) minioServerService.setFileDownloadUrlDeleteFile(uploadDocReduestDto.getBucketName(), uploadDocReduestDto.getFileName());
	}

	public ResearchActionUploadDoc updateWithFile(ResearchActionUploadDocRequestDto uploadDocReduestDto,
			Optional<MultipartFile[]> files, Integer index, ResearchAction researchAction, Long uplotedFileId) {

		ResearchActionUploadDoc uploadDoc = new ResearchActionUploadDoc();
		BeanUtils.copyProperties(uploadDocReduestDto, uploadDoc);
		uploadDoc.setTakeActionForResearchId(researchAction.getId());

		Optional<ResearchActionUploadDoc> optional = researchActionUploadDocRepository.findByIdAndIsDeleted(uploadDoc.getId(), false);
		if (!optional.isPresent()) {
			return null;
		}

		ResearchActionUploadDoc exgistingDoc = optional.get();
		uploadDoc.setCreatedBy(exgistingDoc.getCreatedBy());
		uploadDoc.setCreatedOn(exgistingDoc.getCreatedOn());
		uploadDoc.setIsDeleted(exgistingDoc.getIsDeleted());

		if (index != null && files.isPresent() && !files.get()[index].isEmpty() && uplotedFileId != null) {

			minioServerService.setFileDownloadUrlDeleteFile(uploadDoc.getBucketName(), uploadDoc.getFileName());
			FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[index], "research-action");
			uploadDoc.setDownloadUrl(fileUploadResponse.getDownloadUrl());
			uploadDoc.setBucketName(fileUploadResponse.getBucketName());
			uploadDoc.setFileName(fileUploadResponse.getFileName());
		}

		uploadDoc.setUpdatedBy("admin");
		uploadDoc.setUpdatedOn(LocalDate.now());
		uploadDoc.setIsDeleted(false);
		return researchActionUploadDocRepository.save(uploadDoc);
	}

	public ResearchActionUploadDoc saveWithFile(ResearchActionUploadDocRequestDto uploadDocReduestDto, Optional<MultipartFile[]> files, Integer index, ResearchAction researchAction) {

		ResearchActionUploadDoc uploadDoc = new ResearchActionUploadDoc();
		BeanUtils.copyProperties(uploadDocReduestDto, uploadDoc);
		FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[index], "research-action");

		uploadDoc.setUuid(UUID.randomUUID().toString());
		uploadDoc.setTakeActionForResearchId(researchAction.getId());
		uploadDoc.setDownloadUrl(fileUploadResponse.getDownloadUrl());
		uploadDoc.setBucketName(fileUploadResponse.getBucketName());
		uploadDoc.setFileName(fileUploadResponse.getFileName());

		uploadDoc.setCreatedBy("admin");
		uploadDoc.setCreatedOn(LocalDate.now());
		uploadDoc.setIsDeleted(false);

		return researchActionUploadDocRepository.save(uploadDoc);
	}


	@Override
	public Response<ResearchActionUploadDocResponseDto> findAllByTakeActionForResearchId(Long takeActionForResearchId) {
		List<ResearchActionUploadDoc> list = researchActionUploadDocRepository.findAllByTakeActionForResearchIdAndIsDeleted(takeActionForResearchId, false);

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

	
}
