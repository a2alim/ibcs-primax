package com.ibcs.idsdp.rpm.services.implementation;

import com.google.gson.Gson;
import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfilePersonalInfoMaster;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalUploadDoc;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfileRscWorkingInOrg;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProfilePersonalInfoMasterRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProfileRscWorkingInOrgRepository;
import com.ibcs.idsdp.rpm.services.ResearcherProfileRscWorkingInOrgService;
import com.ibcs.idsdp.rpm.services.ResearcherProfileRscWorkingInOrgService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProfileRscWorkingInOrgRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalUploadDocRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalUploadDocResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProfileRscWorkingInOrgResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 *
 */
@Slf4j
@Service
public class ResearcherProfileRscWorkingInOrgServiceImpl extends BaseService<ResearcherProfileRscWorkingInOrg, ResearcherProfileRscWorkingInOrgRequestDto, ResearcherProfileRscWorkingInOrgResponseDto>	implements ResearcherProfileRscWorkingInOrgService {

	private final ResearcherProfileRscWorkingInOrgRepository researcherProfileRscWorkingInOrgRepository;
	private final ResearcherProfilePersonalInfoMasterRepository researcherProfileRepository;
	private final MinioServerService minioServerService;

	protected ResearcherProfileRscWorkingInOrgServiceImpl(
			ServiceRepository<ResearcherProfileRscWorkingInOrg> repository,
			ResearcherProfileRscWorkingInOrgRepository researcherProfileRscWorkingInOrgRepository, ResearcherProfilePersonalInfoMasterRepository researcherProfileRepository,
			MinioServerService minioServerService) {
		super(repository);
		this.researcherProfileRscWorkingInOrgRepository = researcherProfileRscWorkingInOrgRepository;
		this.researcherProfileRepository = researcherProfileRepository;
		this.minioServerService = minioServerService;
	}

