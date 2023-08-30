package com.ibcs.idsdp.rpm.services.implementation;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.exceptions.exception.ResourceNotFoundException;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcherArchive;
import com.ibcs.idsdp.rpm.model.domain.ResearchAction;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.repositories.AgreementWithResearcherArchiveRepository;
import com.ibcs.idsdp.rpm.model.repositories.AgreementWithResearcherRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearchActionRepository;
import com.ibcs.idsdp.rpm.services.AgreementWithResearcherService;
import com.ibcs.idsdp.rpm.services.ResearchActionService;
import com.ibcs.idsdp.rpm.services.ResearcherProposalService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearchActionRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearchActionResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.util.Response;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class ResearchActionServiceImpl extends BaseService<ResearchAction, ResearchActionRequestDto, ResearchActionResponseDto> implements ResearchActionService {

	private final ResearchActionRepository researchActionRepository;
	private final IdGeneratorComponent idGeneratorComponent;
	private final AgreementWithResearcherArchiveRepository agreementWithResearcherArchiveRepository;
	private final AgreementWithResearcherRepository agreementWithResearcherRepository;
	private final ResearcherProposalService researcherProposalService;
	private final AgreementWithResearcherService agreementWithResearcherService;
	private final RmsConfigurationClientService rmsConfigurationClientService;

	protected ResearchActionServiceImpl(ServiceRepository<ResearchAction> repository,
			ResearchActionRepository researchActionRepository,
			IdGeneratorComponent idGeneratorComponent,
			AgreementWithResearcherArchiveRepository agreementWithResearcherArchiveRepository,
			AgreementWithResearcherRepository agreementWithResearcherRepository,
			ResearcherProposalService researcherProposalService,
			AgreementWithResearcherService agreementWithResearcherService,
			RmsConfigurationClientService rmsConfigurationClientService) {
		super(repository);
		this.researchActionRepository = researchActionRepository;
		this.idGeneratorComponent = idGeneratorComponent;
		this.agreementWithResearcherArchiveRepository = agreementWithResearcherArchiveRepository;
		this.agreementWithResearcherRepository = agreementWithResearcherRepository;
		this.researcherProposalService = researcherProposalService;
		this.agreementWithResearcherService = agreementWithResearcherService;
		this.rmsConfigurationClientService = rmsConfigurationClientService;
	}

	@Override
	public Response<ResearchActionResponseDto> save(ResearchActionRequestDto researchActionRequestDto) {
		Response<ResearchActionResponseDto> response = new Response<>();
		ResearchAction ra = new ResearchAction();

		if(StringUtils.isNotBlank(researchActionRequestDto.getUuid())) {
			Optional<ResearchAction> result = researchActionRepository.findByUuidAndIsDeleted(researchActionRequestDto.getUuid(), false);
			if (!result.isPresent()) throw new ResourceNotFoundException("Research Action Not Found");
			ra = result.get();
		}

		BeanUtils.copyProperties(researchActionRequestDto, ra, "id", "uuid");

		if(StringUtils.isBlank(ra.getUuid())) {
			ra.setUuid(idGeneratorComponent.generateUUID());
		} else {
			ra.setUpdatedBy("admin");
			ra.setUpdatedOn(LocalDate.now());
		} 

		ra.setCreatedBy("admin");
		ra.setCreatedOn(LocalDate.now());
		ra.setIsDeleted(false);


		// if status is Accepted
		if("Accepted".equalsIgnoreCase(ra.getStatus())) {
			// find agreement by researcher proposal id
			AgreementWithResearcher awr = agreementWithResearcherService.getByResearcherProposalId(ra.getResearcherProposalInfoId());
			if(awr == null) {
				response.setSuccess(false);
				response.setMessage("Can't find any researcher agreement in this system");
				response.setObj(null);
				return response;
			}

			// Insert master data to archive
			AgreementWithResearcherArchive awra = new AgreementWithResearcherArchive();
			BeanUtils.copyProperties(awr, awra, "id");
			
			awra.setResearcherProposalId(awr.getResearcherProposalId().getId());
			awra.setAgreementWithResearcherId(awr.getId());
			try {
				awra = agreementWithResearcherArchiveRepository.save(awra);
			} catch (Exception e) {
				log.error("Error is : {}, {}", e.getMessage(), e);
				response.setSuccess(false);
				response.setMessage("Can't save researcher agreement in archive");
				response.setObj(null);
				return response;
			}
			if(awra == null) {
				response.setSuccess(false);
				response.setMessage("Can't save researcher agreement in archive");
				response.setObj(null);
				return response;
			}

			// update master data
			if(researchActionRequestDto.getNewResearchStartDate() != null) awr.setResearchStartDate(researchActionRequestDto.getNewResearchStartDate());
			if(researchActionRequestDto.getNewResearchEndDate() != null) awr.setResearchEndDate(researchActionRequestDto.getNewResearchEndDate());
			if(StringUtils.isNotBlank(researchActionRequestDto.getNewResearchDurationMonth())) awr.setResearchDuration(researchActionRequestDto.getNewResearchDurationMonth());

			if(researchActionRequestDto.getNewTotalGrantAmount() != null) awr.setTotalGrantAmount(researchActionRequestDto.getNewTotalGrantAmount());

			try {
				agreementWithResearcherRepository.save(awr);
			} catch (Exception e) {
				log.error("Error is : {}, {}", e.getMessage(), e);
				response.setSuccess(false);
				response.setMessage("Can't update researcher agreement");
				response.setObj(null);
				return response;
			}
		}

		if("Rejected".equalsIgnoreCase(ra.getStatus())) {
			// find agreement by researcher proposal id
			AgreementWithResearcher awr = agreementWithResearcherService.getByResearcherProposalId(ra.getResearcherProposalInfoId());
			if(awr == null) {
				response.setSuccess(false);
				response.setMessage("Can't find any researcher agreement in this system");
				response.setObj(null);
				return response;
			}
			if(researchActionRequestDto.getActionFor().equals("Cancelled & Refund Money")||researchActionRequestDto.getActionFor().equals("Cancelled Agreement")) awr.setApprovalStatus(2);

			try {
				agreementWithResearcherRepository.save(awr);
			} catch (Exception e) {
				log.error("Error is : {}, {}", e.getMessage(), e);
				response.setSuccess(false);
				response.setMessage("Can't update researcher agreement");
				response.setObj(null);
				return response;
			}
		}

		try {
			researchActionRepository.save(ra);
		} catch (Exception e) {
			log.error("ERROR is : {}, {}", e.getMessage(), e);
			response.setSuccess(false);
			response.setMessage("Can't create research action");
			response.setObj(null);
			return response;
		}

		ResearchActionResponseDto responseDto = new ResearchActionResponseDto();
		BeanUtils.copyProperties(ra, responseDto);
		response.setSuccess(true);
		response.setMessage("Research Action Saved Successfully");
		response.setObj(responseDto);
		return response;
	}

	@Override
	public Page<ResearchActionResponseDto> getAllResearchAction(ResearchActionRequestDto researchActionRequestDto) {
		Pageable pageable = this.getPageable(researchActionRequestDto.getPageableRequestBodyDTO());
		Page<ResearchAction> ePage = researchActionRepository.findAllByIsDeleted(false, pageable);
		List<ResearchActionResponseDto> list = convertForRead(ePage.getContent());

		for(ResearchActionResponseDto dto : list) {

			// researcherProposalInfoService
//			ResearcherProposalInfo r = researcherProposalInfoService.getResearcherProposalInfoById(dto.getResearcherProposalInfoId());
//			if(r != null) dto.setResearcherProposalInfo(r);
			
			// ResearcherProposal
			ResearcherProposal r1 = researcherProposalService.findById(dto.getResearcherProposalInfoId());
			if(r1 != null) {
				ResearcherProposalResponseDto d = new ResearcherProposalResponseDto();
				BeanUtils.copyProperties(r1, d);
				d.setFiscalYear(rmsConfigurationClientService.getByFiscalYearId(d.getStFiscalYearId()).getObj());
				dto.setResearcherProposal(d);
			}

		}

		list.sort(Comparator.comparing(ResearchActionResponseDto::getId).reversed());

		return new PageImpl<>(list, pageable, ePage.getTotalElements());
	}

}
