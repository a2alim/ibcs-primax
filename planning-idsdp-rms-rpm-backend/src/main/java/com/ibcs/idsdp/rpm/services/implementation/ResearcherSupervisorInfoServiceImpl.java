package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.domain.ResearcherSupervisorInfo;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherSupervisorInfoRepository;
import com.ibcs.idsdp.rpm.services.ResearcherSupervisorInfoService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherSupervisorInfoRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherSupervisorInfoResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
public class ResearcherSupervisorInfoServiceImpl extends BaseService<ResearcherSupervisorInfo, ResearcherSupervisorInfoRequestDto, ResearcherSupervisorInfoResponseDto>
implements ResearcherSupervisorInfoService{

	private final ResearcherSupervisorInfoRepository repository;
	private final ResearcherProposalRepository researcherProposalRepository;

	protected ResearcherSupervisorInfoServiceImpl(ServiceRepository<ResearcherSupervisorInfo> repository, ResearcherSupervisorInfoRepository repository1, ResearcherProposalRepository researcherProposalRepository) {
		super(repository);
		this.repository = repository1;
		this.researcherProposalRepository = researcherProposalRepository;
	}

	@Override
	protected ResearcherSupervisorInfo convertForCreate(ResearcherSupervisorInfoRequestDto researcherSupervisorInfoRequestDto) {
		ResearcherSupervisorInfo researcherSupervisorInfo = super.convertForCreate(researcherSupervisorInfoRequestDto);
		Optional<ResearcherProposal> researcherProposal = researcherProposalRepository.findByIdAndIsDeleted(researcherSupervisorInfoRequestDto.getResearcherProposalId(), false);
		if (researcherProposal.isEmpty()) {
			log.info("Researcher Personal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
		}
		researcherSupervisorInfo.setResearcherProposal(researcherProposal.get());
		return researcherSupervisorInfo;
	}

	@Override
	protected void convertForUpdate(ResearcherSupervisorInfoRequestDto researcherSupervisorInfoRequestDto, ResearcherSupervisorInfo researcherSupervisorInfo) {
		Optional<ResearcherProposal> researcherProposal = researcherProposalRepository.findByIdAndIsDeleted(researcherSupervisorInfoRequestDto.getResearcherProposalId(), false);
		if (researcherProposal.isEmpty()) {
			log.info("Researcher Personal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
		}
		researcherSupervisorInfo.setResearcherProposal(researcherProposal.get());
		super.convertForUpdate(researcherSupervisorInfoRequestDto, researcherSupervisorInfo);
	}

	@Override
	protected ResearcherSupervisorInfoResponseDto convertForRead(ResearcherSupervisorInfo researcherSupervisorInfo) {
		ResearcherSupervisorInfoResponseDto dto = super.convertForRead(researcherSupervisorInfo);
		dto.setResearcherProposalId(researcherSupervisorInfo.getResearcherProposal().getId());
		dto.setResearcherProposalDto(new ModelMapper().map(researcherSupervisorInfo.getResearcherProposal(), ResearcherProposalResponseDto.class));
		return dto;
	}

	@Override
	public Response<ResearcherSupervisorInfoResponseDto> getByResearcherProposalId(Long id) {
		ResearcherSupervisorInfo researcherSupervisorInfo = repository.findByResearcherProposalIdAndIsDeleted(id, false);
		if (researcherSupervisorInfo == null) {
			return new Response<>() {{
				setSuccess(false);
				setMessage("Data Not Found");
				setObj(null);
			}};
		}
		return new Response<>() {{
			setMessage("Data Found");
			setObj(convertForRead(researcherSupervisorInfo));
		}};
	}
}
