package com.ibcs.idsdp.rpm.services.implementation;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.dto.response.CommonTypesResponseDto;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarTimeSchedule;
import com.ibcs.idsdp.rpm.model.domain.ResearcherPresentation;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.repositories.CreateSeminarRepository;
import com.ibcs.idsdp.rpm.model.repositories.CreateSeminarTimeScheduleRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherPresentationRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.services.ResearcherPresentationService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherPresentationRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateSeminarResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateSeminarTimeScheduleResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherPresentationResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.util.Response;

import net.sf.ehcache.hibernate.management.impl.BeanUtils;

@Service
public class ResearcherPresentationServiceImpl
		extends BaseService<ResearcherPresentation, ResearcherPresentationRequestDto, ResearcherPresentationResponseDto>
		implements ResearcherPresentationService {

	private final CreateSeminarTimeScheduleRepository createSeminarTimeScheduleRepository;
	private final CreateSeminarRepository createSeminarRepository;
	private final ResearcherProposalRepository researcherProposalRepository;
	private final ResearcherPresentationRepository researcherPresentationRepository;
	private final RmsConfigurationClientService rmsConfigurationClientService;

	@Autowired
	private ResearcherProposalServiceImpl researcherProposalServiceImpl;

	protected ResearcherPresentationServiceImpl(ServiceRepository<ResearcherPresentation> repository,
			CreateSeminarTimeScheduleRepository createSeminarTimeScheduleRepository,
			CreateSeminarRepository createSeminarRepository, ResearcherProposalRepository researcherProposalRepository,
			ResearcherPresentationRepository researcherPresentationRepository,
			RmsConfigurationClientService rmsConfigurationClientService) {
		super(repository);
		this.createSeminarTimeScheduleRepository = createSeminarTimeScheduleRepository;
		this.createSeminarRepository = createSeminarRepository;
		this.researcherProposalRepository = researcherProposalRepository;
		this.researcherPresentationRepository = researcherPresentationRepository;
		this.rmsConfigurationClientService = rmsConfigurationClientService;
	}

	@Override
	protected ResearcherPresentationResponseDto convertForRead(ResearcherPresentation researcherPresentation) {
		ResearcherPresentationResponseDto dto = super.convertForRead(researcherPresentation);
		dto.setM2CreateSeminarId(researcherPresentation.getCreateSeminar().getId());
		dto.setCreateSeminarDto(
				new ModelMapper().map(researcherPresentation.getCreateSeminar(), CreateSeminarResponseDto.class));
		dto.setM1ResearcherProposalId(researcherPresentation.getResearcherProposal().getId());
		dto.setResearcherProposalDto(researcherProposalServiceImpl.getById(dto.getM1ResearcherProposalId()).getObj());
		return dto;
	}

	@Override
	protected List<ResearcherPresentationResponseDto> convertForRead(List<ResearcherPresentation> e) {

		List<ResearcherPresentationResponseDto> list = super.convertForRead(e);
		if (list.isEmpty()) {
			return list;
		}

		Map<Long, CommonTypesResponseDto> commonTypeResponseDtoMap = rmsConfigurationClientService
				.getCommonTypeByIdSet(new IdSetRequestBodyDTO() {
					{
						setIds(list.stream().map(ResearcherPresentationResponseDto::getPresentationType)
								.collect(Collectors.toSet()));
					}
				}).getItems().stream().collect(Collectors.toMap(UuidIdHolderRequestBodyDTO::getId, dto -> dto));

		return list.stream().peek(p -> {
			p.setCommonTypesResponseDto(commonTypeResponseDtoMap.get(p.getPresentationType()));
		}).collect(Collectors.toList());
	}

	@Override
	protected ResearcherPresentation convertForCreate(ResearcherPresentationRequestDto i) {
		ResearcherPresentation entity = super.convertForCreate(i);

		Optional<CreateSeminar> optionalSeminar = createSeminarRepository.findByIdAndIsDeleted(i.getM2CreateSeminarId(),
				false);
		Optional<ResearcherProposal> optionalResearcherProposal = researcherProposalRepository
				.findByIdAndIsDeleted(i.getM1ResearcherProposalId(), false);

		if (optionalSeminar.isEmpty()) {
			throw new ServiceExceptionHolder.InvalidRequestException("Seminar not found !.");
		}

		if (optionalResearcherProposal.isEmpty()) {
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found !.");
		}

		entity.setCreateSeminar(optionalSeminar.get());
		entity.setResearcherProposal(optionalResearcherProposal.get());

		return entity;
	}

	@Override
	protected void convertForUpdate(ResearcherPresentationRequestDto dto, ResearcherPresentation entity) {

		Optional<CreateSeminar> optionalSeminar = createSeminarRepository
				.findByIdAndIsDeleted(dto.getM2CreateSeminarId(), false);
		Optional<ResearcherProposal> optionalResearcherProposal = researcherProposalRepository
				.findByIdAndIsDeleted(dto.getM1ResearcherProposalId(), false);

		if (optionalSeminar.isEmpty()) {
			throw new ServiceExceptionHolder.InvalidRequestException("Seminar not found !.");
		}

		if (optionalResearcherProposal.isEmpty()) {
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found !.");
		}

		entity.setCreateSeminar(optionalSeminar.get());
		entity.setResearcherProposal(optionalResearcherProposal.get());

		super.convertForUpdate(dto, entity);
	}

	@Override
	public Response<CreateSeminarTimeScheduleResponseDto> getResearchTittleListFindBySeminarId(String createSeminarUuid) {

		Optional<CreateSeminar> optional = createSeminarRepository.findByUuidAndIsDeleted(createSeminarUuid, false);

		if (optional.isEmpty()) {
			getErrorResponse("Create Seminar Not Found !.");
		}

		List<CreateSeminarTimeSchedule> list = createSeminarTimeScheduleRepository.findAllByM2CreateSeminarIdAndIsDeleted(optional.get(), false);

		if (list != null && !CollectionUtils.isEmpty(list)) {			

			Map<Long, ResearcherProposalResponseDto> proposalResponseDtoMap = (researcherProposalServiceImpl.convertForRead(
					    list.stream()
					        .filter(f -> f.getM1ResearcherProposalId() != null)
							.map(CreateSeminarTimeSchedule::getM1ResearcherProposalId).distinct()
							.collect(Collectors.toList())))
					        .stream()
							.collect(Collectors.toMap(ResearcherProposalResponseDto::getId, dto -> dto));

			return new Response<CreateSeminarTimeScheduleResponseDto>() {
				{
					setMessage("Data Found!.");
					setItems(list.stream()
							     .filter(f -> f.getM1ResearcherProposalId() != null)
							     .map(m -> {
						CreateSeminarTimeScheduleResponseDto dto = new CreateSeminarTimeScheduleResponseDto();
						org.springframework.beans.BeanUtils.copyProperties(m, dto);
						if (dto.getM1ResearcherProposalId() != null) {
							dto.setResearcherProposalDto(proposalResponseDtoMap.get(dto.getM1ResearcherProposalId().getId()));
						}
						return dto;
					}).collect(Collectors.toList()));
					setSuccess(true);
					
				}
			};
		}

		return getErrorResponse("Data Not Found!.");
	}

	@Override
	public Response<ResearcherPresentationResponseDto> getResearchPresentationBySeminarUuid(String seminarUuid) {
		Optional<CreateSeminar> createSeminar = createSeminarRepository.findByUuidAndIsDeleted(seminarUuid, false);
		Optional<ResearcherPresentation> researcherPresentation = researcherPresentationRepository
				.findByCreateSeminarIdAndIsDeleted(createSeminar.get().getId(), false);
		if (researcherPresentation.isEmpty()) {
			return getSuccessResponse("Data not found by this seminar id");
		}

		return new Response<>() {
			{
				setSuccess(true);
				setMessage("Data found by seminar id");
				setObj(convertForRead(researcherPresentation.get()));
			}
		};
	}

	@Override
	public Response<ResearcherPresentationResponseDto> findByResearcherProposalId(Long researcherProposalId) {
		Optional<ResearcherProposal> optionalResearcherProposal = researcherProposalRepository
				.findByIdAndIsDeleted(researcherProposalId, false);

		if (optionalResearcherProposal.isEmpty()) {
			getErrorResponse("Researcher Proposal not found !.");
		}

		Optional<ResearcherPresentation> rpOptional = researcherPresentationRepository
				.findByResearcherProposalIdAndIsDeleted(optionalResearcherProposal.get(), false);

		if (rpOptional.isPresent()) {
			return new Response<ResearcherPresentationResponseDto>() {
				{
					setMessage("Data Found!.");
					setObj(convertForRead(rpOptional.get()));
					setSuccess(true);
				}
			};
		}
		return getErrorResponse("Data Not Found!.");
	}

	@Override
	public Response<ResearcherPresentationResponseDto> findAllByResearcherProposalId(Long researcherProposalId) {
		Optional<ResearcherProposal> optionalResearcherProposal = researcherProposalRepository
				.findByIdAndIsDeleted(researcherProposalId, false);

		if (optionalResearcherProposal.isEmpty()) {
			getErrorResponse("Researcher Proposal not found !.");
		}

		List<ResearcherPresentation> list = researcherPresentationRepository
				.findAllByResearcherProposalIdAndIsDeleted(optionalResearcherProposal.get().getId(), false);

		if (list != null && list.size() > 0) {
			return new Response<ResearcherPresentationResponseDto>() {
				{
					setMessage("Data Found!.");
					setItems(convertForRead(list));
					setSuccess(true);
				}
			};
		}
		return getErrorResponse("Data Not Found!.");
	}

}
