package com.ibcs.idsdp.rpm.services.implementation;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.UaaClientService;
import com.ibcs.idsdp.rpm.client.dto.response.ExpertEvaluatorResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.model.domain.NewMember;
import com.ibcs.idsdp.rpm.model.domain.PresentationEvaluatorsFeedback;
import com.ibcs.idsdp.rpm.model.domain.ResearcherPresentation;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.domain.ViewPresentationEvaluatorsFeedback;
import com.ibcs.idsdp.rpm.model.repositories.CreateSeminarRepository;
import com.ibcs.idsdp.rpm.model.repositories.CreateSeminarTimeScheduleRepository;
import com.ibcs.idsdp.rpm.model.repositories.NewMemberRepository;
import com.ibcs.idsdp.rpm.model.repositories.PresentationEvaluatorsFeedbackRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherPresentationRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.model.repositories.ViewPresentationEvaluatorsFeedbackRepository;
import com.ibcs.idsdp.rpm.services.PresentationEvaluatorsFeedbackService;
import com.ibcs.idsdp.rpm.services.PresentationReportService;
import com.ibcs.idsdp.rpm.web.dto.request.FeedbackListRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.PresentationEvaluatorsFeedbackRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherFeedbackRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.FeedbackListResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.NewMemberResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.PresentationEvaluatorsFeedbackResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.PresentationReportResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearchTittleResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherPresentationResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.util.Response;

import lombok.NonNull;

