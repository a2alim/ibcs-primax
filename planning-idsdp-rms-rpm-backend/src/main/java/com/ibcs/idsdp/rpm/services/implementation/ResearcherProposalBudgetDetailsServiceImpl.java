package com.ibcs.idsdp.rpm.services.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.dto.request.ExpenditureItemRequestDto;
import com.ibcs.idsdp.rpm.client.dto.response.ExpenditureItemResponseDto;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalBudgetDetails;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalBudgetDetailsRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.services.ResearcherProposalBudgetDetailsService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalBudgetDetailsRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalBudgetDetailsResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.util.Response;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ResearcherProposalBudgetDetailsServiceImpl extends	BaseService<ResearcherProposalBudgetDetails, ResearcherProposalBudgetDetailsRequestDto, ResearcherProposalBudgetDetailsResponseDto>	implements ResearcherProposalBudgetDetailsService {

	private final ResearcherProposalBudgetDetailsRepository repository;
	private final ResearcherProposalRepository researcherProposalRepository;
	private final RmsConfigurationClientService rmsConfigurationClientService;

	protected ResearcherProposalBudgetDetailsServiceImpl(ServiceRepository<ResearcherProposalBudgetDetails> repository,
			ResearcherProposalBudgetDetailsRepository repository1,
			ResearcherProposalRepository researcherProposalRepository,
			RmsConfigurationClientService rmsConfigurationClientService) {
		super(repository);
		this.repository = repository1;
		this.researcherProposalRepository = researcherProposalRepository;
		this.rmsConfigurationClientService = rmsConfigurationClientService;
	}

	@Override
	protected ResearcherProposalBudgetDetails convertForCreate(
			ResearcherProposalBudgetDetailsRequestDto researcherProposalBudgetDetailsRequestDto) {

		ResearcherProposalBudgetDetails researcherProposalBudgetDetails = super.convertForCreate(
				researcherProposalBudgetDetailsRequestDto);

		Optional<ResearcherProposal> researcherProposal = researcherProposalRepository
				.findByIdAndIsDeleted(researcherProposalBudgetDetailsRequestDto.getResearcherProposalId(), false);
		if (researcherProposal.isEmpty()) {
			log.info("Researcher Personal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
		}

		researcherProposalBudgetDetails.setResearcherProposal(researcherProposal.get());

		if (researcherProposalBudgetDetailsRequestDto.getExpenditureName() != null) {
			Response<ExpenditureItemResponseDto> response = rmsConfigurationClientService.findByExpenditureName(researcherProposalBudgetDetailsRequestDto.getExpenditureName());
			if (response.isSuccess() && response.getObj() != null) {
				researcherProposalBudgetDetails.setStExpenditureItemId(response.getObj().getId());
			} else {
				Response<ExpenditureItemResponseDto> saveResponse = rmsConfigurationClientService

						.saveExpenditureItem(new ExpenditureItemRequestDto() {
							{
								setActive(true);
								setExpItemsFor("test");
								setExpItemsName(researcherProposalBudgetDetailsRequestDto.getExpenditureName());
							}
						});

				if (saveResponse.isSuccess() && saveResponse.getObj() != null) {
					researcherProposalBudgetDetails.setStExpenditureItemId(saveResponse.getObj().getId());
				}
			}
		}

		return researcherProposalBudgetDetails;
	}

	@Override
	protected void convertForUpdate(ResearcherProposalBudgetDetailsRequestDto researcherProposalBudgetDetailsRequestDto,ResearcherProposalBudgetDetails researcherProposalBudgetDetails) {
		Optional<ResearcherProposal> researcherProposal = researcherProposalRepository.findByIdAndIsDeleted(researcherProposalBudgetDetailsRequestDto.getResearcherProposalId(), false);

		if (researcherProposal.isEmpty()) {
			log.info("Researcher Personal not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
		}

		researcherProposalBudgetDetails.setResearcherProposal(researcherProposal.get());
		super.convertForUpdate(researcherProposalBudgetDetailsRequestDto, researcherProposalBudgetDetails);

		if (researcherProposalBudgetDetailsRequestDto.getExpenditureName() != null) {
			Response<ExpenditureItemResponseDto> response = rmsConfigurationClientService.findByExpenditureName(researcherProposalBudgetDetailsRequestDto.getExpenditureName());
			if (response.isSuccess() && response.getObj() != null) {
				researcherProposalBudgetDetails.setStExpenditureItemId(response.getObj().getId());
			} else {
				Response<ExpenditureItemResponseDto> saveResponse = rmsConfigurationClientService

						.saveExpenditureItem(new ExpenditureItemRequestDto() {
							{
								setActive(true);
								setExpItemsFor("test");
								setExpItemsName(researcherProposalBudgetDetailsRequestDto.getExpenditureName());
							}
						});

				if (saveResponse.isSuccess() && saveResponse.getObj() != null) {
					researcherProposalBudgetDetails.setStExpenditureItemId(saveResponse.getObj().getId());
				}
			}
		}


	}

	@Override
	protected ResearcherProposalBudgetDetailsResponseDto convertForRead(
			ResearcherProposalBudgetDetails researcherProposalBudgetDetails) {
		ResearcherProposalBudgetDetailsResponseDto dto = super.convertForRead(researcherProposalBudgetDetails);
		dto.setResearcherProposalId(researcherProposalBudgetDetails.getResearcherProposal().getId());
		dto.setResearcherProposalDto(new ModelMapper().map(researcherProposalBudgetDetails.getResearcherProposal(),
				ResearcherProposalResponseDto.class));
		return dto;
	}

	@Override
	public Response<ResearcherProposalBudgetDetailsResponseDto> getByResearcherProposalId(Long id) {
		List<ResearcherProposalBudgetDetails> list = repository.findAllByResearcherProposalIdAndIsDeleted(id, false);
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

	@Transactional
	@Override
	public Response<ResearcherProposalBudgetDetailsResponseDto> saveList( List<ResearcherProposalBudgetDetailsRequestDto> request) {
		try {
			List<ResearcherProposalBudgetDetailsResponseDto> list = new ArrayList<>();
			request.forEach(e -> {
				if (e.getUuid() != null) {
					if (e.getIsDeleted() == 1) {
						delete(e.getUuid());
					} else {
						list.add(new ModelMapper().map(update(e).getObj(),ResearcherProposalBudgetDetailsResponseDto.class));
					}
				} else {
					list.add(new ModelMapper().map(create(e).getObj(), ResearcherProposalBudgetDetailsResponseDto.class));
				}
			});
			return new Response<>() {
				{
					setSuccess(true);
					setItems(list);
				}
			};
		} catch (Exception e) {
			log.error("Save not Saved");
			return getErrorResponse("Save Failed");
		}
	}

}
