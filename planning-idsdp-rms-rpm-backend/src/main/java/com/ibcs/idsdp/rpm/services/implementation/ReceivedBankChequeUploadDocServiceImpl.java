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
import com.ibcs.idsdp.rpm.model.domain.ReceivedBankCheque;
import com.ibcs.idsdp.rpm.model.domain.ReceivedBankChequeUploadDoc;
import com.ibcs.idsdp.rpm.model.repositories.ReceivedBankChequeRepository;
import com.ibcs.idsdp.rpm.model.repositories.ReceivedBankChequeUploadDocRepository;
import com.ibcs.idsdp.rpm.services.ReceivedBankChequeUploadDocService;
import com.ibcs.idsdp.rpm.web.dto.request.ReceivedBankChequeUploadDocRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ReceivedBankChequeUploadDocResponseDto;
import com.ibcs.idsdp.util.Response;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class ReceivedBankChequeUploadDocServiceImpl extends BaseService<ReceivedBankChequeUploadDoc, ReceivedBankChequeUploadDocRequestDto, ReceivedBankChequeUploadDocResponseDto> implements ReceivedBankChequeUploadDocService {

	private final ReceivedBankChequeUploadDocRepository receivedBankChequeUploadDocRepository;
	private final ReceivedBankChequeRepository receivedBankChequeRepository;
	private final MinioServerService minioServerService;

	protected ReceivedBankChequeUploadDocServiceImpl(ServiceRepository<ReceivedBankChequeUploadDoc> repository,
			ReceivedBankChequeUploadDocRepository receivedBankChequeUploadDocRepository,
			ReceivedBankChequeRepository receivedBankChequeRepository,
			MinioServerService minioServerService) {
		super(repository);
		this.receivedBankChequeUploadDocRepository = receivedBankChequeUploadDocRepository;
		this.receivedBankChequeRepository = receivedBankChequeRepository;
		this.minioServerService = minioServerService;
	}

	@Override
	public Response<ReceivedBankChequeUploadDocResponseDto> saveReceivedBankCheqyeFiles(String body,
			Optional<MultipartFile[]> files, String updatedFileList) {

		ReceivedBankChequeUploadDocRequestDto[] uploadDocsList = new Gson().fromJson(body, ReceivedBankChequeUploadDocRequestDto[].class);

		List<Long> updatedFileIdList = objectMapperReadArrayValue(updatedFileList, Long.class);

		Optional<ReceivedBankCheque> researcherProposal = receivedBankChequeRepository.findById(uploadDocsList[0].getReceivedBankChequeId());

		if (researcherProposal.isEmpty()) {
			return getErrorResponse("Researcher Proposal Not Found !.");
		}

		try {
			List<ReceivedBankChequeUploadDocResponseDto> list = new ArrayList<>();

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


	public ReceivedBankChequeUploadDoc saveWithFile(ReceivedBankChequeUploadDocRequestDto uploadDocReduestDto, Optional<MultipartFile[]> files, Integer index, ReceivedBankCheque receivedBankCheque) {

		ReceivedBankChequeUploadDoc uploadDoc = new ReceivedBankChequeUploadDoc();
		BeanUtils.copyProperties(uploadDocReduestDto, uploadDoc);
		FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[index], "receivedbankcheque");

		uploadDoc.setUuid(UUID.randomUUID().toString());
		uploadDoc.setReceivedBankChequeId(receivedBankCheque.getId());
		uploadDoc.setDownloadUrl(fileUploadResponse.getDownloadUrl());
		uploadDoc.setBucketName(fileUploadResponse.getBucketName());
		uploadDoc.setFileName(fileUploadResponse.getFileName());

		return receivedBankChequeUploadDocRepository.save(uploadDoc);
	}

	public void deleteWithFile(ReceivedBankChequeUploadDocRequestDto uploadDocReduestDto) {
		BooleanValueHolderDTO response = delete(uploadDocReduestDto.getUuid());
		if (response.isSuccess()) minioServerService.setFileDownloadUrlDeleteFile(uploadDocReduestDto.getBucketName(), uploadDocReduestDto.getFileName());
	}

	public ReceivedBankChequeUploadDoc updateWithFile(ReceivedBankChequeUploadDocRequestDto uploadDocReduestDto,
			Optional<MultipartFile[]> files, Integer index, ReceivedBankCheque createGOLetter, Long uplotedFileId) {

		ReceivedBankChequeUploadDoc uploadDoc = new ReceivedBankChequeUploadDoc();
		BeanUtils.copyProperties(uploadDocReduestDto, uploadDoc);
		uploadDoc.setReceivedBankChequeId(createGOLetter.getId());

		Optional<ReceivedBankChequeUploadDoc> optional = receivedBankChequeUploadDocRepository.findByIdAndIsDeleted(uploadDoc.getId(), false);
		if (!optional.isPresent()) {
			return null;
		}

		ReceivedBankChequeUploadDoc exgistingDoc = optional.get();
		uploadDoc.setCreatedBy(exgistingDoc.getCreatedBy());
		uploadDoc.setCreatedOn(exgistingDoc.getCreatedOn());
		uploadDoc.setIsDeleted(exgistingDoc.getIsDeleted());

		if (index != null && files.isPresent() && !files.get()[index].isEmpty() && uplotedFileId != null) {

			minioServerService.setFileDownloadUrlDeleteFile(uploadDoc.getBucketName(), uploadDoc.getFileName());
			FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[index], "receivedbankcheque");
			uploadDoc.setDownloadUrl(fileUploadResponse.getDownloadUrl());
			uploadDoc.setBucketName(fileUploadResponse.getBucketName());
			uploadDoc.setFileName(fileUploadResponse.getFileName());
		}

		return receivedBankChequeUploadDocRepository.save(uploadDoc);
	}

	@Override
	public Response<ReceivedBankChequeUploadDocResponseDto> findAllByReceivedBankChequeId(Long id) {
		List<ReceivedBankChequeUploadDoc> list = receivedBankChequeUploadDocRepository.findAllByReceivedBankChequeIdAndIsDeleted(id, false);
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