@Service
public class PresentationEvaluatorsFeedbackServiceImpl extends
		BaseService<PresentationEvaluatorsFeedback, PresentationEvaluatorsFeedbackRequestDto, PresentationEvaluatorsFeedbackResponseDto>
		implements PresentationEvaluatorsFeedbackService {

	private static final int DEFAULT_PAGE_SIZE = 1000000;

	private final PresentationEvaluatorsFeedbackRepository repository;
	private final ViewPresentationEvaluatorsFeedbackRepository viewPresentationEvaluatorsFeedbackRepository;
	private final ResearcherPresentationRepository researcherPresentationRepository;
	private final ResearcherProposalRepository researcherProposalRepository;
	private final ResearcherProposalServiceImpl researcherProposalServiceImpl;
	private final NewMemberRepository newMemberRepository;
	private final EntityManagerFactory entityManagerFactory;
	private final CreateSeminarRepository createSeminarRepository;
	private final RmsConfigurationClientService rmsConfigurationClientService;
	private final CreateSeminarTimeScheduleRepository createSeminarTimeScheduleRepository;
	private final PresentationReportService presentationReportService;
	private final UaaClientService uaaClientService;

	protected PresentationEvaluatorsFeedbackServiceImpl(ServiceRepository<PresentationEvaluatorsFeedback> repository,
			PresentationEvaluatorsFeedbackRepository repository1,
			ViewPresentationEvaluatorsFeedbackRepository viewPresentationEvaluatorsFeedbackRepository,
			ResearcherPresentationRepository researcherPresentationRepository,
			ResearcherProposalRepository researcherProposalRepository,
			ResearcherProposalServiceImpl researcherProposalServiceImpl, NewMemberRepository newMemberRepository,
			EntityManagerFactory entityManagerFactory, CreateSeminarRepository createSeminarRepository,
			RmsConfigurationClientService rmsConfigurationClientService,
			CreateSeminarTimeScheduleRepository createSeminarTimeScheduleRepository,
			PresentationReportService presentationReportService, UaaClientService uaaClientService) {
		super(repository);
		this.repository = repository1;
		this.viewPresentationEvaluatorsFeedbackRepository = viewPresentationEvaluatorsFeedbackRepository;
		this.researcherPresentationRepository = researcherPresentationRepository;
		this.researcherProposalRepository = researcherProposalRepository;
		this.researcherProposalServiceImpl = researcherProposalServiceImpl;
		this.newMemberRepository = newMemberRepository;
		this.entityManagerFactory = entityManagerFactory;
		this.createSeminarRepository = createSeminarRepository;
		this.rmsConfigurationClientService = rmsConfigurationClientService;
		this.createSeminarTimeScheduleRepository = createSeminarTimeScheduleRepository;
		this.presentationReportService = presentationReportService;
		this.uaaClientService = uaaClientService;
	}

	@Override
	protected PresentationEvaluatorsFeedbackResponseDto convertForRead(PresentationEvaluatorsFeedback e) {

		PresentationEvaluatorsFeedbackResponseDto responseDto = super.convertForRead(e);

		ResearcherPresentationResponseDto researcherPresentationResponseDto = null;
		ResearcherProposalResponseDto researcherProposalResponseDto = null;
		NewMemberResponseDto newMemberResponseDto = null;

		if (e.getResearcherPresentation() != null && e.getResearcherPresentation().getId() != null) {
			responseDto.setM2ResearcherPresentationId(e.getResearcherPresentation().getId());
			researcherPresentationResponseDto = new ModelMapper().map(researcherPresentationRepository
					.findByIdAndIsDeleted(e.getResearcherPresentation().getId(), false).orElse(null),
					ResearcherPresentationResponseDto.class);
		}

		if (e.getResearcherProposal() != null && e.getResearcherProposal().getId() != null) {
			responseDto.setM1ResearcherProposalId(e.getResearcherProposal().getId());
			researcherProposalResponseDto = new ModelMapper().map(researcherProposalRepository
					.findByIdAndIsDeleted(e.getResearcherProposal().getId(), false).orElse(null),
					ResearcherProposalResponseDto.class);
		}

		if (e.getNewMember() != null && e.getNewMember() != null) {
			responseDto.setM2AddNewMemberId(e.getNewMember().getId());
			newMemberResponseDto = new ModelMapper().map(
					newMemberRepository.findByIdAndIsDeleted(e.getNewMember().getId(), false).orElse(null),
					NewMemberResponseDto.class);
		}

		responseDto.setResearcherPresentationResponseDto(researcherPresentationResponseDto);
		responseDto.setResearcherProposalResponseDto(researcherProposalResponseDto);
		responseDto.setNewMemberResponseDto(newMemberResponseDto);

		return responseDto;
	}

	protected PresentationEvaluatorsFeedbackResponseDto convertForRead2(PresentationEvaluatorsFeedback e) {

		PresentationEvaluatorsFeedbackResponseDto responseDto = super.convertForRead(e);

		ResearcherPresentationResponseDto researcherPresentationResponseDto = null;
		ResearcherProposalResponseDto researcherProposalResponseDto = null;
		NewMemberResponseDto newMemberResponseDto = null;

		if (e.getResearcherPresentation() != null && e.getResearcherPresentation().getId() != null) {
			responseDto.setM2ResearcherPresentationId(e.getResearcherPresentation().getId());
			researcherPresentationResponseDto = new ModelMapper().map(researcherPresentationRepository
					.findByIdAndIsDeleted(e.getResearcherPresentation().getId(), false).orElse(null),
					ResearcherPresentationResponseDto.class);
		}

		if (e.getResearcherProposal() != null && e.getResearcherProposal().getId() != null) {
			responseDto.setM1ResearcherProposalId(e.getResearcherProposal().getId());
			researcherProposalResponseDto = new ModelMapper().map(researcherProposalRepository
					.findByIdAndIsDeleted(e.getResearcherProposal().getId(), false).orElse(null),
					ResearcherProposalResponseDto.class);
		}

		if (e.getNewMember() != null && e.getNewMember() != null) {
			responseDto.setM2AddNewMemberId(e.getNewMember().getId());
			newMemberResponseDto = new ModelMapper().map(
					newMemberRepository.findByIdAndIsDeleted(e.getNewMember().getId(), false).orElse(null),
					NewMemberResponseDto.class);
		}

		responseDto.setResearcherPresentationResponseDto(researcherPresentationResponseDto);
		responseDto.setResearcherProposalResponseDto(researcherProposalResponseDto);
		responseDto.setNewMemberResponseDto(newMemberResponseDto);

		return responseDto;
	}

	@Override
	protected List<PresentationEvaluatorsFeedbackResponseDto> convertForRead(List<PresentationEvaluatorsFeedback> e) {
		List<PresentationEvaluatorsFeedbackResponseDto> list = super.convertForRead(e);
		if (list.isEmpty())
			return list;

		Set<Long> evaluatorIdSet = e.stream().map(PresentationEvaluatorsFeedback::getStProfileOfExpertEvaluatorsId)
				.filter(Objects::nonNull).collect(Collectors.toSet());
		Map<Long, ExpertEvaluatorResponseDto> expertEvaluatorResponseDtoMap = new HashMap<>();
		if (!evaluatorIdSet.isEmpty()) {
			expertEvaluatorResponseDtoMap = rmsConfigurationClientService
					.getByExpertEvaluatorIdSet(new IdSetRequestBodyDTO() {
						{
							setIds(evaluatorIdSet);
						}
					}).getItems().stream().collect(Collectors.toMap(UuidIdHolderRequestBodyDTO::getId, dto -> dto));
		}

		Map<Long, ExpertEvaluatorResponseDto> finalExpertEvaluatorResponseDtoMap = expertEvaluatorResponseDtoMap;
		return list.stream()
				.peek(p -> p.setExpertEvaluatorResponseDto(Objects.nonNull(p.getStProfileOfExpertEvaluatorsId())
						? finalExpertEvaluatorResponseDtoMap.get(p.getStProfileOfExpertEvaluatorsId())
						: null))
				.collect(Collectors.toList());
	}

	@Override
	protected PresentationEvaluatorsFeedback convertForCreate(PresentationEvaluatorsFeedbackRequestDto dto) {

		ResearcherPresentation researcherPresentation = null;
		ResearcherProposal researcherProposal = null;
		NewMember addNewMember = null;

		if (dto.getM2ResearcherPresentationId() != null) {
			researcherPresentation = researcherPresentationRepository
					.findByIdAndIsDeleted(dto.getM2ResearcherPresentationId(), false).orElse(null);
		}

		if (dto.getM1ResearcherProposalId() != null) {
			researcherProposal = researcherProposalRepository
					.findByIdAndIsDeleted(dto.getM1ResearcherProposalId(), false).orElse(null);
		}

		if (dto.getM2AddNewMemberId() != null) {
			addNewMember = newMemberRepository.findByIdAndIsDeleted(dto.getM2AddNewMemberId(), false).orElse(null);
		}

		PresentationEvaluatorsFeedback entity = super.convertForCreate(dto);
		entity.setResearcherPresentation(researcherPresentation);
		entity.setResearcherProposal(researcherProposal);
		entity.setNewMember(addNewMember);

		return super.convertForCreate(dto);
	}

	@Override
	protected void convertForUpdate(PresentationEvaluatorsFeedbackRequestDto dto,
			PresentationEvaluatorsFeedback entity) {

		ResearcherPresentation researcherPresentation = null;
		ResearcherProposal researcherProposal = null;
		NewMember addNewMember = null;

		if (dto.getM2ResearcherPresentationId() != null) {
			researcherPresentation = researcherPresentationRepository
					.findByIdAndIsDeleted(dto.getM2ResearcherPresentationId(), false).orElse(null);
		}

		if (dto.getM1ResearcherProposalId() != null) {
			researcherProposal = researcherProposalRepository
					.findByIdAndIsDeleted(dto.getM1ResearcherProposalId(), false).orElse(null);
		}

		if (dto.getM2AddNewMemberId() != null) {
			addNewMember = newMemberRepository.findByIdAndIsDeleted(dto.getM2AddNewMemberId(), false).orElse(null);
		}

		entity.setResearcherPresentation(researcherPresentation);
		entity.setResearcherProposal(researcherProposal);
		entity.setNewMember(addNewMember);
		super.convertForUpdate(dto, entity);
	}

	@Override
	public Response<PresentationEvaluatorsFeedbackResponseDto> getByUuid(@NonNull String uuid) {
		Response<PresentationEvaluatorsFeedbackResponseDto> response = super.getByUuid(uuid);
		if (response.getObj() != null) {
			if (response.getObj().getStProfileOfExpertEvaluatorsId() != null)
				response.getObj().setExpertEvaluatorResponseDto(rmsConfigurationClientService
						.getByExpertEvaluatorId(response.getObj().getStProfileOfExpertEvaluatorsId()).getObj());
		}
		return response;
	}

	@Override
	public Response<PresentationEvaluatorsFeedbackResponseDto> getById(@NonNull Long id) {
		Response<PresentationEvaluatorsFeedbackResponseDto> response = super.getById(id);
		if (response.getObj() != null) {
			if (response.getObj().getStProfileOfExpertEvaluatorsId() != null)
				response.getObj().setExpertEvaluatorResponseDto(rmsConfigurationClientService
						.getByExpertEvaluatorId(response.getObj().getStProfileOfExpertEvaluatorsId()).getObj());
		}
		return response;
	}

	@Override
	public Response<PresentationEvaluatorsFeedbackResponseDto> create(
			PresentationEvaluatorsFeedbackRequestDto presentationEvaluatorsFeedbackRequestDto) {
		Response<PresentationEvaluatorsFeedbackResponseDto> response = super.create(
				presentationEvaluatorsFeedbackRequestDto);
		if (response.getObj() != null) {
			if (response.getObj().getStProfileOfExpertEvaluatorsId() != null)
				response.getObj().setExpertEvaluatorResponseDto(rmsConfigurationClientService
						.getByExpertEvaluatorId(response.getObj().getStProfileOfExpertEvaluatorsId()).getObj());
		}
		return response;
	}

	@Override
	public Response<PresentationEvaluatorsFeedbackResponseDto> update(
			PresentationEvaluatorsFeedbackRequestDto presentationEvaluatorsFeedbackRequestDto) {
		Response<PresentationEvaluatorsFeedbackResponseDto> response = super.update(
				presentationEvaluatorsFeedbackRequestDto);
		if (response.getObj() != null) {
			if (response.getObj().getStProfileOfExpertEvaluatorsId() != null)
				response.getObj().setExpertEvaluatorResponseDto(rmsConfigurationClientService
						.getByExpertEvaluatorId(response.getObj().getStProfileOfExpertEvaluatorsId()).getObj());
		}
		return response;
	}

	@Override
	public Response<ViewPresentationEvaluatorsFeedback> findEvaluatorBySeminarId(Long seminarId) {
		List<ViewPresentationEvaluatorsFeedback> list = viewPresentationEvaluatorsFeedbackRepository
				.findAllByM2CreateSeminarId(seminarId);

		if (list != null && list.size() > 0) {

			Map<Long, ExpertEvaluatorResponseDto> expertEvaluatorResponseDtoMap = rmsConfigurationClientService
					.getByExpertEvaluatorIdSet(new IdSetRequestBodyDTO() {
						{
							setIds(list.stream()
									.map(ViewPresentationEvaluatorsFeedback::getStProfileOfExpertEvaluatorsId)
									.collect(Collectors.toSet()));
						}
					}).getItems().stream().collect(Collectors.toMap(UuidIdHolderRequestBodyDTO::getId, dto -> dto));

			return new Response<ViewPresentationEvaluatorsFeedback>() {
				{
					setSuccess(true);
					setMessage("Data Found !.");
					setItems(list.stream()
							.peek(p -> p.setExpertEvaluatorDto(
									expertEvaluatorResponseDtoMap.get(p.getStProfileOfExpertEvaluatorsId())))
							.collect(Collectors.toList()));
				}
			};
		}

		return getErrorResponse("Data Not Found !.");
	}

	@Override
	public Page<FeedbackListResponseDto> feedbackListGroupByResearcherProposal(FeedbackListRequestDto feedbackListRequestDto) {

		return test(feedbackListRequestDto);

//		Pageable pageable = getPageable(feedbackListRequestDto.getPageableRequestBodyDTO());
//		long total = 0L;
//
//		String SQL = getSql(feedbackListRequestDto);
//		EntityManager entityManager = entityManagerFactory.createEntityManager();
//		Query nativeQuery = entityManager.createNativeQuery(SQL);
//		List<Object[]> l = nativeQuery.getResultList();
//
//		List<FeedbackListResponseDto> list = new ArrayList<FeedbackListResponseDto>();
//
//		for (Object[] objects : l) {
//			if (objects[0] != null) {
//
//				FeedbackListResponseDto dto = new FeedbackListResponseDto();
//
//				if (objects[0] != null) {
//					dto.setResearcherProposalId(Long.parseLong(objects[0].toString()));
//				}
//
//				if (objects[1] != null) {
//					dto.setResearcherProfilePersonalInfoMasterId(Long.parseLong(objects[1].toString()));
//				}
//
//				if (objects[2] != null) {
//					dto.setResearchTitle(objects[2].toString());
//				}
//
//				if (objects[3] != null) {
//					dto.setStFiscalYearId(Long.parseLong(objects[3].toString()));
//				}
//
//				if (objects[4] != null) {
//					dto.setUserId(Long.parseLong(objects[4].toString()));
//					dto.setUser(uaaClientService.getUser(dto.getUserId()).getBody());
//				}
//
//				if (objects[5] != null) {
//					dto.setTotalFeedback(Long.parseLong(objects[5].toString()));
//				} else {
//					dto.setTotalFeedback(0l);
//				}
//
//				if (objects[6] != null) {
//					dto.setNewFeedback(Long.parseLong(objects[6].toString()));
//				} else {
//					dto.setNewFeedback(0l);
//				}
//
//				if (objects[7] != null) {
//					dto.setCompletedFeedback(Long.parseLong(objects[7].toString()));
//				} else {
//					dto.setCompletedFeedback(0l);
//				}
//
//				if (objects[8] != null) {
//					dto.setPresentationStatus(Long.parseLong(objects[8].toString()));
//				}
//
//				if (objects[9] != null) {
//					dto.setResearcherPresentationId(Long.parseLong(objects[9].toString()));
//				}
//
//				if (objects[10] != null) {
//					dto.setCreateSeminarId(Long.parseLong(objects[10].toString()));
//				}
//
//				if (objects[11] != null) {
//					dto.setResearcherProposalUuid(objects[11].toString());
//				}
//
//				if (objects[12] != null) {
//					dto.setExpertEvaluatorsId(Long.parseLong(objects[12].toString()));
//				}
//
//				total = Long.parseLong(objects[13].toString());
//				list.add(dto);
//			}
//		}
//
//		return new PageImpl<>(list, pageable, total);
	}

	private Page<FeedbackListResponseDto> test(FeedbackListRequestDto feedbackListRequestDto) {

		List<FeedbackListResponseDto> list = new ArrayList<FeedbackListResponseDto>();
		Pageable pageable = getPageable(feedbackListRequestDto.getPageableRequestBodyDTO());
		long total = 0L;
		String SQL = getSql(feedbackListRequestDto);

		Connection con = null;
		ResultSet rs = null;
		Statement stm = null;

		try {
			//System.out.println("SQL === >>>> " + SQL);
			con = getOraConnection();
			stm = con.createStatement();
			rs = stm.executeQuery(SQL);

			while (rs.next()) {

				FeedbackListResponseDto dto = new FeedbackListResponseDto();
				dto.setResearcherProposalId(rs.getLong("m1_researcher_proposal_id"));
				if (dto.getResearcherProposalId() == null || dto.getResearcherProposalId() == 0) {
					break;
				}

				dto.setResearcherProfilePersonalInfoMasterId(rs.getLong("researcher_profile_personal_info_master_id"));
				dto.setResearchTitle(rs.getString("research_title"));
				dto.setStFiscalYearId(rs.getLong("st_fiscal_year_id"));
				dto.setUserId(rs.getLong("user_id"));
				if(dto.getUserId() !=null) {
					dto.setUser(uaaClientService.getUser(dto.getUserId()).getBody());
				}
				dto.setTotalFeedback(rs.getLong("total_feedback"));
				dto.setNewFeedback(rs.getLong("new_feedback"));
				dto.setCompletedFeedback(rs.getLong("completed_feedback"));
				dto.setPresentationStatus(rs.getLong("presentation_status"));
				dto.setResearcherPresentationId(rs.getLong("researcher_presentation_id"));
				dto.setCreateSeminarId(rs.getLong("m2_create_seminar_id"));
				dto.setResearcherProposalUuid(rs.getString("researcher_proposal_uuid"));
				dto.setExpertEvaluatorsId(rs.getLong("st_profile_of_expert_evaluators_id"));
				total = rs.getLong("total");
				list.add(dto);

			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			try {
				if (rs != null) {
					rs.close();
				}
				if (stm != null) {
					stm.close();
				}
				if (con != null) {
					con.close();
				}

			} catch (SQLException e) {
				e.printStackTrace();
			}

		}

		return new PageImpl<>(list, pageable, total);
	}

	private String getSql(FeedbackListRequestDto feedbackListRequestDto) {

		Pageable pageable = getPageable(feedbackListRequestDto.getPageableRequestBodyDTO());
		Long total = 0L;

		StringBuilder strbuilder = new StringBuilder();
		strbuilder.append("with cte as ( ");
		strbuilder.append(
				"select pef.m1_researcher_proposal_id,	rppi.id as researcher_profile_personal_info_master_id, ");
		strbuilder.append("rpro.research_title,	rpro.st_fiscal_year_id , ");
		strbuilder.append("rppi.user_id ,	count(pef.m1_researcher_proposal_id) total_feedback, ");
		strbuilder.append("sub1.new_feedback,	sub2.completed_feedback, ");
		strbuilder.append("rp.presentation_status, ");
		strbuilder.append("rp.id as researcher_presentation_id , ");
		strbuilder.append("rp.m2_create_seminar_id , ");
		strbuilder.append("rpro.uuid as researcher_proposal_uuid, ");
		strbuilder.append("lpwe.st_profile_of_expert_evaluators_id ");
		strbuilder.append("from m2_presentation_evaluators_feedback pef ");
		strbuilder.append("left join  ");
		strbuilder.append(
				"(select pef.m1_researcher_proposal_id, count(*) as new_feedback from	m2_presentation_evaluators_feedback pef	group by pef.m1_researcher_proposal_id,	pef.is_new	having	pef.is_new = true) sub1 ");
		strbuilder.append("on pef.m1_researcher_proposal_id = sub1.m1_researcher_proposal_id ");
		strbuilder.append("left join  ");
		strbuilder.append(
				"(select	pef.m1_researcher_proposal_id,	count(*) as completed_feedback from	m2_presentation_evaluators_feedback pef	group by pef.m1_researcher_proposal_id , pef.feedback_completed	having pef.feedback_completed = true ) sub2  ");
		strbuilder.append("on 	pef.m1_researcher_proposal_id = sub2.m1_researcher_proposal_id ");
		strbuilder.append("left join ");
		strbuilder.append("m2_researcher_presentation rp ");
		strbuilder.append(" on	rp.id = pef.m2_researcher_presentation_id ");
		strbuilder.append("left join ");
		strbuilder.append("m1_researcher_proposal rpro  ");
		strbuilder.append("on	rpro.id = pef.m1_researcher_proposal_id ");
		strbuilder.append("left join ");
		strbuilder.append("m1_researcher_profile_personal_info rppi ");
		strbuilder.append("on	rppi.id = rpro.researcher_profile_personal_info_master_id ");
		strbuilder.append("left join  ");
		strbuilder.append("m1_linkup_proposal_with_evaluators lpwe  on lpwe.researcher_proposal_id = rpro.id  ");
		strbuilder.append("where ");
		strbuilder.append("rpro.st_fiscal_year_id = coalesce(" + feedbackListRequestDto.getStFiscalYearId()
				+ ", rpro.st_fiscal_year_id) ");
		strbuilder.append("and ");
		strbuilder.append("pef.m1_researcher_proposal_id = coalesce(" + feedbackListRequestDto.getResearcherProposalId()
				+ ", pef.m1_researcher_proposal_id) ");
		strbuilder.append("and ");
		strbuilder.append("rppi.id = coalesce(" + feedbackListRequestDto.getResearcherProfilePersonalInfoMasterId()
				+ ", rppi.id) ");
		strbuilder.append("and ");
		strbuilder.append("rp.presentation_status = coalesce(" + feedbackListRequestDto.getPresentationStatus()
				+ ", rp.presentation_status) ");
		strbuilder.append("and ");
		strbuilder.append("lpwe.st_profile_of_expert_evaluators_id = coalesce("
				+ feedbackListRequestDto.getExpertEvaluatorsId() + ", lpwe.st_profile_of_expert_evaluators_id) ");
		strbuilder.append("and ");
		strbuilder.append("rppi.user_id = coalesce(" + feedbackListRequestDto.getUserId() + " , rppi.user_id) ");
		strbuilder.append("group by ");
		strbuilder.append(
				"pef.m1_researcher_proposal_id,research_title,st_fiscal_year_id,	rppi.id,user_id,new_feedback,completed_feedback,presentation_status, rp.id, rp.m2_create_seminar_id, rpro.uuid , lpwe.st_profile_of_expert_evaluators_id) ");
		strbuilder
				.append("select * from (table cte limit " + feedbackListRequestDto.getPageableRequestBodyDTO().getSize()
						+ " offset " + feedbackListRequestDto.getPageableRequestBodyDTO().getPage()
						+ ") sub right join (	select	count(*) from cte) c(total) on	true ");
		return strbuilder.toString();
	}

	public Pageable getPageable(PageableRequestBodyDTO requestDTO) {
		PageableRequestBodyDTO pageSettings = new PageableRequestBodyDTO() {
			{
				setPage(0);
				setSize(DEFAULT_PAGE_SIZE);
			}
		};
		if (requestDTO != null && requestDTO.getPage() != null && requestDTO.getSize() != null) {
			pageSettings = requestDTO;
		}
		return PageRequest.of(pageSettings.getPage(), pageSettings.getSize());
	}

	@Override
	public Response<FiscalResponseDto> findFiscalYear() {

		Set<Long> fiscalYearIdList = createSeminarRepository.findAllStFiscalYearId();

		if (fiscalYearIdList != null && fiscalYearIdList.size() > 0) {
			IdSetRequestBodyDTO request = new IdSetRequestBodyDTO();
			request.setIds(fiscalYearIdList);
			return rmsConfigurationClientService.getByFiscalYearIdSet(request);
		}

		return getErrorResponse("Fiscal Year Not Found !.");
	}

	@Override
	public Response<ResearchTittleResponseDto> findResearchTittle(Long fiscalYearId) {
		List<Object> researchTittleList = createSeminarTimeScheduleRepository.findAllResearchTittleList(fiscalYearId);
		List<ResearchTittleResponseDto> responseList = new ArrayList<ResearchTittleResponseDto>();

		if (researchTittleList != null && researchTittleList.size() > 0) {

			for (Object l : researchTittleList) {
				Object[] t = (Object[]) l;
				ResearchTittleResponseDto dto = new ResearchTittleResponseDto();

				if (t[0] != null) {
					dto.setM1ResearcherProposalId(Long.parseLong(t[0].toString()));
				}
				if (t[1] != null) {
					dto.setResearchTitle(t[1].toString());
				}
				responseList.add(dto);
			}

			return new Response<ResearchTittleResponseDto>() {
				{
					setMessage("Data Found !.");
					setItems(responseList);
					setSuccess(true);
				}
			};
		}
		return getErrorResponse("Data Not Found !.");
	}

	@Override
	public Response<ResearchTittleResponseDto> findResearcherName(Long researcherProposalId) {
		List<Object> researchTittleList = createSeminarTimeScheduleRepository
				.findAllResearcherNameList(researcherProposalId);
		List<ResearchTittleResponseDto> responseList = new ArrayList<ResearchTittleResponseDto>();

		if (researchTittleList != null && researchTittleList.size() > 0) {

			for (Object l : researchTittleList) {
				Object[] t = (Object[]) l;
				ResearchTittleResponseDto dto = new ResearchTittleResponseDto();
				if (t[0] != null) {
					dto.setResearcherProfilePersonalInfoMasterId(Long.parseLong(t[0].toString()));
				}
				if (t[1] != null) {
					dto.setUserId(Long.parseLong(t[1].toString()));
					dto.setUser(uaaClientService.getUser(dto.getUserId()).getBody());
				}

				responseList.add(dto);
			}

			return new Response<ResearchTittleResponseDto>() {
				{
					setMessage("Data Found !.");
					setItems(responseList);
					setSuccess(true);
				}
			};
		}
		return getErrorResponse("Data Not Found !.");
	}

	@Override
	public Response<PresentationEvaluatorsFeedbackResponseDto> findAllByResearcherProposalId(String uuid) {

		List<PresentationEvaluatorsFeedback> responseList = null;
		List<PresentationEvaluatorsFeedbackResponseDto> responseDtoList = new ArrayList<PresentationEvaluatorsFeedbackResponseDto>();

		ResearcherProposal researcherProposal = researcherProposalRepository.findByUuidAndIsDeleted(uuid, false)
				.orElse(null);

		if (researcherProposal != null) {
			responseList = repository.findAllByResearcherProposalAndIsDeleted(researcherProposal, false);
		}

		for (PresentationEvaluatorsFeedback response : responseList) {
			responseDtoList.add(convertForRead2(response));
		}

		if (responseList != null && responseList.size() > 0) {
			Response<PresentationEvaluatorsFeedbackResponseDto> response = new Response<PresentationEvaluatorsFeedbackResponseDto>();
			response.setMessage("Data Found!.");
			response.setSuccess(true);
			response.setItems(responseDtoList);
			return response;
		}

		return getErrorResponse("Data Not Found!.");
	}

	@Override
	public Response<PresentationEvaluatorsFeedbackResponseDto> getByResearcherPresentationId(Long presentationId) {
		List<PresentationEvaluatorsFeedback> list = repository
				.findAllByResearcherPresentationIdAndIsDeleted(presentationId, false);

		if (list.isEmpty())
			return getErrorResponse("Data Not Found");
		return new Response<PresentationEvaluatorsFeedbackResponseDto>() {
			{
				setMessage("Data Found");
				setItems(convertForRead(list));
			}
		};
	}

	@Override
	public Response<PresentationEvaluatorsFeedbackResponseDto> getAllNewFeedbackByResearcherProposalUuid(String uuid) {
		ResearcherProposal researcherProposal = researcherProposalRepository.findByUuidAndIsDeleted(uuid, false)
				.orElse(null);
		if (researcherProposal == null)
			return getErrorResponse("Data not Found by Proposal");

		List<PresentationEvaluatorsFeedback> list = repository
				.findAllByResearcherProposalIdAndIsNewAndIsDeleted(researcherProposal.getId(), true, false);

		if (list.isEmpty())
			return getErrorResponse("Data Empty");

		return new Response<>() {
			{
				setMessage("Data found");
				setItems(convertForRead(list));
			}
		};
	}

	@Override
	public Response<PresentationEvaluatorsFeedbackResponseDto> updateList(
			List<ResearcherFeedbackRequestDto> requestDto) {
		List<PresentationEvaluatorsFeedback> feedbackList = new ArrayList<>();
		try {
			AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder
					.getContext().getAuthentication().getDetails()).getDecodedDetails();
			requestDto.forEach(e -> {
				PresentationEvaluatorsFeedback feedback = repository.findByUuidAndIsDeleted(e.getUuid(), false)
						.orElse(null);
				if (feedback == null)
					throw new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException(
							"UUID-" + e.getUuid() + " not found");
				ResearcherProposal proposal = researcherProposalRepository
						.findByIdAndIsDeleted(feedback.getResearcherProposal().getId(), false).orElse(null);
				if (proposal == null)
					throw new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException(
							"Proposal Id-" + feedback.getResearcherProposal().getId() + " not found");
				feedback.setIsNew(false);
				feedback.setResearcherUserId(proposal.getResearcherProfilePersonalInfoMaster().getUserId());
				feedback.setResearcherFeedback(e.getResearcherFeedback());
				feedback.setPageNo2(e.getPageNo2());
				feedback.setUpdatedOn(LocalDate.now());
				feedback.setUpdatedBy(accessTokenDetail.getUserName());
				feedbackList.add(repository.save(feedback));
			});
			return new Response<>() {
				{
					setMessage("Data Saved");
					setItems(convertForRead(feedbackList));
				}
			};
		} catch (Exception e) {
			return getErrorResponse("Save failed !!");
		}
	}

	@Override
	public Response<PresentationEvaluatorsFeedbackResponseDto> findAllByResearcherProposalUuid(String proposalUuid) {

		List<PresentationEvaluatorsFeedback> responseList = null;
//		List<PresentationEvaluatorsFeedbackResponseDto> responseDtoList = new ArrayList<PresentationEvaluatorsFeedbackResponseDto>();

		ResearcherProposal researcherProposal = researcherProposalRepository.findByUuidAndIsDeleted(proposalUuid, false)
				.orElse(null);

		if (researcherProposal != null) {
			responseList = repository.findAllByResearcherProposalAndIsDeleted(researcherProposal, false);
		}

		if (responseList != null && responseList.size() > 0) {
			Response<PresentationEvaluatorsFeedbackResponseDto> response = new Response<>();
//			ResponseEntity<UserResponse> userResponse = null;
//			if (responseList.get(0).getResearcherProposal().getResearcherProfilePersonalInfoMaster()
//					.getUserId() != null) {
//				userResponse = uaaClientService.getUser(responseList.get(0).getResearcherProposal()
//						.getResearcherProfilePersonalInfoMaster().getUserId());
//			}
//			responseList.get(0).getResearcherProposal().getResearcherProfilePersonalInfoMaster()
//					.setUserDto(userResponse != null ? userResponse.getBody() : null);
			response.setMessage("Data Found!.");
			response.setSuccess(true);
			response.setItems(convertForRead(responseList));
			return response;
		}

		return getErrorResponse("Data Not Found!.");

	}

	@Override
	public Response<PresentationEvaluatorsFeedbackResponseDto> findSeminarPresentationReport(String createSeminarUuid) {

		CreateSeminar createSeminar = createSeminarRepository.findByUuidAndIsDeleted(createSeminarUuid, false)
				.orElse(null);
		if (createSeminar == null) {
			return getErrorResponse("Seminar Not Found!");
		}
		List<ResearcherPresentation> researcherPresentationList = researcherPresentationRepository
				.findAllByCreateSeminarAndIsDeleted(createSeminar, false);

		if (researcherPresentationList != null && researcherPresentationList.size() < 0) {
			return getErrorResponse("Presentation Not Found!");
		}

		List<PresentationEvaluatorsFeedback> responseList = repository
				.findAllByResearcherPresentationInAndIsDeleted(researcherPresentationList, false);

		if (responseList != null && responseList.size() > 0) {

			Response<PresentationReportResponseDto> response = presentationReportService
					.findByCreateSeminarUuid(createSeminarUuid);

			if (!response.isSuccess() && response.getObj() == null) {
				return getErrorResponse("Presentation Report Not Found !.");
			}

			PresentationEvaluatorsFeedbackResponseDto model = new PresentationEvaluatorsFeedbackResponseDto();
			model.setPresentationReportResponseDto(response.getObj());
			model.setPresentationEvaluatorsFeedbackList(arrangeDataForFeedbackReport(responseList));
//			model.setPresentationEvaluatorsFeedbackList(convertForRead(responseList));

			return new Response<PresentationEvaluatorsFeedbackResponseDto>() {
				{
					setMessage("Data Found!.");
					setObj(model);
					setSuccess(true);
				}
			};
		}

		return getErrorResponse("Data Not Found!.");
	}

	private List<PresentationEvaluatorsFeedbackResponseDto> arrangeDataForFeedbackReport(List<PresentationEvaluatorsFeedback> responseList) {

		Set<Long> evaluatorIdSet = responseList.stream()
				.map(PresentationEvaluatorsFeedback::getStProfileOfExpertEvaluatorsId).filter(Objects::nonNull)
				.collect(Collectors.toSet());
		Map<Long, ExpertEvaluatorResponseDto> expertEvaluatorResponseDtoMap = new HashMap<>();
		if (!evaluatorIdSet.isEmpty()) {
			expertEvaluatorResponseDtoMap = rmsConfigurationClientService
					.getByExpertEvaluatorIdSet(new IdSetRequestBodyDTO() {
						{
							setIds(evaluatorIdSet);
						}
					}).getItems().stream().collect(Collectors.toMap(UuidIdHolderRequestBodyDTO::getId, dto -> dto));
		}
		Map<Long, ExpertEvaluatorResponseDto> finalExpertEvaluatorResponseDtoMap = expertEvaluatorResponseDtoMap;

		Set<Long> userIdSet = responseList.stream()
				.map(m -> m.getResearcherProposal().getResearcherProfilePersonalInfoMaster().getUserId())
				.filter(Objects::nonNull).collect(Collectors.toSet());
		Map<Long, UserResponse> userList = new HashMap<>();
		if (!userIdSet.isEmpty()) {
			userList = Objects.requireNonNull(uaaClientService.getUserByIdSet(userIdSet).getBody()).stream()
					.collect(Collectors.toMap(UserResponse::getId, dto -> dto));
		}
		Map<Long, UserResponse> finalUserResponseDtoMap = userList;

		return responseList.stream().map(m -> {
			PresentationEvaluatorsFeedbackResponseDto feedback = convertForRead(m);
			feedback.setExpertEvaluatorResponseDto(Objects.nonNull(m.getStProfileOfExpertEvaluatorsId())
					? finalExpertEvaluatorResponseDtoMap.get(m.getStProfileOfExpertEvaluatorsId())
					: null);
			feedback.getResearcherProposal().getResearcherProfilePersonalInfoMaster().setUserDto(finalUserResponseDtoMap
					.get(m.getResearcherProposal().getResearcherProfilePersonalInfoMaster().getUserId()));
			return feedback;

		}).collect(Collectors.toList());
	}

	@Override
	public Response<PresentationEvaluatorsFeedbackResponseDto> findByResearcherPresentationAndResearcherProposalAndExpertEvaluatorOrNewmember(
			PresentationEvaluatorsFeedbackRequestDto request) {

		Optional<ResearcherPresentation> presentation = researcherPresentationRepository
				.findByUuidAndIsDeleted(request.getM2ResearcherPresentationUuid(), false);
		Optional<ResearcherProposal> proposal = researcherProposalRepository
				.findByUuidAndIsDeleted(request.getM1ResearcherProposalUuid(), false);

		if (presentation.isEmpty()) {
			return getErrorResponse("Researcher Presentation Not Found!.");
		}

		if (proposal.isEmpty()) {
			return getErrorResponse("Researcher Proposal Not Found!.");
		}

		if (request.getM2ResearcherPresentationUuid() != null && request.getM1ResearcherProposalUuid() != null
				&& request.getStProfileOfExpertEvaluatorsId() != null) {

			List<PresentationEvaluatorsFeedback> responseList = repository
					.findByResearcherPresentationAndResearcherProposalAndStProfileOfExpertEvaluatorsIdAndIsDeleted(
							presentation.get(), proposal.get(), request.getStProfileOfExpertEvaluatorsId(), false);

			if (responseList != null && responseList.size() > 0) {
				List<PresentationEvaluatorsFeedbackResponseDto> feedbackResponseDtoList = convertForRead(responseList);
				ResponseEntity<UserResponse> userResponse = null;
				if (responseList.get(0).getResearcherProposal().getResearcherProfilePersonalInfoMaster()
						.getUserId() != null) {
					userResponse = uaaClientService.getUser(responseList.get(0).getResearcherProposal()
							.getResearcherProfilePersonalInfoMaster().getUserId());
				}
				feedbackResponseDtoList.get(0).getResearcherProposal().getResearcherProfilePersonalInfoMaster()
						.setUserDto(userResponse != null ? userResponse.getBody() : null);

				return new Response<PresentationEvaluatorsFeedbackResponseDto>() {
					{
						setMessage("Data Found!.");
						setSuccess(true);
						setItems(feedbackResponseDtoList);
					}
				};

			}

		}

		if (request.getM2ResearcherPresentationUuid() != null && request.getM1ResearcherProposalUuid() != null
				&& request.getM2AddNewMemberUuid() != null) {

			Optional<NewMember> newMember = newMemberRepository.findByUuidAndIsDeleted(request.getM2AddNewMemberUuid(),
					false);

			if (proposal.isEmpty()) {
				return getErrorResponse("New Member Not Found!.");
			}

			List<PresentationEvaluatorsFeedback> responseList = repository
					.findByResearcherPresentationAndResearcherProposalAndNewMemberAndIsDeleted(presentation.get(),
							proposal.get(), newMember.get(), false);

			if (responseList != null && responseList.size() > 0) {
				List<PresentationEvaluatorsFeedbackResponseDto> feedbackResponseDtoList = convertForRead(responseList);
				ResponseEntity<UserResponse> userResponse = null;
				if (responseList.get(0).getResearcherProposal().getResearcherProfilePersonalInfoMaster()
						.getUserId() != null) {
					userResponse = uaaClientService.getUser(responseList.get(0).getResearcherProposal()
							.getResearcherProfilePersonalInfoMaster().getUserId());
				}
				feedbackResponseDtoList.get(0).getResearcherProposal().getResearcherProfilePersonalInfoMaster()
						.setUserDto(userResponse != null ? userResponse.getBody() : null);

				return new Response<PresentationEvaluatorsFeedbackResponseDto>() {
					{
						setMessage("Data Found!.");
						setSuccess(true);
						setItems(feedbackResponseDtoList);
					}
				};

			}

		}

		return getErrorResponse("Data Not Found!.");
	}

	@Override
	public Response<PresentationEvaluatorsFeedbackResponseDto> findAllFeedbackWithProposalByProposalUuid(
			String proposalUuid) {

		ResearcherProposal researcherProposal = researcherProposalRepository.findByUuidAndIsDeleted(proposalUuid, false)
				.orElse(null);

		List<PresentationEvaluatorsFeedback> responseList = null;
		if (researcherProposal != null) {
			responseList = repository.findAllByResearcherProposalAndIsDeleted(researcherProposal, false);
		}

		if (responseList != null && responseList.size() > 0) {
			Response<PresentationEvaluatorsFeedbackResponseDto> response = new Response<>();
			response.setMessage("Data Found!.");
			response.setSuccess(true);
			response.setItems(convertForRead(responseList));
			response.setObj(new PresentationEvaluatorsFeedbackResponseDto() {
				{
					setResearcherProposalResponseDto(researcherProposalServiceImpl.getByUuid(proposalUuid).getObj());
				}
			});
			return response;
		}

		return getErrorResponse("Data Not Found!.");
	}

}
