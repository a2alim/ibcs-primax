package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalInfo;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalInfoRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.services.ResearcherProposalInfoService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalInfoRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalInfoResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class ResearcherProposalInfoServiceImpl extends BaseService<ResearcherProposalInfo, ResearcherProposalInfoRequestDto, ResearcherProposalInfoResponseDto>
		implements ResearcherProposalInfoService {

	private final ResearcherProposalInfoRepository repository;
	private final ResearcherProposalRepository researcherProposalRepository;

	protected ResearcherProposalInfoServiceImpl(ServiceRepository<ResearcherProposalInfo> repository, ResearcherProposalInfoRepository repository1, ResearcherProposalRepository researcherProposalRepository) {
		super(repository);
		this.repository = repository1;
		this.researcherProposalRepository = researcherProposalRepository;
	}

	@Override
	protected ResearcherProposalInfo convertForCreate(ResearcherProposalInfoRequestDto researcherProposalInfoRequestDto) {
		ResearcherProposalInfo dto = super.convertForCreate(researcherProposalInfoRequestDto);
		Optional<ResearcherProposal> researcherProposal = researcherProposalRepository.findByIdAndIsDeleted(researcherProposalInfoRequestDto.getResearcherProposalId(), false);
		if (researcherProposal.isEmpty()) {
			log.info("Researcher Personal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
		}
		dto.setResearcherProposal(researcherProposal.get());
		return dto;
	}

	@Override
	protected void convertForUpdate(ResearcherProposalInfoRequestDto researcherProposalInfoRequestDto, ResearcherProposalInfo researcherProposalInfo) {
		Optional<ResearcherProposal> researcherProposal = researcherProposalRepository.findByIdAndIsDeleted(researcherProposalInfoRequestDto.getResearcherProposalId(), false);
		if (researcherProposal.isEmpty()) {
			log.info("Researcher Personal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
		}
		researcherProposalInfo.setResearcherProposal(researcherProposal.get());
		super.convertForUpdate(researcherProposalInfoRequestDto, researcherProposalInfo);
	}

	@Override
	protected ResearcherProposalInfoResponseDto convertForRead(ResearcherProposalInfo researcherProposalInfo) {
		ResearcherProposalInfoResponseDto dto = super.convertForRead(researcherProposalInfo);
		dto.setResearcherProposalId(researcherProposalInfo.getResearcherProposal().getId());
		dto.setResearcherProposalDto(new ModelMapper().map(researcherProposalInfo.getResearcherProposal(), ResearcherProposalResponseDto.class));
		return dto;
	}

	@Override
	public Response<ResearcherProposalInfoResponseDto> getByResearcherProposalId(Long id) {
		ResearcherProposalInfo researcherProposalInfo = repository.findByResearcherProposalIdAndIsDeleted(id, false);
		if (researcherProposalInfo == null) {
			return new Response<>() {{
				setSuccess(false);
				setMessage("Data Not Found");
				setObj(null);
			}};
		}
		return new Response<>() {{
			setMessage("Data Found");
			setObj(convertForRead(researcherProposalInfo));
		}};
	}

	@Override
	public ResearcherProposalInfo getResearcherProposalInfoById(Long id) {
		Optional<ResearcherProposalInfo> result = repository.findByIdAndIsDeleted(id, false);
		return result.isPresent() ? result.get() : null;
	}
	
	
}
