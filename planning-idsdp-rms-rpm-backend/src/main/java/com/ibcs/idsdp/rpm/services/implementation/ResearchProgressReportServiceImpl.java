package com.ibcs.idsdp.rpm.services.implementation;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import com.ibcs.idsdp.rpm.web.dto.response.ResearchActionResponseDto;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.client.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.rpm.model.domain.ResearchProgressReport;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalInfo;
import com.ibcs.idsdp.rpm.model.domain.TaskList;
import com.ibcs.idsdp.rpm.model.repositories.ResearchProgressReportRepository;
import com.ibcs.idsdp.rpm.services.ResearchProgressReportService;
import com.ibcs.idsdp.rpm.services.ResearcherProposalInfoService;
import com.ibcs.idsdp.rpm.services.ResearcherProposalService;
import com.ibcs.idsdp.rpm.services.TaskListService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearchProgressReportRequesteDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearchProgressReportResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.TaskListResponseDto;
import com.ibcs.idsdp.util.Response;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class ResearchProgressReportServiceImpl extends BaseService<ResearchProgressReport, ResearchProgressReportRequesteDto, ResearchProgressReportResponseDto> implements ResearchProgressReportService {

	private final ResearchProgressReportRepository researchProgressReportRepository;
	private final IdGeneratorComponent idGeneratorComponent;
	private final MinioServerService minioServerService;
	private final TaskListService taskListService;
	private final ResearcherProposalInfoService researcherProposalInfoService;
	private final RmsConfigurationClientService rmsConfigurationClientService;
	private final ResearcherProposalService researcherProposalService;

	protected ResearchProgressReportServiceImpl(ServiceRepository<ResearchProgressReport> repository,
			ResearchProgressReportRepository researchProgressReportRepository,
			IdGeneratorComponent idGeneratorComponent,
			MinioServerService minioServerService,
			TaskListService taskListService,
			ResearcherProposalInfoService researcherProposalInfoService,
			RmsConfigurationClientService rmsConfigurationClientService,
			ResearcherProposalService researcherProposalService) {
		super(repository);
		this.researchProgressReportRepository = researchProgressReportRepository;
		this.idGeneratorComponent = idGeneratorComponent;
		this.minioServerService = minioServerService;
		this.taskListService = taskListService;
		this.researcherProposalInfoService = researcherProposalInfoService;
		this.rmsConfigurationClientService = rmsConfigurationClientService;
		this.researcherProposalService = researcherProposalService;
	}

	@Override
	public Response<ResearchProgressReportResponseDto> save(String body, Optional<MultipartFile[]> files) {
		Response<ResearchProgressReportResponseDto> response = new Response<>();
		ResearchProgressReportResponseDto responseDto = new ResearchProgressReportResponseDto();
		try {
			ResearchProgressReport researchProgressReport = new ResearchProgressReport();
			ResearchProgressReportRequesteDto dto = new Gson().fromJson(body, ResearchProgressReportRequesteDto.class);
			if("edit".equalsIgnoreCase(dto.getMode())) {
				BeanUtils.copyProperties(dto, researchProgressReport);

				// fetching data from db
				Optional<ResearchProgressReport> byId = researchProgressReportRepository.findById(dto.getId());

				FileUploadResponse fileInfo = null;
				if(files.isPresent() && files.get().length > 0) {
					fileInfo = new FileUploadResponse();
					// delete file
					if(StringUtils.isNotBlank(researchProgressReport.getBucketName()) && StringUtils.isNotBlank(researchProgressReport.getFileName())) {
						minioServerService.setFileDownloadUrlDeleteFile(researchProgressReport.getBucketName(), researchProgressReport.getFileName());
					}

					fileInfo = minioServerService.getFileDownloadUrl(files.get()[0], "research-progress-report");
				}
				if (fileInfo != null) {
					researchProgressReport.setDownloadUrl(fileInfo.getDownloadUrl());
					researchProgressReport.setBucketName(fileInfo.getBucketName());
					researchProgressReport.setFileName(fileInfo.getFileName());
				}

				if(byId.isPresent()) {
					ResearchProgressReport persistData = byId.get();
					researchProgressReport.setIsDeleted(persistData.getIsDeleted());
					researchProgressReport.setCreatedBy(persistData.getCreatedBy());
					researchProgressReport.setCreatedOn(persistData.getCreatedOn());
				}

				researchProgressReport.setUpdatedBy("admin");
				researchProgressReport.setUpdatedOn(LocalDate.now());
				researchProgressReport.setIsDeleted(false);
				ResearchProgressReport save = researchProgressReportRepository.save(researchProgressReport);

				BeanUtils.copyProperties(save, responseDto);

				response.setMessage("Updated Successfully");
				response.setSuccess(true);
				response.setObj(responseDto);
			} else {
				BeanUtils.copyProperties(dto, researchProgressReport);
				FileUploadResponse fileInfo = null;
				if(files.isPresent() && files.get().length > 0) {
					fileInfo = new FileUploadResponse();
					fileInfo = minioServerService.getFileDownloadUrl(files.get()[0], "research-progress-report");
				}
				if (fileInfo != null) {
					researchProgressReport.setDownloadUrl(fileInfo.getDownloadUrl());
					researchProgressReport.setBucketName(fileInfo.getBucketName());
					researchProgressReport.setFileName(fileInfo.getFileName());
				}
				researchProgressReport.setUuid(idGeneratorComponent.generateUUID());
				researchProgressReport.setCreatedBy("admin");
				researchProgressReport.setCreatedOn(LocalDate.now());
				researchProgressReport.setIsDeleted(false);
				ResearchProgressReport save = researchProgressReportRepository.save(researchProgressReport);

				BeanUtils.copyProperties(save, responseDto);

				response.setMessage("Saved Successfully!");
				response.setSuccess(true);
				response.setObj(responseDto);
			}

		} catch (Exception e) {
			log.error("Error is : {}, {}", e.getMessage(), e);
			response.setMessage("Save Failed");
			response.setSuccess(false);
			response.setObj(null);
			return response;
		}

		return response;
	}

	@Override
	public Page<ResearchProgressReportResponseDto> getAllResearchProgressReport(ResearchProgressReportRequesteDto researchProgressReportRequesteDto) {
		Pageable pageable = this.getPageable(researchProgressReportRequesteDto.getPageableRequestBodyDTO());
		Page<ResearchProgressReport> ePage = researchProgressReportRepository.findAllResearchProgressReportByIsDeleted(false, pageable);
		List<ResearchProgressReportResponseDto> list = convertForRead(ePage.getContent());

		
		
		
		for(ResearchProgressReportResponseDto dto : list) {

			
			ResearcherProposal rp = researcherProposalService.findById(dto.getResearcherProposalInfoId());
			if(rp != null) dto.setResearcherProposalInfo(rp);

			// fiscalYearId
			Response<FiscalResponseDto> phy = rmsConfigurationClientService.getByFiscalYearId(dto.getFiscalYearId());
			if(phy != null) {
				FiscalResponseDto p = phy.getObj();
				dto.setFiscalResponseDto(p);
			}

			// researchCatTypeId
			Response<ResearchCategoryTypeResponseDto> rc = rmsConfigurationClientService.getByResearchCategoryTypeId(dto.getResearchCatTypeId());
			if(rc != null) {
				dto.setResearchCategoryTypeResponseDto(rc.getObj());
			}

			// Task List add
			List<TaskList> resultList = taskListService.findAllTaskListByResearchProgressReportId(dto.getId());
			if(resultList.isEmpty()) continue;
			for(TaskList t : resultList) {
				TaskListResponseDto trdto = new TaskListResponseDto();
				BeanUtils.copyProperties(t, trdto);
				dto.getTaskLists().add(trdto);
			}

		}

		list.sort(Comparator.comparing(ResearchProgressReportResponseDto::getId).reversed());

		return new PageImpl<>(list, pageable, ePage.getTotalElements());
	}

	

}
