package com.ibcs.idsdp.rpm.services.implementation;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.model.domain.FiscalYearWiseDocFiles;
import com.ibcs.idsdp.rpm.model.repositories.FiscalYearWiseDocFilesRepository;
import com.ibcs.idsdp.rpm.services.FiscalYearWiseDocFilesService;
import com.ibcs.idsdp.rpm.web.dto.request.FiscalYearWiseDocFilesRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.FiscalYearWiseDocFilesResponseDto;
import com.ibcs.idsdp.util.Response;

@Service
public class FiscalYearWiseDocFilesServiceImpl
		extends BaseService<FiscalYearWiseDocFiles, FiscalYearWiseDocFilesRequestDto, FiscalYearWiseDocFilesResponseDto>
		implements FiscalYearWiseDocFilesService {

	private final MinioServerService minioServerService;
	private final FiscalYearWiseDocFilesRepository fiscalYearWiseDocFilesRepository;

	protected FiscalYearWiseDocFilesServiceImpl(ServiceRepository<FiscalYearWiseDocFiles> repository,
			MinioServerService minioServerService, FiscalYearWiseDocFilesRepository fiscalYearWiseDocFilesRepository) {
		super(repository);
		this.minioServerService = minioServerService;
		this.fiscalYearWiseDocFilesRepository = fiscalYearWiseDocFilesRepository;
	}

	@Override
	public Response<FiscalYearWiseDocFilesResponseDto> uploadProposalDoc(
			FiscalYearWiseDocFilesRequestDto fiscalYearWiseDocFilesRequestDto, Optional<MultipartFile> file) {

		if (file.isEmpty()) {
			return getErrorResponse("File Not Found");
		}

		FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(file.get(), "rms");

		fiscalYearWiseDocFilesRequestDto.setFileDownloadUrl(fileUploadResponse.getDownloadUrl());
		fiscalYearWiseDocFilesRequestDto.setBucketName(fileUploadResponse.getBucketName());
		fiscalYearWiseDocFilesRequestDto.setFileName(fileUploadResponse.getFileName());
		fiscalYearWiseDocFilesRequestDto.setFileFor("test");

		Response<FiscalYearWiseDocFilesResponseDto> createRes = create(fiscalYearWiseDocFilesRequestDto);

		if (createRes.isSuccess()) {
			return createRes;
		}

		return getErrorResponse("File Not Uploaded!.");
	}

	@Override
	public Response<FiscalYearWiseDocFilesResponseDto> findAllByStFiscalYearId(Long stFiscalYearId) {

		List<FiscalYearWiseDocFiles> list = fiscalYearWiseDocFilesRepository
				.findAllByStFiscalYearIdAndIsDeleted(stFiscalYearId, false);

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
	public Response<FiscalYearWiseDocFilesResponseDto> deleteDoc(Long id) {

		Optional<FiscalYearWiseDocFiles> optional = fiscalYearWiseDocFilesRepository.findById(id);
		if (optional.isPresent()) {
			FiscalYearWiseDocFiles fiscalYearWiseDocFiles = optional.get();
			fiscalYearWiseDocFiles.setIsDeleted(true);
			minioServerService.setFileDownloadUrlDeleteFile(fiscalYearWiseDocFiles.getBucketName(),
					fiscalYearWiseDocFiles.getFileName());
			FiscalYearWiseDocFiles response = fiscalYearWiseDocFilesRepository.save(fiscalYearWiseDocFiles);

			return new Response<FiscalYearWiseDocFilesResponseDto>() {
				{
					setMessage("Delete Successfull!.");
					setObj(convertForRead(response));
				}
			};
		}
		return getErrorResponse("Dalete Failed!.");
	}
}