	@Override
	protected ResearcherProfileRscWorkingInOrg convertForCreate(ResearcherProfileRscWorkingInOrgRequestDto researcherProfileRscWorkingInOrgRequestDto) {
		ResearcherProfileRscWorkingInOrg researcherProfileRscWorkingInOrg = super.convertForCreate(researcherProfileRscWorkingInOrgRequestDto);
		Optional<ResearcherProfilePersonalInfoMaster> researcherProfile = researcherProfileRepository.findByIdAndIsDeleted(researcherProfileRscWorkingInOrgRequestDto.getResearcherProfileId(), false);
		if (researcherProfile.isEmpty()) {
			log.info("Researcher Personal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
		}
		researcherProfileRscWorkingInOrg.setResearcherProfileId(researcherProfile.get());
		return researcherProfileRscWorkingInOrg;
	}

	@Override
	protected void convertForUpdate(ResearcherProfileRscWorkingInOrgRequestDto researcherProfileRscWorkingInOrgRequestDto, ResearcherProfileRscWorkingInOrg researcherProfileRscWorkingInOrg) {
		Optional<ResearcherProfilePersonalInfoMaster> researcherProfile = researcherProfileRepository.findByIdAndIsDeleted(researcherProfileRscWorkingInOrgRequestDto.getResearcherProfileId(), false);
		if (researcherProfile.isEmpty()) {
			log.info("Researcher Personal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
		}
		researcherProfileRscWorkingInOrg.setResearcherProfileId(researcherProfile.get());
		super.convertForUpdate(researcherProfileRscWorkingInOrgRequestDto, researcherProfileRscWorkingInOrg);
	}

	@Override
	protected ResearcherProfileRscWorkingInOrgResponseDto convertForRead(ResearcherProfileRscWorkingInOrg researcherProfileRscWorkingInOrg) {
		ResearcherProfileRscWorkingInOrgResponseDto dto = super.convertForRead(researcherProfileRscWorkingInOrg);
		dto.setResearcherProfileId(researcherProfileRscWorkingInOrg.getResearcherProfileId().getId());
//		dto.setResearcherProposalDto(new ModelMapper().map(researcherProfileRscWorkingInOrg.getResearcherProposal(), ResearcherProposalResponseDto.class));
		return dto;
	}

	@Override
	public Response<ResearcherProfileRscWorkingInOrgResponseDto> getListFindByResearcherProfileId(Long researcherProfileId) {

		ResearcherProfilePersonalInfoMaster researcherProfilePersonalInfoMaster = new ResearcherProfilePersonalInfoMaster(){{
			setId(researcherProfileId);
		}};

		List<ResearcherProfileRscWorkingInOrg> list = researcherProfileRscWorkingInOrgRepository
				.findAllByResearcherProfileIdAndIsDeleted(researcherProfilePersonalInfoMaster,false);

		if (list.isEmpty()) {
			return new Response<>() {{
				setSuccess(false);
				setMessage("Data Not Found");
				setObj(null);
			}};
		}
		return new Response<>() {{
			setMessage("Data Found");
			setItems(convertForRead(list));
		}};
	}

	/**
	 *
	 * @param researcherProfileRscWorkingInOrgRequestDtoList
	 * @return
	 */
	@Transactional
	@Override
	public Response<ResearcherProfileRscWorkingInOrgResponseDto> createList(
			List<ResearcherProfileRscWorkingInOrgRequestDto> researcherProfileRscWorkingInOrgRequestDtoList) {

		try {

			List<ResearcherProfileRscWorkingInOrgResponseDto> list = new ArrayList<>();
			researcherProfileRscWorkingInOrgRequestDtoList.forEach(e -> {
				if (e.getUuid() != null) {
					if (e.getIsDeleted() == 1) {
						delete(e.getUuid());
					} else {
						list.add(new ModelMapper().map(update(e).getObj(), ResearcherProfileRscWorkingInOrgResponseDto.class));
					}
				} else {
					list.add(new ModelMapper().map(create(e).getObj(), ResearcherProfileRscWorkingInOrgResponseDto.class));
				}
			});
			return new Response<>() {{
				setSuccess(true);
				setItems(list);
			}};


		} catch (Exception e) {
			return getErrorResponse("Save Failed!");
		}
	}

	@Override
	public Response<ResearcherProfileRscWorkingInOrgResponseDto> getListFindByUserId(Long userId) {

		Optional<ResearcherProfilePersonalInfoMaster> optional = researcherProfileRepository.findByUserIdAndIsDeleted(userId,false);

		if(!optional.isPresent()) {
			getErrorResponse("Researcher Profile Not Found !.");
		}

		List<ResearcherProfileRscWorkingInOrg> list = researcherProfileRscWorkingInOrgRepository.findAllByResearcherProfileIdAndIsDeleted(optional.get(),false);

		if (list.isEmpty()) {
			return new Response<>() {{
				setSuccess(false);
				setMessage("Data Not Found");
				setObj(null);
			}};
		}

		return new Response<>() {{
			setMessage("Data Found");
			setItems(convertForRead(list));
		}};

	}

	@Override
	public Response<ResearcherProfileRscWorkingInOrgResponseDto> createList(String body, Optional<MultipartFile[]> files, String updatedFileList) {

		ResearcherProfileRscWorkingInOrgRequestDto[] uploadDocsList = new Gson().fromJson(body,ResearcherProfileRscWorkingInOrgRequestDto[].class);
		List<Long> updatedFileIdList = objectMapperReadArrayValue(updatedFileList, Long.class);

		Optional<ResearcherProfilePersonalInfoMaster> researcherProfilePersonalInfo = researcherProfileRepository.findById(uploadDocsList[0].getResearcherProfileId());

		if (researcherProfilePersonalInfo.isEmpty()) {
			return getErrorResponse("Researcher Profile Personal Info Not Found !.");
		}

		try {
			List<ResearcherProfileRscWorkingInOrgResponseDto> list = new ArrayList<>();

			for (int i = 0; i < uploadDocsList.length; i++) {

				if (uploadDocsList[i].getUuid() != null) {

					if (uploadDocsList[i].getIsDeleted() == 1) {
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

						list.add(convertForRead(updateWithFile(uploadDocsList[i], files, index,researcherProfilePersonalInfo.get(), updatedFIleId)));
					}
				} else {
					Long ix = 1000l + i;
					Integer index = null;

					for (int start = 0; start < updatedFileIdList.size(); start++) {
						Long s = updatedFileIdList.get(start);
						Long e = ix;

						//System.out.println(updatedFileIdList.get(start).equals(ix));
						if (updatedFileIdList.get(start).equals(ix)) {
							index = start;
						}
					}
					list.add(convertForRead(saveWithFile(uploadDocsList[i], files, index, researcherProfilePersonalInfo.get())));
				}
			}

			return new Response<>() {
				{
					setSuccess(true);
					setItems(list);
				}
			};

		} catch (Exception e) {
			log.error(e.getMessage());
			return getErrorResponse("Save Failed");
		}
	}



	public ResearcherProfileRscWorkingInOrg saveWithFile(ResearcherProfileRscWorkingInOrgRequestDto uploadDocReduestDto,Optional<MultipartFile[]> files, Integer index, ResearcherProfilePersonalInfoMaster  researcherProfilePersonalInfo) {

		ResearcherProfileRscWorkingInOrg uploadDoc = new ResearcherProfileRscWorkingInOrg();
		BeanUtils.copyProperties(uploadDocReduestDto, uploadDoc);
		FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[index], "rms");

		uploadDoc.setUuid(UUID.randomUUID().toString());
		uploadDoc.setResearcherProfileId(researcherProfilePersonalInfo);
		uploadDoc.setFileDownloadUrl(fileUploadResponse.getDownloadUrl());
		uploadDoc.setBucketName(fileUploadResponse.getBucketName());
		uploadDoc.setFileName(fileUploadResponse.getFileName());

		return researcherProfileRscWorkingInOrgRepository.save(uploadDoc);
	}

	public ResearcherProfileRscWorkingInOrg updateWithFile(ResearcherProfileRscWorkingInOrgRequestDto uploadDocReduestDto,Optional<MultipartFile[]> files, Integer index, ResearcherProfilePersonalInfoMaster  researcherProfilePersonalInfo, Long uplotedFileId) {

		ResearcherProfileRscWorkingInOrg uploadDoc = new ResearcherProfileRscWorkingInOrg();
		BeanUtils.copyProperties(uploadDocReduestDto, uploadDoc);
		uploadDoc.setResearcherProfileId(researcherProfilePersonalInfo);

		Optional<ResearcherProfileRscWorkingInOrg> optional = researcherProfileRscWorkingInOrgRepository.findByIdAndIsDeleted(uploadDoc.getId(), false);
		if (!optional.isPresent()) {
			return null;
		}

		ResearcherProfileRscWorkingInOrg exgistingDoc = optional.get();
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

		return researcherProfileRscWorkingInOrgRepository.save(uploadDoc);
	}

	public void deleteWithFile(ResearcherProfileRscWorkingInOrgRequestDto uploadDocReduestDto) {
		BooleanValueHolderDTO response = delete(uploadDocReduestDto.getUuid());
		if (response.isSuccess()) {
			minioServerService.setFileDownloadUrlDeleteFile(uploadDocReduestDto.getBucketName(),uploadDocReduestDto.getFileName());
		}
	}


}
