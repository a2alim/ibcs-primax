package com.ibcs.idsdp.rpm.services.implementation;

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
import com.ibcs.idsdp.rpm.model.domain.CreateGOLetter;
import com.ibcs.idsdp.rpm.model.domain.CreateGOLetterUploadDoc;
import com.ibcs.idsdp.rpm.model.repositories.CreateGOLetterRepository;
import com.ibcs.idsdp.rpm.model.repositories.CreateGOLetterUploadDocRepository;
import com.ibcs.idsdp.rpm.services.CreateGOLetterUploadDocService;
import com.ibcs.idsdp.rpm.web.dto.request.CreateGOLetterUploadDocRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateGOLetterUploadDocResponseDto;
import com.ibcs.idsdp.util.Response;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class CreateGOLetterUploadDocServiceImpl extends BaseService<CreateGOLetterUploadDoc, CreateGOLetterUploadDocRequestDto, CreateGOLetterUploadDocResponseDto> implements CreateGOLetterUploadDocService {

	private final CreateGOLetterUploadDocRepository createGOLetterUploadDocRepository;
	private final CreateGOLetterRepository createGOLetterRepository;
	private final MinioServerService minioServerService;

	protected CreateGOLetterUploadDocServiceImpl(ServiceRepository<CreateGOLetterUploadDoc> repository,
			CreateGOLetterUploadDocRepository createGOLetterUploadDocRepository,
			CreateGOLetterRepository createGOLetterRepository,
			MinioServerService minioServerService) {
		super(repository);
		this.createGOLetterUploadDocRepository = createGOLetterUploadDocRepository;
		this.createGOLetterRepository = createGOLetterRepository;
		this.minioServerService = minioServerService;
	}

	@Override
	public Response<CreateGOLetterUploadDocResponseDto> saveGoLetterFiles(String body, Optional<MultipartFile[]> files, String updatedFileList) {

		CreateGOLetterUploadDocRequestDto[] uploadDocsList = new Gson().fromJson(body, CreateGOLetterUploadDocRequestDto[].class);

		List<Long> updatedFileIdList = objectMapperReadArrayValue(updatedFileList, Long.class);

		Optional<CreateGOLetter> researcherProposal = createGOLetterRepository.findById(uploadDocsList[0].getGoLetterId());

		if (researcherProposal.isEmpty()) {
			return getErrorResponse("Researcher Proposal Not Found !.");
		}

		try {
			List<CreateGOLetterUploadDocResponseDto> list = new ArrayList<>();

			for (int i = 0; i < uploadDocsList.length; i++) {

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

						list.add(convertForRead(updateWithFile(uploadDocsList[i], files, index, researcherProposal.get(), updatedFIleId)));
					}

				} else {
					Long ix = 1000l+i;
					Integer index = null;

					for (int start = 0; start < updatedFileIdList.size(); start++) {
						Long s =updatedFileIdList.get(start);
						Long e = ix;

						//System.out.println(updatedFileIdList.get(start).equals(ix));
						if (updatedFileIdList.get(start).equals(ix)) {
							index=start;
						}
					}
					list.add(convertForRead(saveWithFile(uploadDocsList[i], files, index, researcherProposal.get())));
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

	public CreateGOLetterUploadDoc saveWithFile(CreateGOLetterUploadDocRequestDto uploadDocReduestDto, Optional<MultipartFile[]> files, Integer index, CreateGOLetter createGOLetter) {

		CreateGOLetterUploadDoc uploadDoc = new CreateGOLetterUploadDoc();
		BeanUtils.copyProperties(uploadDocReduestDto, uploadDoc);
		FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[index], "goletter");

		uploadDoc.setUuid(UUID.randomUUID().toString());
		uploadDoc.setGoLetterId(createGOLetter.getId());
		uploadDoc.setDownloadUrl(fileUploadResponse.getDownloadUrl());
		uploadDoc.setBucketName(fileUploadResponse.getBucketName());
		uploadDoc.setFileName(fileUploadResponse.getFileName());

		return createGOLetterUploadDocRepository.save(uploadDoc);
	}

	public void deleteWithFile(CreateGOLetterUploadDocRequestDto uploadDocReduestDto) {
		BooleanValueHolderDTO response = delete(uploadDocReduestDto.getUuid());
		if (response.isSuccess()) minioServerService.setFileDownloadUrlDeleteFile(uploadDocReduestDto.getBucketName(), uploadDocReduestDto.getFileName());
	}

	public CreateGOLetterUploadDoc updateWithFile(CreateGOLetterUploadDocRequestDto uploadDocReduestDto,
			Optional<MultipartFile[]> files, Integer index, CreateGOLetter createGOLetter, Long uplotedFileId) {

		CreateGOLetterUploadDoc uploadDoc = new CreateGOLetterUploadDoc();
		BeanUtils.copyProperties(uploadDocReduestDto, uploadDoc);
		uploadDoc.setGoLetterId(createGOLetter.getId());

		Optional<CreateGOLetterUploadDoc> optional = createGOLetterUploadDocRepository.findByIdAndIsDeleted(uploadDoc.getId(), false);
		if (!optional.isPresent()) {
			return null;
		}

		CreateGOLetterUploadDoc exgistingDoc = optional.get();
		uploadDoc.setCreatedBy(exgistingDoc.getCreatedBy());
		uploadDoc.setCreatedOn(exgistingDoc.getCreatedOn());
		uploadDoc.setIsDeleted(exgistingDoc.getIsDeleted());

		if (index != null && files.isPresent() && !files.get()[index].isEmpty() && uplotedFileId != null) {

			minioServerService.setFileDownloadUrlDeleteFile(uploadDoc.getBucketName(), uploadDoc.getFileName());
			FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[index], "goletter");
			uploadDoc.setDownloadUrl(fileUploadResponse.getDownloadUrl());
			uploadDoc.setBucketName(fileUploadResponse.getBucketName());
			uploadDoc.setFileName(fileUploadResponse.getFileName());
		}

		return createGOLetterUploadDocRepository.save(uploadDoc);
	}

	@Override
	public Response<CreateGOLetterUploadDocResponseDto> findAllByGoLetterId(Long goLetterId) {
		List<CreateGOLetterUploadDoc> list = createGOLetterUploadDocRepository.findAllByGoLetterIdAndIsDeleted(goLetterId, false);

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
