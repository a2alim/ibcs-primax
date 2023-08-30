package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.enums.ResearcherProfileMarksCategory;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfileMarks;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProfileMarksRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.services.ResearcherProfileMarksService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProfileMarksRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProfileMarksResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
public class ResearcherProfileMarksServiceImpl
		extends BaseService<ResearcherProfileMarks, ResearcherProfileMarksRequestDto, ResearcherProfileMarksResponseDto>
		implements ResearcherProfileMarksService {

	private final ResearcherProfileMarksRepository repository;
	private final ResearcherProposalRepository researcherProposalRepository;

	protected ResearcherProfileMarksServiceImpl(ServiceRepository<ResearcherProfileMarks> repository,
                                                ResearcherProfileMarksRepository repository1,
                                                ResearcherProposalRepository researcherProposalRepository) {
		super(repository);
		this.repository = repository1;
		this.researcherProposalRepository = researcherProposalRepository;
	}

	@Override
	protected ResearcherProfileMarks convertForCreate(ResearcherProfileMarksRequestDto researcherProfileRequestDto) {

		ResearcherProfileMarks researcherProfileMarks = super.convertForCreate(researcherProfileRequestDto);

		Optional<ResearcherProposal> researcherProfilePersonalInfoMaster = researcherProposalRepository
				.findByIdAndIsDeleted(researcherProfileRequestDto.getResearcherProposalId(), false);
		if (researcherProfilePersonalInfoMaster.isEmpty()) {
			log.info("Researcher Proposal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Proposal not found");
		}
		researcherProfileMarks.setResearcherProposal(researcherProposalRepository
				.findByIdAndIsDeleted(researcherProfileRequestDto.getResearcherProposalId(), false).get());

		return researcherProfileMarks;
	}

	@Override
	protected void convertForUpdate(ResearcherProfileMarksRequestDto researcherProfileRequestDto,
			ResearcherProfileMarks researcherProfileMarks) {
		Optional<ResearcherProposal> researcherProfilePersonalInfoMaster = researcherProposalRepository
				.findByIdAndIsDeleted(researcherProfileRequestDto.getResearcherProposalId(), false);
		if (researcherProfilePersonalInfoMaster.isEmpty()) {
			log.info("Researcher Proposal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Proposal not found");
		}
		researcherProfileMarks.setResearcherProposal(researcherProposalRepository
				.findByIdAndIsDeleted(researcherProfileRequestDto.getResearcherProposalId(), false).get());
		super.convertForUpdate(researcherProfileRequestDto, researcherProfileMarks);
	}

	@Override
	protected ResearcherProfileMarksResponseDto convertForRead(ResearcherProfileMarks researcherProfileMarks) {
		ResearcherProfileMarksResponseDto dto = super.convertForRead(researcherProfileMarks);
		dto.setResearcherProposalId(researcherProfileMarks.getResearcherProposal().getId());
		dto.setResearcherProposalDto(
				new ModelMapper().map(researcherProfileMarks.getResearcherProposal(),
						ResearcherProposalResponseDto.class));
		return dto;
	}

	@Override
	public Response<ResearcherProfileMarksResponseDto> create(ResearcherProfileMarksRequestDto researcherProfileMarksRequestDto) {
		if (repository.existsByResearcherProposalIdAndIsDeleted(researcherProfileMarksRequestDto.getResearcherProposalId(), false)) {
			deleteEntity(repository.findByResearcherProposalIdAndIsDeleted(researcherProfileMarksRequestDto.getResearcherProposalId(), false).getUuid());
		}
		return super.create(researcherProfileMarksRequestDto);
	}

	@Override
	public Response<ResearcherProfileMarksResponseDto> getByResearcherProposalIdAndCategory(Long researcherProposalId, Long categoryId) {
		ResearcherProfileMarks marks = repository.findByResearcherProposalIdAndStResearchCatTypeIdAndIsDeleted(researcherProposalId, categoryId, false);
		if (marks == null) {
			return getSuccessResponse("No data found");
		}
		return new Response<>() {{
			setMessage("Data Found");
			setObj(convertForRead(marks));
		}};
	}
}
