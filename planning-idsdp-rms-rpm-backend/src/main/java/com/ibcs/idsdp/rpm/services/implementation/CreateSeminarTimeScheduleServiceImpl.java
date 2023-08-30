package com.ibcs.idsdp.rpm.services.implementation;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import com.ibcs.idsdp.rpm.model.domain.PresentationEvaluatorsFeedback;
import com.ibcs.idsdp.rpm.web.dto.response.PresentationEvaluatorsFeedbackResponseDto;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.UaaClientService;
import com.ibcs.idsdp.rpm.client.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.SectorTypeResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarTimeSchedule;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.repositories.CreateSeminarRepository;
import com.ibcs.idsdp.rpm.model.repositories.CreateSeminarTimeScheduleRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.services.CreateSeminarTimeScheduleService;
import com.ibcs.idsdp.rpm.services.LinkupProposalWithEvaluatorsService;
import com.ibcs.idsdp.rpm.web.dto.request.CreateSeminarTimeScheduleRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateSeminarTimeScheduleResponseDto;
import com.ibcs.idsdp.util.Response;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Service
@Transactional
public class CreateSeminarTimeScheduleServiceImpl extends
		BaseService<CreateSeminarTimeSchedule, CreateSeminarTimeScheduleRequestDto, CreateSeminarTimeScheduleResponseDto>
		implements CreateSeminarTimeScheduleService {

	private final CreateSeminarTimeScheduleRepository timeScheduleRepository;
	private final CreateSeminarRepository createSeminarRepository;
	private final ResearcherProposalRepository researcherProposalRepository;
	private final UaaClientService uaaClientService;
	private final RmsConfigurationClientService rmsConfigurationClientService;
	private final LinkupProposalWithEvaluatorsService linkupProposalWithEvaluatorsService;

	public CreateSeminarTimeScheduleServiceImpl(ServiceRepository<CreateSeminarTimeSchedule> repository,
			CreateSeminarTimeScheduleRepository timeScheduleRepository, CreateSeminarRepository createSeminarRepository,
			ResearcherProposalRepository researcherProposalRepository, UaaClientService uaaClientService,
			RmsConfigurationClientService rmsConfigurationClientService,LinkupProposalWithEvaluatorsService linkupProposalWithEvaluatorsService) {
		super(repository);
		this.timeScheduleRepository = timeScheduleRepository;
		this.createSeminarRepository = createSeminarRepository;
		this.researcherProposalRepository = researcherProposalRepository;
		this.uaaClientService = uaaClientService;
		this.rmsConfigurationClientService = rmsConfigurationClientService;
		this.linkupProposalWithEvaluatorsService = linkupProposalWithEvaluatorsService;
	}

	@Override
	public Response create(CreateSeminarTimeScheduleRequestDto createSeminarTimeScheduleRequestDto) {

		// seminar

		Optional<CreateSeminar> seminar = createSeminarRepository
				.findById(createSeminarTimeScheduleRequestDto.getSeminarId());

		if (seminar.isPresent()) {
			createSeminarTimeScheduleRequestDto.setM2CreateSeminarId(seminar.get());
		}

		// ResearcherProposal

		Optional<ResearcherProposal> proposal = researcherProposalRepository
				.findById(createSeminarTimeScheduleRequestDto.getProposalId());

		if (proposal.isPresent()) {
			createSeminarTimeScheduleRequestDto.setM1ResearcherProposalId(proposal.get());
		}

		return super.create(createSeminarTimeScheduleRequestDto);
	}

	@Override
	public Response<CreateSeminarTimeSchedule> doSave(List<CreateSeminarTimeScheduleRequestDto> requestDto) {
		Response<CreateSeminarTimeSchedule> response = new Response<>();
		try {
			requestDto.forEach(createSeminarTimeScheduleRequestDto -> {
				Optional<CreateSeminar> seminar = createSeminarRepository
						.findById(createSeminarTimeScheduleRequestDto.getSeminarId());
				if (seminar.isPresent()) {
					createSeminarTimeScheduleRequestDto.setM2CreateSeminarId(seminar.get());
				}

				// ResearcherProposal
				Optional<ResearcherProposal> proposal = researcherProposalRepository
						.findById(createSeminarTimeScheduleRequestDto.getProposalId());

				if (proposal.isPresent()) {
					createSeminarTimeScheduleRequestDto.setM1ResearcherProposalId(proposal.get());
				}

				super.create(createSeminarTimeScheduleRequestDto);
			});
			response.setMessage("Saved Success");
			response.setSuccess(true);

		} catch (Exception e) {
			response.setMessage("Saved Failed");
			response.setSuccess(true);
		}
		return response;

	}

	@Override
	public Response<CreateSeminarTimeSchedule> doUpdate(List<CreateSeminarTimeScheduleRequestDto> requestDto) {
		Optional<CreateSeminar> createSeminarOptional = createSeminarRepository
				.findById(requestDto.get(0).getSeminarId());

		timeScheduleRepository.deleteAllByM2CreateSeminarId(createSeminarOptional.get());
		Response<CreateSeminarTimeSchedule> response = new Response<>();

		try {
			requestDto.forEach(createSeminarTimeScheduleRequestDto -> {

				CreateSeminarTimeSchedule createSeminarTimeSchedule = new CreateSeminarTimeSchedule();

				Optional<CreateSeminar> seminar = createSeminarRepository
						.findById(createSeminarTimeScheduleRequestDto.getSeminarId());
				if (seminar.isPresent()) {
					createSeminarTimeScheduleRequestDto.setM2CreateSeminarId(seminar.get());
				}

				// ResearcherProposal
				Optional<ResearcherProposal> proposal = researcherProposalRepository
						.findById(createSeminarTimeScheduleRequestDto.getProposalId());
				if (proposal.isPresent()) {
					createSeminarTimeScheduleRequestDto.setM1ResearcherProposalId(proposal.get());
				}
				BeanUtils.copyProperties(createSeminarTimeScheduleRequestDto, createSeminarTimeSchedule);
				timeScheduleRepository.save(createSeminarTimeSchedule);
			});

			response.setMessage("Update Success");
			response.setSuccess(true);

		} catch (Exception e) {

			response.setMessage("Update Failed");
			response.setSuccess(false);

		}

		return response;
	}

	@Override
	protected CreateSeminarTimeSchedule convertForCreate(CreateSeminarTimeScheduleRequestDto dto) {

		CreateSeminarTimeSchedule entity = super.convertForCreate(dto);

		// CreateSeminar
		Optional<CreateSeminar> seminar = createSeminarRepository.findById(dto.getSeminarId());
		if (seminar.isPresent()) {
			entity.setM2CreateSeminarId(seminar.get());
		}

		// ResearcherProposal
		if (dto.getProposalId() != null) {
			Optional<ResearcherProposal> proposal = researcherProposalRepository.findById(dto.getProposalId());

			if (proposal.isPresent()) {
				entity.setM1ResearcherProposalId(proposal.get());
			}
		}

		return entity;
	}

	@Override
	protected void convertForUpdate(CreateSeminarTimeScheduleRequestDto dto, CreateSeminarTimeSchedule entity) {

		super.convertForUpdate(dto, entity);
		// CreateSeminar
		Optional<CreateSeminar> seminar = createSeminarRepository.findById(dto.getSeminarId());
		if (seminar.isPresent()) {
			entity.setM2CreateSeminarId(seminar.get());
		}

		// ResearcherProposal

		if (dto.getProposalId() != null) {
			Optional<ResearcherProposal> proposal = researcherProposalRepository.findById(dto.getProposalId());

			if (proposal.isPresent()) {
				entity.setM1ResearcherProposalId(proposal.get());
			}
		}
	}

	@Override
	public Boolean seminarIsExists(Long seminarId) {

		Optional<CreateSeminar> optional = createSeminarRepository.findByIdAndIsDeleted(seminarId, false);

		if (optional.isEmpty()) {

			return false;
		}
		return timeScheduleRepository.existsByM2CreateSeminarId(optional.get());
	}

	@Override
	public Response<CreateSeminarTimeScheduleResponseDto> findAllBySeminarId(Long seminarId) {

		Optional<CreateSeminar> optional = createSeminarRepository.findByIdAndIsDeleted(seminarId, false);

		if (!optional.isPresent()) {
			return getErrorResponse("Seminar not found !.");
		}

		List<CreateSeminarTimeSchedule> createSeminarTimeScheduleList = timeScheduleRepository
				.findAllByM2CreateSeminarIdAndIsDeleted(optional.get(), false);

		if (createSeminarTimeScheduleList != null && createSeminarTimeScheduleList.size() > 0) {

			return new Response<CreateSeminarTimeScheduleResponseDto>() {
				{
					setSuccess(true);
					setMessage("Data found !.");
					setItems(convertForRead(createSeminarTimeScheduleList));
				}
			};
		}

		return getErrorResponse("Data not found !.");
	}

	@Override
	protected List<CreateSeminarTimeScheduleResponseDto> convertForRead(List<CreateSeminarTimeSchedule> e) {

		List<CreateSeminarTimeScheduleResponseDto> list = super.convertForRead(e);
		return list;

//		if (list.isEmpty()) {
//			return list;
//		}
//
//		Map<Long, UserResponse> userResponseMap = Objects.requireNonNull(uaaClientService
//				.getUserByIdSet(list.stream().map(m -> m.getConcernedPersonUserId()).collect(Collectors.toSet()))
//				.getBody()).stream().collect(Collectors.toMap(UserResponse::getId, dto -> dto));

//		Map<Long, UserResponse> userResponseMap1 = Objects
//				.requireNonNull(uaaClientService.getUserByIdSet(list.stream()
//						.filter(f -> f.getM1ResearcherProposalId() != null)
//						.map(m -> m.getM1ResearcherProposalId().getResearcherProfilePersonalInfoMaster().getUserId())
//						.collect(Collectors.toSet())).getBody())
//				.stream().collect(Collectors.toMap(UserResponse::getId, dto -> dto));
//
//		Map<Long, ResearchCategoryTypeResponseDto> researchCategoryTypeMap = Objects.requireNonNull(
//				rmsConfigurationClientService.getByResearchCategoryTypeByIdSet(new IdSetRequestBodyDTO() {
//					{
//						setIds(list.stream()
//								.filter(f -> f.getM1ResearcherProposalId() != null
//										&& f.getM1ResearcherProposalId().getStResearchCatTypeId() != null)
//								.map(m -> m.getM1ResearcherProposalId().getStResearchCatTypeId())
//								.collect(Collectors.toSet()));
//					}
//				}).getItems()).stream().collect(Collectors.toMap(ResearchCategoryTypeResponseDto::getId, dto -> dto));
//
//		Map<Long, SectorTypeResponseDto> sectorTypeMap = Objects
//				.requireNonNull(rmsConfigurationClientService.getBySectorTypeIdSet(new IdSetRequestBodyDTO() {
//					{
//						setIds(list.stream()
//								.filter(f -> f.getM1ResearcherProposalId() != null
//										&& f.getM1ResearcherProposalId().getStSectorTypeId() != null)
//								.map(m -> m.getM1ResearcherProposalId().getStResearchCatTypeId())
//								.collect(Collectors.toSet()));
//					}
//				}).getItems()).stream().collect(Collectors.toMap(SectorTypeResponseDto::getId, dto -> dto));
//
//		return list.stream().sorted(Comparator.comparing(CreateSeminarTimeScheduleResponseDto::getId).reversed())
//				.peek(p -> {
//					p.setUserDto(userResponseMap.get(p.getConcernedPersonUserId()));
//					if (p.getM1ResearcherProposalId() != null) {
//
//						p.getM1ResearcherProposalId().getResearcherProfilePersonalInfoMaster()
//								.setUserDto(userResponseMap1.get(p.getM1ResearcherProposalId()
//										.getResearcherProfilePersonalInfoMaster().getUserId()));
//					}
//
//					if (p.getM1ResearcherProposalId() != null
//							&& p.getM1ResearcherProposalId().getStResearchCatTypeId() != null) {
//						p.getM1ResearcherProposalId().setCategoryType(
//								researchCategoryTypeMap.get(p.getM1ResearcherProposalId().getStResearchCatTypeId()));
//					}
//
//					if (p.getM1ResearcherProposalId() != null
//							&& p.getM1ResearcherProposalId().getStSectorTypeId() != null) {
//						p.getM1ResearcherProposalId()
//								.setFieldName(sectorTypeMap.get(p.getM1ResearcherProposalId().getStSectorTypeId()));
//					}
//
//				}).collect(Collectors.toList());

	}

}
