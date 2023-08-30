package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalRscWorkingInOrg;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRscWorkingInOrgRepository;
import com.ibcs.idsdp.rpm.services.ResearcherProposalRscWorkingInOrgService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalRscWorkingInOrgRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalRscWorkingInOrgResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class ResearcherProposalRscWorkingInOrgServiceImpl extends
		BaseService<ResearcherProposalRscWorkingInOrg, ResearcherProposalRscWorkingInOrgRequestDto, ResearcherProposalRscWorkingInOrgResponseDto>
		implements ResearcherProposalRscWorkingInOrgService {

	private final ResearcherProposalRscWorkingInOrgRepository researcherProposalRscWorkingInOrgRepository;
	private final ResearcherProposalRepository researcherProposalRepository;

	protected ResearcherProposalRscWorkingInOrgServiceImpl(
			ServiceRepository<ResearcherProposalRscWorkingInOrg> repository,
			ResearcherProposalRscWorkingInOrgRepository researcherProposalRscWorkingInOrgRepository, ResearcherProposalRepository researcherProposalRepository) {
		super(repository);
		this.researcherProposalRscWorkingInOrgRepository = researcherProposalRscWorkingInOrgRepository;
		this.researcherProposalRepository = researcherProposalRepository;
	}

	@Override
	protected ResearcherProposalRscWorkingInOrg convertForCreate(ResearcherProposalRscWorkingInOrgRequestDto researcherProposalRscWorkingInOrgRequestDto) {
		ResearcherProposalRscWorkingInOrg researcherProposalRscWorkingInOrg = super.convertForCreate(researcherProposalRscWorkingInOrgRequestDto);
		Optional<ResearcherProposal> researcherProposal = researcherProposalRepository.findByIdAndIsDeleted(researcherProposalRscWorkingInOrgRequestDto.getResearcherProposalId(), false);
		if (researcherProposal.isEmpty()) {
			log.info("Researcher Personal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
		}
		researcherProposalRscWorkingInOrg.setResearcherProposal(researcherProposal.get());
		return researcherProposalRscWorkingInOrg;
	}

	@Override
	protected void convertForUpdate(ResearcherProposalRscWorkingInOrgRequestDto researcherProposalRscWorkingInOrgRequestDto, ResearcherProposalRscWorkingInOrg researcherProposalRscWorkingInOrg) {
		Optional<ResearcherProposal> researcherProposal = researcherProposalRepository.findByIdAndIsDeleted(researcherProposalRscWorkingInOrgRequestDto.getResearcherProposalId(), false);
		if (researcherProposal.isEmpty()) {
			log.info("Researcher Personal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
		}
		researcherProposalRscWorkingInOrg.setResearcherProposal(researcherProposal.get());
		super.convertForUpdate(researcherProposalRscWorkingInOrgRequestDto, researcherProposalRscWorkingInOrg);
	}

	@Override
	protected ResearcherProposalRscWorkingInOrgResponseDto convertForRead(ResearcherProposalRscWorkingInOrg researcherProposalRscWorkingInOrg) {
		ResearcherProposalRscWorkingInOrgResponseDto dto = super.convertForRead(researcherProposalRscWorkingInOrg);
		dto.setResearcherProposalId(researcherProposalRscWorkingInOrg.getResearcherProposal().getId());
		dto.setResearcherProposalDto(new ModelMapper().map(researcherProposalRscWorkingInOrg.getResearcherProposal(), ResearcherProposalResponseDto.class));
		return dto;
	}

	@Override
	public Response<ResearcherProposalRscWorkingInOrgResponseDto> getListFindByResearcherProposalId(Long researcherProposalId) {
		
		List<ResearcherProposalRscWorkingInOrg> list = researcherProposalRscWorkingInOrgRepository
				.findAllByResearcherProposalIdAndIsDeleted(researcherProposalId,false);

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

	@Transactional
	@Override
	public Response<ResearcherProposalRscWorkingInOrgResponseDto> createList(List<ResearcherProposalRscWorkingInOrgRequestDto> researcherProposalRscWorkingInOrgRequestDtoList) {

		try {

			List<ResearcherProposalRscWorkingInOrgResponseDto> list = new ArrayList<>();
			researcherProposalRscWorkingInOrgRequestDtoList.forEach(e -> {
				if (e.getUuid() != null) {
					if (e.getIsDeleted() == 1) {
						delete(e.getUuid());
					} else {
						list.add(new ModelMapper().map(update(e).getObj(), ResearcherProposalRscWorkingInOrgResponseDto.class));
					}
				} else {
					list.add(new ModelMapper().map(create(e).getObj(), ResearcherProposalRscWorkingInOrgResponseDto.class));
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

}
