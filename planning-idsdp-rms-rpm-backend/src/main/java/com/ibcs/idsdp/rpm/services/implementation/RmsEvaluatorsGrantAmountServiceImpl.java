package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.dto.response.ExpertEvaluatorResponseDto;
import com.ibcs.idsdp.rpm.model.domain.RmsEvaluatorsGrantAmount;
import com.ibcs.idsdp.rpm.model.repositories.RmsEvaluatorsGrantAmountRepository;
import com.ibcs.idsdp.rpm.services.RmsEvaluatorsGrantAmountService;
import com.ibcs.idsdp.rpm.web.dto.request.RmsEvaluatorsGrantAmountRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProfilePersonalInfoMasterResponse;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.RmsEvaluatorsGrantAmountResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class RmsEvaluatorsGrantAmountServiceImpl
		extends BaseService<RmsEvaluatorsGrantAmount, RmsEvaluatorsGrantAmountRequestDto, RmsEvaluatorsGrantAmountResponseDto>
		implements RmsEvaluatorsGrantAmountService {

	private final RmsEvaluatorsGrantAmountRepository repository;
	private final ResearcherProposalServiceImpl researcherProposalServiceImpl;
	private final RmsConfigurationClientService rmsConfigurationClientService;

	protected RmsEvaluatorsGrantAmountServiceImpl(ServiceRepository<RmsEvaluatorsGrantAmount> rmsEvaluatorsGrantAmountRepository, RmsEvaluatorsGrantAmountRepository repository, ResearcherProposalServiceImpl researcherProposalServiceImpl, RmsConfigurationClientService rmsConfigurationClientService) {
		super(rmsEvaluatorsGrantAmountRepository);
		this.repository = repository;
		this.researcherProposalServiceImpl = researcherProposalServiceImpl;
		this.rmsConfigurationClientService = rmsConfigurationClientService;
	}

	@Override
	protected RmsEvaluatorsGrantAmountResponseDto convertForRead(RmsEvaluatorsGrantAmount rmsEvaluatorsGrantAmount) {
		RmsEvaluatorsGrantAmountResponseDto dto = super.convertForRead(rmsEvaluatorsGrantAmount);
		dto.setResearcherProposalId(rmsEvaluatorsGrantAmount.getResearcherProposal().getId());
		dto.setResearcherProposalDto(new ModelMapper().map(rmsEvaluatorsGrantAmount.getResearcherProposal(), ResearcherProposalResponseDto.class));
		dto.getResearcherProposalDto().setResProfilePersonalInfoId(rmsEvaluatorsGrantAmount.getResearcherProposal().getResearcherProfilePersonalInfoMaster().getId());
		dto.getResearcherProposalDto().setResearcherProfilePersonalInfoDto(new ModelMapper().map(rmsEvaluatorsGrantAmount.getResearcherProposal().getResearcherProfilePersonalInfoMaster(), ResearcherProfilePersonalInfoMasterResponse.class));
		dto.setDeleted(0);
		return dto;
	}

	@Override
	protected List<RmsEvaluatorsGrantAmountResponseDto> convertForRead(List<RmsEvaluatorsGrantAmount> e) {
		List<RmsEvaluatorsGrantAmountResponseDto> list = super.convertForRead(e);

		if (list.isEmpty()) {
			return list;
		}

		Map<Long, ExpertEvaluatorResponseDto> expertEvaluatorResponseDtoMap = rmsConfigurationClientService
				.getByExpertEvaluatorIdSet(new IdSetRequestBodyDTO() {
					{
						setIds(list.stream()
								            .filter(f->f.getStProfileOfExpertEvaluatorsId() !=null)
								            .map(RmsEvaluatorsGrantAmountResponseDto::getStProfileOfExpertEvaluatorsId)
								             .collect(Collectors.toSet()));
					}
				}).getItems().stream().collect(Collectors.toMap(UuidIdHolderRequestBodyDTO::getId, dto -> dto));

		return list.stream().peek(p -> p.setEvaluator(expertEvaluatorResponseDtoMap.get(p.getStProfileOfExpertEvaluatorsId())))
				.collect(Collectors.toList());
	}

	@Override
	public Response<RmsEvaluatorsGrantAmountResponseDto> getByRmsEvaluatorsGrantAmountLetterId(Long rmsEvaluatorsGrantAmountLetterId) {
		List<RmsEvaluatorsGrantAmount> list = repository.findAllByRmsEvaluatorsGrantAmountLetterIdAndIsDeleted(rmsEvaluatorsGrantAmountLetterId, false);
		if (list.isEmpty()) {
			return new Response<>() {{
				setSuccess(true);
				setMessage("Data Empty");
			}};
		}
		return new Response<>() {{
			setMessage("Data Found");
			setItems(convertForRead(list));
		}};
	}

	public List<RmsEvaluatorsGrantAmountResponseDto> getListByRmsEvaluatorsGrantAmountLetterId(Long rmsEvaluatorsGrantAmountLetterId) {
		List<RmsEvaluatorsGrantAmount> list = repository.findAllByRmsEvaluatorsGrantAmountLetterIdAndIsDeleted(rmsEvaluatorsGrantAmountLetterId, false);
		if (list.isEmpty()) {
			return new ArrayList<>();
		}
		return convertForRead(list);
	}

	@Override
	public Response<RmsEvaluatorsGrantAmountResponseDto> saveList(List<RmsEvaluatorsGrantAmountRequestDto> request) {
		try {
			List<RmsEvaluatorsGrantAmountResponseDto> list = new ArrayList<>();
			request.forEach(e -> {
				if (e.getUuid() != null) {
					if (e.getDeleted() == 1) {
						delete(e.getUuid());
					} else {
						list.add(new ModelMapper().map(update(e).getObj(), RmsEvaluatorsGrantAmountResponseDto.class));
					}
				} else {
					list.add(new ModelMapper().map(create(e).getObj(), RmsEvaluatorsGrantAmountResponseDto.class));
				}
			});
			return new Response<>() {{
				setSuccess(true);
				setItems(list);
			}};
		} catch (Exception e) {
			log.error("Save not Saved");
			return getErrorResponse("Save Failed");
		}
	}
}
