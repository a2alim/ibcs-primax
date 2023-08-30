package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalSubmissionLetter;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalSubmissionLetterRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.services.ResearcherProposalSubmissionLetterService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalSubmissionLetterRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalSubmissionLetterResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
public class ResearcherProposalSubmissionLetterServiceImpl extends BaseService<ResearcherProposalSubmissionLetter, ResearcherProposalSubmissionLetterRequestDto, ResearcherProposalSubmissionLetterResponseDto>
		implements ResearcherProposalSubmissionLetterService {

	private final ResearcherProposalSubmissionLetterRepository repository;
	private final ResearcherProposalRepository researcherProposalRepository;

	protected ResearcherProposalSubmissionLetterServiceImpl(ServiceRepository<ResearcherProposalSubmissionLetter> repository, ResearcherProposalSubmissionLetterRepository repository1, ResearcherProposalRepository researcherProposalRepository) {
		super(repository);
		this.repository = repository1;
		this.researcherProposalRepository = researcherProposalRepository;
	}

	@Override
	protected ResearcherProposalSubmissionLetter convertForCreate(ResearcherProposalSubmissionLetterRequestDto researcherProposalInfoRequestDto) {
		ResearcherProposalSubmissionLetter dto = super.convertForCreate(researcherProposalInfoRequestDto);
		Optional<ResearcherProposal> researcherProposal = researcherProposalRepository.findByIdAndIsDeleted(researcherProposalInfoRequestDto.getResearcherProposalId(), false);
		if (researcherProposal.isEmpty()) {
			log.info("Researcher Personal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
		}
		dto.setResearcherProposal(researcherProposal.get());
		return dto;
	}

	@Override
	protected void convertForUpdate(ResearcherProposalSubmissionLetterRequestDto researcherProposalInfoRequestDto, ResearcherProposalSubmissionLetter researcherProposalInfo) {
		Optional<ResearcherProposal> researcherProposal = researcherProposalRepository.findByIdAndIsDeleted(researcherProposalInfoRequestDto.getResearcherProposalId(), false);
		if (researcherProposal.isEmpty()) {
			log.info("Researcher Personal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
		}
		researcherProposalInfo.setResearcherProposal(researcherProposal.get());
		super.convertForUpdate(researcherProposalInfoRequestDto, researcherProposalInfo);
	}

	@Override
	protected ResearcherProposalSubmissionLetterResponseDto convertForRead(ResearcherProposalSubmissionLetter researcherProposalInfo) {
		ResearcherProposalSubmissionLetterResponseDto dto = super.convertForRead(researcherProposalInfo);
		dto.setResearcherProposalId(researcherProposalInfo.getResearcherProposal().getId());
		dto.setResearcherProposalDto(new ModelMapper().map(researcherProposalInfo.getResearcherProposal(), ResearcherProposalResponseDto.class));
		return dto;
	}

	@Override
	public Response<ResearcherProposalSubmissionLetterResponseDto> getByResearcherProposalId(Long id) {
		ResearcherProposalSubmissionLetter researcherProposalInfo = repository.findByResearcherProposalIdAndIsDeleted(id, false);
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
}
