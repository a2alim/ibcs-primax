package com.ibcs.idsdp.rpm.services.implementation;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.UaaClientService;
import com.ibcs.idsdp.rpm.client.dto.response.DivisionResponse;
import com.ibcs.idsdp.rpm.client.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.UpaZillaResponse;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;
import com.ibcs.idsdp.rpm.client.dto.response.ZillaResponse;
import com.ibcs.idsdp.rpm.model.domain.AgreementInstallment;
import com.ibcs.idsdp.rpm.model.domain.EducationInfo;
import com.ibcs.idsdp.rpm.model.domain.ProfessionalExperience;
import com.ibcs.idsdp.rpm.model.domain.ProfileTraining;
import com.ibcs.idsdp.rpm.model.domain.PublicationInfo;
import com.ibcs.idsdp.rpm.model.domain.ResearchExperience;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfilePersonalInfoMaster;
import com.ibcs.idsdp.rpm.model.domain.ViewResearcherList;
import com.ibcs.idsdp.rpm.model.repositories.EducationInfoRepository;
import com.ibcs.idsdp.rpm.model.repositories.ProfessionalExperienceRepository;
import com.ibcs.idsdp.rpm.model.repositories.ProfileTrainingRepository;
import com.ibcs.idsdp.rpm.model.repositories.PublicationRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearchExperienceRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProfilePersonalInfoMasterRepository;
import com.ibcs.idsdp.rpm.model.repositories.ViewResearcherRepository;
import com.ibcs.idsdp.rpm.services.ProfileViewService;
import com.ibcs.idsdp.rpm.services.ResearcherProposalService;
import com.ibcs.idsdp.rpm.services.ResearcherSupervisorInfoService;
import com.ibcs.idsdp.rpm.services.ViewResearcherService;
import com.ibcs.idsdp.rpm.web.dto.request.ConnectionRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ConnectionResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherSupervisorInfoResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ViewProfileProposalMarksResponse;
import com.ibcs.idsdp.rpm.web.dto.response.ViewResearcherDto;
import com.ibcs.idsdp.rpm.web.dto.response.ViewResearcherProposalResponse;
import com.ibcs.idsdp.util.Response;

@Service
public class ViewResearcherServiceImpl
		extends BaseService<AgreementInstallment, ConnectionRequestDto, ConnectionResponseDto>
		implements ViewResearcherService {

	protected ViewResearcherServiceImpl(ServiceRepository<AgreementInstallment> repository) {
		super(repository);
	}

	@Autowired
	private ViewResearcherRepository viewResearcherRepository;
	@Autowired
	private EntityManagerFactory entityManagerFactory;
	@Autowired
	private ProfileViewService profileViewService;
	@Autowired
	private ResearcherProposalService researcherProposalService;
	@Autowired
	private ResearcherSupervisorInfoService researcherSupervisorInfoService;
	@Autowired
	private ResearcherProfilePersonalInfoMasterRepository researcherProfilePersonalInfoMasterRepository;
	@Autowired
	private Environment env;

	@Autowired
	private EducationInfoRepository educationInfoRepository;
	@Autowired
	private PublicationRepository publicationRepository;
	@Autowired
	private ProfessionalExperienceRepository professionalExperienceRepository;
	@Autowired
	private ResearchExperienceRepository researchExperienceRepository;
	@Autowired
	private ProfileTrainingRepository profileTrainingRepository;
	@Autowired
	private UaaClientService uaaClientService;
	@Autowired
	private RmsConfigurationClientService rmsConfigurationClientService;

	private static final int DEFAULT_PAGE_SIZE = 1000000;

//	@Value("${minio.host}")
//	private String minIOHostUrl;

	@Override
	public Page<ViewResearcherList> criteriaBasedSearch(ViewResearcherList request) {
		return test(request);
	}

	private String getSql(String stFiscalYearId, String researchTitle, String researcherName,
			String stResearchCatTypeId, String approvalStatus, String userId, String stProfileOfExpertEvaluatorsId,
			String isFinalSubmit, PageableRequestBodyDTO pageableRequestBodyDTO, String orderBy) {

		return "with cte as (select * from view_researcher_list " + "where is_deleted = false " + stFiscalYearId
				+ researchTitle + researcherName + stResearchCatTypeId + approvalStatus + userId
				+ stProfileOfExpertEvaluatorsId + isFinalSubmit + orderBy + ") " + "SELECT * " + "FROM  (TABLE cte "
				+ "LIMIT " + pageableRequestBodyDTO.getSize() + " OFFSET " + pageableRequestBodyDTO.getPage() + ") sub "
				+ "RIGHT  JOIN (SELECT count(*) FROM cte) c(total) ON true";
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

	public Page<ViewResearcherList> test(ViewResearcherList request) {

		Pageable pageable = getPageable(request.getPageableRequestBodyDTO());

		Long total = 0L;

		String stFiscalYearId = "";
		if (request.getStFiscalYearId() != null) {
			stFiscalYearId = " and st_fiscal_year_id = " + request.getStFiscalYearId();
		}

		String researcherName = "";
		if (request.getProfileId() != null) {
			researcherName = " and profile_id = " + request.getProfileId();
		}

		String researchTitle = "";
		if (request.getProposalId() != null) {
			researchTitle = " and proposal_id = " + request.getProposalId();
		}

		String stResearchCatTypeId = "";
		if (request.getStResearchCatTypeId() != null) {
			stResearchCatTypeId = " and st_research_cat_type_id = " + request.getStResearchCatTypeId();
		}

		String approvalStatus = "";
		if (request.getApprovalStatus() != null) {
			approvalStatus = " and approval_status = " + request.getApprovalStatus();
		}

		String userId = "";
		if (request.getUserId() != null) {
			userId = " and user_id = " + request.getUserId();
		}

		String stProfileOfExpertEvaluatorsId = "";
		if (request.getStProfileOfExpertEvaluatorsId() != null) {
			stProfileOfExpertEvaluatorsId = " and st_profile_of_expert_evaluators_id = "
					+ request.getStProfileOfExpertEvaluatorsId()
					+ " or st_profile_of_expert_evaluators_id_for_pro_marks = "
					+ request.getStProfileOfExpertEvaluatorsId()
					+ " or st_profile_of_expert_evaluators_id_for_research = "
					+ request.getStProfileOfExpertEvaluatorsId();
		}

		String isFinalSubmit = "";
		if (request.getIsFinalSubmit() != null) {
			isFinalSubmit = " and is_final_submit = " + request.getIsFinalSubmit();
		}

		String orderBy = "";
		if (!StringUtils.isEmpty(request.getOrderBy())) {
			orderBy = request.getOrderBy().equals("profile_marks") ? " order by profile_marks desc nulls last"
					: request.getOrderBy().equals("proposal_marks") ? " order by proposal_marks desc nulls last"
							: request.getOrderBy().equals("profile_proposal_marks")
									? " order by total_mark desc nulls last"
									: request.getOrderBy().equals("all") ? " order by proposal_id desc" : null;
		} else {
			orderBy = " order by proposal_update_on desc nulls last";
		}

		String SQL = getSql(stFiscalYearId, researchTitle, researcherName, stResearchCatTypeId, approvalStatus, userId,
				stProfileOfExpertEvaluatorsId, isFinalSubmit, request.getPageableRequestBodyDTO(), orderBy);

		Connection con = null;
		ResultSet rs = null;
		Statement stm = null;

		List<ViewResearcherList> list = new ArrayList<ViewResearcherList>();

		try {
			//System.out.println("SQL === >>>> " + SQL);
			con = getOraConnection();
			stm = con.createStatement();
			rs = stm.executeQuery(SQL);

			while (rs.next()) {

				ViewResearcherList dto = new ViewResearcherList();
				dto.setProposalId(rs.getLong("proposal_id"));
				if (dto.getProposalId() == null || dto.getProposalId() == 0) {
					break;
				}

				dto.setProposalUuid(rs.getString("proposal_uuid"));
				dto.setResearcherProfilePersonalInfoMasterId(rs.getLong("researcher_profile_personal_info_master_id"));
				dto.setResearchTitle(rs.getString("research_title"));
				dto.setStFiscalYearId(rs.getLong("st_fiscal_year_id"));
				dto.setStResearchCatTypeId(rs.getLong("st_research_cat_type_id"));
				dto.setStSectorTypeId(rs.getLong("st_sector_type_id"));
				dto.setStSubSectorsId(rs.getLong("st_sub_sectors_id"));
				dto.setProfileId(rs.getLong("profile_id"));
				dto.setProfileUuid(rs.getString("profile_uuid"));
				dto.setUserId(rs.getLong("user_id"));

				if (dto.getUserId() != null) {
					dto.setUserDto(uaaClientService.getUser(dto.getUserId()).getBody());
				}

				dto.setApprovalStatus(rs.getInt("approval_status"));
				dto.setApprovedBy(rs.getInt("approved_by"));
				dto.setProposalMarks(rs.getDouble("proposal_marks"));
				dto.setProfileMarks(rs.getDouble("profile_marks"));
				dto.setStProfileOfExpertEvaluatorsId(rs.getLong("st_profile_of_expert_evaluators_id"));
				dto.setIsInstitutional(rs.getBoolean("is_institutional"));
				dto.setIsFinalSubmit(rs.getBoolean("is_final_submit"));
				dto.setStProfileOfExpertEvaluatorsIdForProMarks(
						rs.getLong("st_profile_of_expert_evaluators_id_for_pro_marks"));
				dto.setStProfileOfExpertEvaluatorsIdForResearch(
						rs.getLong("st_profile_of_expert_evaluators_id_for_research"));
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

	@Override
	public Response<ViewResearcherDto> findAllByStFiscalYearId(Long stFiscalYearId) {

		List<ViewResearcherList> responseList = viewResearcherRepository
				.findAllByStFiscalYearIdAndIsDeleted(stFiscalYearId, false);

		if (responseList == null) {
			return new Response<>() {
				{
					setSuccess(false);
					setMessage("Data Not Found");
					setObj(null);
				}
			};
		}

		for (ViewResearcherList l : responseList) {
			if (l.getUserId() != null) {
				l.setUserDto(uaaClientService.getUser(l.getUserId()).getBody());
			}
		}

		return new Response<>() {
			{
				setMessage("Data Found");
				setItems(getListFromObject(responseList, ViewResearcherDto.class));
			}
		};
	}

	@Override
	public Response<ViewResearcherList> findAllByStFiscalYearIdAndProfileId(ViewResearcherDto viewResearcherDto) {

		List<ViewResearcherList> list = new ArrayList<ViewResearcherList>();
		Response<ViewResearcherList> response = new Response<ViewResearcherList>();

		if (viewResearcherDto.getStFiscalYearId() != null && viewResearcherDto.getProfileId() == null) {
			list = viewResearcherRepository.findAllByStFiscalYearIdAndIsDeleted(viewResearcherDto.getStFiscalYearId(),
					false);
		}

		if (viewResearcherDto.getStFiscalYearId() == null && viewResearcherDto.getProfileId() != null) {
			list = viewResearcherRepository.findAllByProfileIdAndIsDeleted(viewResearcherDto.getProfileId(), false);
		}

		if (viewResearcherDto.getStFiscalYearId() != null && viewResearcherDto.getProfileId() != null) {
			list = viewResearcherRepository.findAllByStFiscalYearIdAndProfileIdAndIsDeleted(
					viewResearcherDto.getStFiscalYearId(), viewResearcherDto.getProfileId(), false);
		}

		if (viewResearcherDto.getStFiscalYearId() == null && viewResearcherDto.getProfileId() == null) {
			list = viewResearcherRepository.findAllByIsDeleted(false);
		}

		if (list != null && !CollectionUtils.isEmpty(list)) {

			for (ViewResearcherList l : list) {
				if (l.getUserId() != null) {
					l.setUserDto(uaaClientService.getUser(l.getUserId()).getBody());
				}
			}

			response.setItems(list);
			return getSuccessResponse("Data Found", response);
		}
		return getErrorResponse("Data Not Found !.");
	}

	@Override
	public Response<ViewResearcherDto> viewResercherProfile(String profileUuId) {

		Map<Object, Object> map = new HashMap<Object, Object>();

		ResearcherProfilePersonalInfoMaster researcherProfilePersonalInfoMaster = new ResearcherProfilePersonalInfoMaster();
		List<ResearcherProposalResponseDto> researcherProposalList = new ArrayList<ResearcherProposalResponseDto>();
		List<EducationInfo> educationInfoList = new ArrayList<EducationInfo>();
		List<PublicationInfo> PublicationInfoList = new ArrayList<PublicationInfo>();
		List<ProfessionalExperience> publicationInfoList = new ArrayList<ProfessionalExperience>();
		List<ResearchExperience> researchExperienceList = new ArrayList<ResearchExperience>();
		List<ProfileTraining> profileTrainingList = new ArrayList<ProfileTraining>();

		try {
			researcherProfilePersonalInfoMaster = profileViewService.getPersonalInfo(profileUuId).get();

			educationInfoList = educationInfoRepository
					.findAllByProfilePersonalInfoIdAndIsDeleted(researcherProfilePersonalInfoMaster.getId(), false);
			PublicationInfoList = publicationRepository
					.findAllByProfilePersonalInfoId(researcherProfilePersonalInfoMaster.getId());
			publicationInfoList = professionalExperienceRepository
					.findAllByProfilePersonalInfoId(researcherProfilePersonalInfoMaster.getId());
			researchExperienceList = researchExperienceRepository
					.findAllByProfilePersonalInfoId(researcherProfilePersonalInfoMaster.getId());
			profileTrainingList = profileTrainingRepository
					.findAllByProfilePersonalInfoId(researcherProfilePersonalInfoMaster.getId());

			if (researcherProfilePersonalInfoMaster != null && researcherProfilePersonalInfoMaster.getId() != null) {
				Response<ResearcherProposalResponseDto> response = researcherProposalService
						.getListFindByResProfilePersonalInfoId(researcherProfilePersonalInfoMaster.getId());
				if (response.isSuccess() && !CollectionUtils.isEmpty(response.getItems())) {
					researcherProposalList = response.getItems();

					for (ResearcherProposalResponseDto researcherProposal : researcherProposalList) {

						Response<ResearcherSupervisorInfoResponseDto> res = researcherSupervisorInfoService
								.getByResearcherProposalId(researcherProposal.getId());

						if (res.isSuccess() && res.getObj() != null) {
							researcherProposal.setResearcherSupervisorInfoResponseDto(
									getValueFromObject(res.getObj(), ResearcherSupervisorInfoResponseDto.class));
						}
					}

				}
			}

			map.put("researcherProfilePersonalInfoMaster", researcherProfilePersonalInfoMaster);
			map.put("researcherProposalList", researcherProposalList);

			map.put("educationInfoList", educationInfoList);
			map.put("PublicationInfoList", PublicationInfoList);
			map.put("publicationInfoList", publicationInfoList);
			map.put("researchExperienceList", researchExperienceList);
			map.put("profileTrainingList", profileTrainingList);
			map.put("minio", env.getProperty("minio.host"));

			Response finalResponse = new Response();
			finalResponse.setModel(map);
			return getSuccessResponse("Data Found", finalResponse);

		} catch (Exception e) {
			//System.out.println("Error Message ==== >>>>> " + e.getMessage());
			return getErrorResponse("Data Not Found !.");
		}

	}

	@Override
	public Response<ViewResearcherDto> viewResearcherProfileById(Long profileId) {

		Map<Object, Object> map = new HashMap<Object, Object>();

		ResearcherProfilePersonalInfoMaster researcherProfilePersonalInfoMaster = new ResearcherProfilePersonalInfoMaster();
		List<ResearcherProposalResponseDto> researcherProposalList = new ArrayList<ResearcherProposalResponseDto>();
		List<EducationInfo> educationInfoList = new ArrayList<EducationInfo>();
		List<PublicationInfo> publicationInfoList = new ArrayList<PublicationInfo>();
		List<ProfessionalExperience> professionalExperienceList = new ArrayList<ProfessionalExperience>();
		List<ResearchExperience> researchExperienceList = new ArrayList<ResearchExperience>();
		List<ProfileTraining> profileTrainingList = new ArrayList<ProfileTraining>();

		try {
			researcherProfilePersonalInfoMaster = profileViewService.getPersonalInfoById(profileId).get();

			educationInfoList = educationInfoRepository
					.findAllByProfilePersonalInfoIdAndIsDeleted(researcherProfilePersonalInfoMaster.getId(), false);
			publicationInfoList = publicationRepository
					.findAllByProfilePersonalInfoId(researcherProfilePersonalInfoMaster.getId());
			professionalExperienceList = professionalExperienceRepository
					.findAllByProfilePersonalInfoId(researcherProfilePersonalInfoMaster.getId());
			researchExperienceList = researchExperienceRepository
					.findAllByProfilePersonalInfoId(researcherProfilePersonalInfoMaster.getId());
			profileTrainingList = profileTrainingRepository
					.findAllByProfilePersonalInfoId(researcherProfilePersonalInfoMaster.getId());

			if (researcherProfilePersonalInfoMaster != null && researcherProfilePersonalInfoMaster.getId() != null) {
				Response<ResearcherProposalResponseDto> response = researcherProposalService
						.getListFindByResProfilePersonalInfoId(researcherProfilePersonalInfoMaster.getId());
				if (response.isSuccess() && !CollectionUtils.isEmpty(response.getItems())) {
					researcherProposalList = response.getItems();
					for (ResearcherProposalResponseDto researcherProposal : researcherProposalList) {

						Response<ResearcherSupervisorInfoResponseDto> res = researcherSupervisorInfoService
								.getByResearcherProposalId(researcherProposal.getId());

						if (res.isSuccess() && res.getObj() != null) {
							researcherProposal.setResearcherSupervisorInfoResponseDto(
									getValueFromObject(res.getObj(), ResearcherSupervisorInfoResponseDto.class));
						}
					}
				}
			}
			map.put("researcherProfilePersonalInfoMaster", researcherProfilePersonalInfoMaster);
			map.put("researcherProposalList", researcherProposalList);
			map.put("educationInfoList", educationInfoList);
			map.put("publicationInfoList", publicationInfoList);
			map.put("professionalExperienceList", professionalExperienceList);
			map.put("researchExperienceList", researchExperienceList);
			map.put("profileTrainingList", profileTrainingList);
			map.put("minio", env.getProperty("minio.host"));

			Response finalResponse = new Response();
			finalResponse.setModel(map);
			return getSuccessResponse("Data Found", finalResponse);

		} catch (Exception e) {
			//System.out.println("Error Message ==== >>>>> " + e.getMessage());
			return getErrorResponse("Data Not Found !.");
		}
	}

	@Override
	public Response<ViewResearcherProposalResponse> getProposalByFiscalYearAndCategory(ViewResearcherList request) {

		String stFiscalYearId = "";
		if (request.getStFiscalYearId() == null) {
			return new Response<>() {
				{
					setSuccess(false);
					setMessage("Fiscal Year Not Found");
				}
			};
		} else {
			stFiscalYearId = " and st_fiscal_year_id = " + request.getStFiscalYearId();
		}

		String category = "";
		if (request.getStResearchCatTypeId() != null) {
			category = " and st_research_cat_type_id = " + request.getStResearchCatTypeId();
		}

		String userId = "";
		if (request.getUserId() != null) {
			userId = " and user_id = " + request.getUserId();
		}

		String SQL = getSql(stFiscalYearId, userId, category);
		EntityManager entityManager = entityManagerFactory.createEntityManager();
		Query nativeQuery = entityManager.createNativeQuery(SQL);
		List<Object[]> l = nativeQuery.getResultList();

		if (l.isEmpty()) {
			return new Response<>() {
				{
					setMessage("Data Empty");
				}
			};
		}

		Object[] firstData = l.get(0);
		if (firstData[0] == null)
			return new Response<>() {
				{
					setMessage("Data Empty");
				}
			};

		List<ViewResearcherProposalResponse> list = arrangeProposalList(l);

		Response<FiscalResponseDto> fiscalResponseDtoResponse = rmsConfigurationClientService
				.getByFiscalYearId(request.getStFiscalYearId());

		ViewResearcherProposalResponse requestData = new ViewResearcherProposalResponse();
		if (fiscalResponseDtoResponse.isSuccess() && fiscalResponseDtoResponse.getObj() != null) {
			requestData.setFiscalYearId(fiscalResponseDtoResponse.getObj().getId());
			requestData.setFiscalYearDto(fiscalResponseDtoResponse.getObj());
		}

		if (request.getStResearchCatTypeId() != null) {
			requestData.setResearchCategoryType(list.get(0).getResearchCategoryType());
			requestData.setStResearchCatTypeId(list.get(0).getStResearchCatTypeId());
		}

		if (request.getUserId() != null) {
			requestData.setUserDto(list.get(0).getUserDto());
			requestData.setUserId(list.get(0).getUserId());
		}

		return new Response<>() {
			{
				setMessage("Data Found");
				setItems(list);
				setObj(requestData);
			}
		};
	}

	private List<ViewResearcherProposalResponse> arrangeProposalList(List<Object[]> l) {

		List<Object[]> profiles = researcherProfilePersonalInfoMasterRepository
				.findByProfileIdIn(l.stream().map(m -> Long.parseLong(m[2].toString())).collect(Collectors.toSet()));

		Map<Long, ZillaResponse> districts = getDistricts(profiles);
		Map<Long, UpaZillaResponse> upaZillas = getUpazilla(profiles);
		Map<Long, DivisionResponse> divisions = getDivisions(profiles);

		Map<Long, ResearchCategoryTypeResponseDto> researchCategoryTypeResponseDtoMap = rmsConfigurationClientService
				.getByResearchCategoryTypeByIdSet(new IdSetRequestBodyDTO() {
					{
						setIds(l.stream().map(m -> Long.parseLong(m[5].toString())).collect(Collectors.toSet()));
					}
				}).getItems().stream().collect(Collectors.toMap(UuidIdHolderRequestBodyDTO::getId, dto -> dto));

		Map<Long, UserResponse> userMap = Objects.requireNonNull(uaaClientService
				.getUserByIdSet(l.stream().map(m -> Long.parseLong(m[6].toString())).collect(Collectors.toSet()))
				.getBody()).stream().collect(Collectors.toMap(UserResponse::getId, dto -> dto));

		List<ViewResearcherProposalResponse> list = new ArrayList<>();

		for (Object[] objects : l) {
//			if (objects[0] != null) {

			ViewResearcherProposalResponse dto = new ViewResearcherProposalResponse();
			dto.setProposalId(Long.parseLong(objects[0].toString()));
			dto.setProposalUuid(objects[1].toString());

			if (objects[2] != null) {
				dto.setResearcherProfilePersonalInfoMasterId(Long.parseLong(objects[2].toString()));
			}

			if (objects[3] != null) {
				dto.setResearchTitle(objects[3].toString());
			}

			if (objects[4] != null) {
				dto.setStSectorTypeId(Long.parseLong(objects[6].toString()));
			}

			if (objects[5] != null) {
				dto.setStResearchCatTypeId(Long.parseLong(objects[5].toString()));
				dto.setResearchCategoryType(researchCategoryTypeResponseDtoMap.get(dto.getStResearchCatTypeId()));
			}

			if (objects[6] != null) {
				dto.setUserId(Long.parseLong(objects[6].toString()));
				dto.setUserDto(userMap.get(dto.getUserId()));
			}

			Object[] profile = profiles.stream()
					.filter(f -> Long.parseLong(f[0].toString()) == dto.getResearcherProfilePersonalInfoMasterId())
					.findFirst().orElse(null);
			if (profile != null) {
				if (Integer.parseInt(profile[1].toString()) != 0) {
					dto.setDistrictId(Long.parseLong(profile[1].toString()));
					dto.setDistrictDto(districts.get(dto.getDistrictId()));
				}
				if (Integer.parseInt(profile[2].toString()) != 0) {
					dto.setUpzilaId(Long.parseLong(profile[2].toString()));
					dto.setUpzilaDto(upaZillas.get(dto.getUpzilaId()));
				}
				if (Integer.parseInt(profile[3].toString()) != 0) {
					dto.setDivisionId(Long.parseLong(profile[3].toString()));
					dto.setDivisionDto(divisions.get(dto.getDivisionId()));
				}
				if (Integer.parseInt(profile[4].toString()) != 0) {
					dto.setPreDistrictId(Long.parseLong(profile[4].toString()));
					dto.setPreDistrictDto(districts.get(dto.getPreDistrictId()));
				}
				if (Integer.parseInt(profile[5].toString()) != 0) {
					dto.setPreUpzilaId(Long.parseLong(profile[5].toString()));
					dto.setPreUpzilaDto(upaZillas.get(dto.getPreUpzilaId()));
				}
				if (Integer.parseInt(profile[6].toString()) != 0) {
					dto.setPreDivisionId(Long.parseLong(profile[6].toString()));
					dto.setPreDivisionDto(divisions.get(dto.getPreDivisionId()));
				}
			}

			list.add(dto);
//			}
		}

		return list;
	}

	private String getSql(String stFiscalYearId, String userId, String category) {

		return "select proposal_id, proposal_uuid, researcher_profile_personal_info_master_id, "
				+ "research_title, st_sector_type_id , st_research_cat_type_id, user_id " + "from view_researcher_list "
				+ "where is_deleted = false " + stFiscalYearId + userId + category;
	}

	private Map<Long, ZillaResponse> getDistricts(List<Object[]> profiles) {
		Set<Long> districtSet = profiles.stream().map(m -> Long.parseLong(m[1].toString())).filter(f -> f > 0)
				.collect(Collectors.toSet());
		districtSet.addAll(profiles.stream().map(m -> Long.parseLong(m[4].toString())).filter(f -> f > 0)
				.collect(Collectors.toSet()));
		Map<Long, ZillaResponse> districtMap = new HashMap<>();
		if (!districtSet.isEmpty()) {
			Response<ZillaResponse> zillaResponseResponse = rmsConfigurationClientService
					.findByZillaIdSet(new IdSetRequestBodyDTO() {
						{
							setIds(districtSet);
						}
					});
			if (zillaResponseResponse.getItems() != null && !zillaResponseResponse.getItems().isEmpty()) {
				return zillaResponseResponse.getItems().stream()
						.collect(Collectors.toMap(ZillaResponse::getId, dto -> dto));
			}
		}
		return districtMap;
	}

	private Map<Long, UpaZillaResponse> getUpazilla(List<Object[]> profiles) {
		Set<Long> upazilaSet = profiles.stream().map(m -> Long.parseLong(m[2].toString())).filter(f -> f > 0)
				.collect(Collectors.toSet());
		upazilaSet.addAll(profiles.stream().map(m -> Long.parseLong(m[5].toString())).filter(f -> f > 0)
				.collect(Collectors.toSet()));
		Map<Long, UpaZillaResponse> upaZillaMap = new HashMap<>();
		if (!upazilaSet.isEmpty()) {
			Response<UpaZillaResponse> upazilaResponseResponse = rmsConfigurationClientService
					.findByUpazillaIdSet(new IdSetRequestBodyDTO() {
						{
							setIds(upazilaSet);
						}
					});
			if (upazilaResponseResponse.getItems() != null && !upazilaResponseResponse.getItems().isEmpty()) {
				return upazilaResponseResponse.getItems().stream()
						.collect(Collectors.toMap(UpaZillaResponse::getId, dto -> dto));
			}
		}
		return upaZillaMap;
	}

	private Map<Long, DivisionResponse> getDivisions(List<Object[]> profiles) {
		Set<Long> divisionSet = profiles.stream().map(m -> Long.parseLong(m[3].toString())).filter(f -> f > 0)
				.collect(Collectors.toSet());
		divisionSet.addAll(profiles.stream().map(m -> Long.parseLong(m[6].toString())).filter(f -> f > 0)
				.collect(Collectors.toSet()));
		Map<Long, DivisionResponse> divisionMap = new HashMap<>();
		if (!divisionSet.isEmpty()) {
			Response<DivisionResponse> divisionResponseResponse = rmsConfigurationClientService
					.findByDivisionIdSet(new IdSetRequestBodyDTO() {
						{
							setIds(divisionSet);
						}
					});
			if (divisionResponseResponse.getItems() != null && !divisionResponseResponse.getItems().isEmpty()) {
				return divisionResponseResponse.getItems().stream()
						.collect(Collectors.toMap(DivisionResponse::getId, dto -> dto));
			}
		}
		return divisionMap;
	}

	@Override
	public Response<ViewProfileProposalMarksResponse> getMarksByFiscalYear(ViewResearcherList request) {

		String stFiscalYearId = "";
		if (request.getStFiscalYearId() == null) {
			return new Response<>() {
				{
					setSuccess(false);
					setMessage("Fiscal Year Not Found");
				}
			};
		} else {
			stFiscalYearId = " and st_fiscal_year_id = " + request.getStFiscalYearId();
		}

		String category = "";
		if (request.getStResearchCatTypeId() != null) {
			category = " and st_research_cat_type_id = " + request.getStResearchCatTypeId();
		}

		String userId = "";
		if (request.getUserId() != null) {
			userId = " and user_id = " + request.getUserId();
		}

		String SQL = getMarksSql(stFiscalYearId, category, userId);
		EntityManager entityManager = entityManagerFactory.createEntityManager();

		Query nativeQuery = entityManager.createNativeQuery(SQL);
		List<Object[]> l = nativeQuery.getResultList();

		if (l.isEmpty()) {
			return new Response<>() {
				{
					setMessage("Data Empty");
				}
			};
		}

		Object[] firstData = l.get(0);
		if (firstData[0] == null)
			return new Response<>() {
				{
					setMessage("Data Empty");
				}
			};

		List<ViewProfileProposalMarksResponse> list = arrangeMarks(l);

		Response<FiscalResponseDto> fiscalResponseDtoResponse = rmsConfigurationClientService
				.getByFiscalYearId(request.getStFiscalYearId());

		ViewProfileProposalMarksResponse requestData = new ViewProfileProposalMarksResponse();
		if (fiscalResponseDtoResponse.isSuccess() && fiscalResponseDtoResponse.getObj() != null) {
			requestData.setFiscalYearId(fiscalResponseDtoResponse.getObj().getId());
			requestData.setFiscalYearDto(fiscalResponseDtoResponse.getObj());
		}

		if (request.getStResearchCatTypeId() != null) {
			requestData.setResearchCategoryType(list.get(0).getResearchCategoryType());
			requestData.setStResearchCatTypeId(list.get(0).getStResearchCatTypeId());
		}

		if (request.getUserId() != null) {
			requestData.setUserDto(list.get(0).getUserDto());
			requestData.setUserId(list.get(0).getUserId());
		}

		return new Response<>() {
			{
				setMessage("Data Found");
				setItems(list);
				setObj(requestData);
			}
		};
	}

	private String getMarksSql(String stFiscalYearId, String category, String userId) {
		return "select proposal_id, proposal_uuid, user_id, st_research_cat_type_id, "
				+ "coalesce (proposal_marks, 0) as proposal_marks, coalesce (profile_marks, 0) as profile_marks, researcher_profile_personal_info_master_id "
				+ "from view_researcher_list " + "where is_deleted = false " + stFiscalYearId + userId + category;
	}

	private List<ViewProfileProposalMarksResponse> arrangeMarks(List<Object[]> l) {

		List<Object[]> profiles = researcherProfilePersonalInfoMasterRepository
				.findByProfileIdIn(l.stream().map(m -> Long.parseLong(m[6].toString())).collect(Collectors.toSet()));

		Map<Long, ZillaResponse> districts = getDistricts(profiles);
		Map<Long, UpaZillaResponse> upaZillas = getUpazilla(profiles);
		Map<Long, DivisionResponse> divisions = getDivisions(profiles);

		Map<Long, ResearchCategoryTypeResponseDto> researchCategoryTypeResponseDtoMap = rmsConfigurationClientService
				.getByResearchCategoryTypeByIdSet(new IdSetRequestBodyDTO() {
					{
						setIds(l.stream().map(m -> Long.parseLong(m[3].toString())).collect(Collectors.toSet()));
					}
				}).getItems().stream().collect(Collectors.toMap(UuidIdHolderRequestBodyDTO::getId, dto -> dto));

		Map<Long, UserResponse> userMap = Objects.requireNonNull(uaaClientService
				.getUserByIdSet(l.stream().map(m -> Long.parseLong(m[2].toString())).collect(Collectors.toSet()))
				.getBody()).stream().collect(Collectors.toMap(UserResponse::getId, dto -> dto));

		List<ViewProfileProposalMarksResponse> list = new ArrayList<>();

		for (Object[] objects : l) {
//			if (objects[0] != null) {

			ViewProfileProposalMarksResponse dto = new ViewProfileProposalMarksResponse();
			dto.setProposalId(Long.parseLong(objects[0].toString()));
			dto.setProposalUuid(objects[1].toString());

			if (objects[2] != null) {
				dto.setUserId(Long.parseLong(objects[2].toString()));
				dto.setUserDto(userMap.get(dto.getUserId()));
			}

			if (objects[3] != null) {
				dto.setStResearchCatTypeId(Long.parseLong(objects[3].toString()));
				dto.setResearchCategoryType(researchCategoryTypeResponseDtoMap.get(dto.getStResearchCatTypeId()));
			}

			if (objects[4] != null) {
				dto.setProposalMarks(Double.parseDouble(objects[4].toString()));
			}

			if (objects[5] != null) {
				dto.setProfileMarks(Double.parseDouble(objects[5].toString()));
			}

			if (objects[6] != null) {
				dto.setResearcherProfilePersonalInfoMasterId(Long.parseLong(objects[6].toString()));
			}

			Object[] profile = profiles.stream()
					.filter(f -> Long.parseLong(f[0].toString()) == dto.getResearcherProfilePersonalInfoMasterId())
					.findFirst().orElse(null);
			if (profile != null) {
				if (Integer.parseInt(profile[1].toString()) != 0) {
					dto.setDistrictId(Long.parseLong(profile[1].toString()));
					dto.setDistrictDto(districts.get(dto.getDistrictId()));
				}
				if (Integer.parseInt(profile[2].toString()) != 0) {
					dto.setUpzilaId(Long.parseLong(profile[2].toString()));
					dto.setUpzilaDto(upaZillas.get(dto.getUpzilaId()));
				}
				if (Integer.parseInt(profile[3].toString()) != 0) {
					dto.setDivisionId(Long.parseLong(profile[3].toString()));
					dto.setDivisionDto(divisions.get(dto.getDivisionId()));
				}
				if (Integer.parseInt(profile[4].toString()) != 0) {
					dto.setPreDistrictId(Long.parseLong(profile[4].toString()));
					dto.setPreDistrictDto(districts.get(dto.getPreDistrictId()));
				}
				if (Integer.parseInt(profile[5].toString()) != 0) {
					dto.setPreUpzilaId(Long.parseLong(profile[5].toString()));
					dto.setPreUpzilaDto(upaZillas.get(dto.getPreUpzilaId()));
				}
				if (Integer.parseInt(profile[6].toString()) != 0) {
					dto.setPreDivisionId(Long.parseLong(profile[6].toString()));
					dto.setPreDivisionDto(divisions.get(dto.getPreDivisionId()));
				}
			}

			list.add(dto);
//			}
		}

		return list;
	}

//	CREATE OR REPLACE VIEW public.view_researcher_list
//	AS SELECT r_proposal.id AS proposal_id,
//	    r_proposal.uuid AS proposal_uuid,
//	    r_proposal.researcher_profile_personal_info_master_id,
//	    r_proposal.cancellation_note,
//	    r_proposal.cancelled_by,
//	    r_proposal.is_cancelled,
//	    r_proposal.is_editable,
//	    r_proposal.research_title,
//	    r_proposal.st_fiscal_year_id,
//	    r_proposal.st_research_cat_type_id,
//	    r_proposal.st_sdgs_goals_id,
//	    r_proposal.st_sector_type_id,
//	    r_proposal.st_sub_sectors_id,
//	    r_proposal.cancelation_note,
//	    r_proposal.res_profile_personal_info_id,
//	    r_profile.id AS profile_id,
//	    r_profile.uuid AS profile_uuid,
//	    r_profile.present_address,
//	    r_profile.permanent_address,
//	    r_profile.full_name,
//	    r_profile.rms_user_signature_id,
//	    r_profile.rms_user_image_id,
//	    r_profile.user_id,
//	    r_profile.upzila_id,
//	    r_profile.union_id,
//	    r_profile.total_researcher_numbers,
//	    r_profile.tinverification_status,
//	    r_profile.tinnumber,
//	    r_profile.research_training,
//	    r_profile.reg_number,
//	    r_profile.occupation,
//	    r_profile.nidverification_status,
//	    r_profile.nidnumber,
//	    r_profile.mother_name,
//	    r_profile.mobile_no,
//	    r_profile.is_pending,
//	    r_profile.is_final_approval,
//	    r_profile.is_draft_approval,
//	    r_profile.father_name,
//	    r_profile.email_address,
//	    r_profile.district_id,
//	    r_profile.details_present_address,
//	    r_profile.designation,
//	    r_profile.date_of_birth,
//	    r_profile.age,
//	    r_profile.is_deleted,
//	    r_proposal.approval_status,
//	    r_proposal.approved_by,
//	    ( SELECT rpm.total_marks
//	           FROM m1_researcher_proposal_marks rpm
//	          WHERE rpm.is_deleted = false AND rpm.researcher_proposal_id = r_proposal.id) AS proposal_marks,
//	    ( SELECT rpm.total_marks
//	           FROM m1_researcher_profile_marks rpm
//	          WHERE rpm.is_deleted = false AND rpm.researcher_proposal_id = r_proposal.id) AS profile_marks,
//	    ( SELECT lwe.st_profile_of_expert_evaluators_id
//	           FROM m1_linkup_proposal_with_evaluators lwe
//	          WHERE lwe.researcher_proposal_id = r_proposal.id) AS st_profile_of_expert_evaluators_id
//	   FROM m1_researcher_profile_personal_info r_profile
//	     RIGHT JOIN m1_researcher_proposal r_proposal ON r_profile.id = r_proposal.researcher_profile_personal_info_master_id;

	public Page<ViewResearcherList> criteriaBasedSearchOld(ViewResearcherList request) {

		// return test(request);

		Pageable pageable = getPageable(request.getPageableRequestBodyDTO());

		Long total = 0L;

		String stFiscalYearId = "";
		if (request.getStFiscalYearId() != null) {
			stFiscalYearId = " and st_fiscal_year_id = " + request.getStFiscalYearId();
		}

		String researcherName = "";
		if (request.getProfileId() != null) {
			researcherName = " and profile_id = " + request.getProfileId();
		}

		String researchTitle = "";
		if (request.getProposalId() != null) {
			researchTitle = " and proposal_id = " + request.getProposalId();
		}

		String stResearchCatTypeId = "";
		if (request.getStResearchCatTypeId() != null) {
			stResearchCatTypeId = " and st_research_cat_type_id = " + request.getStResearchCatTypeId();
		}

		String approvalStatus = "";
		if (request.getApprovalStatus() != null) {
			approvalStatus = " and approval_status = " + request.getApprovalStatus();
		}

		String userId = "";
		if (request.getUserId() != null) {
			userId = " and user_id = " + request.getUserId();
		}

		String stProfileOfExpertEvaluatorsId = "";
		if (request.getStProfileOfExpertEvaluatorsId() != null) {
			stProfileOfExpertEvaluatorsId = " and st_profile_of_expert_evaluators_id = "
					+ request.getStProfileOfExpertEvaluatorsId()
					+ " or st_profile_of_expert_evaluators_id_for_pro_marks = "
					+ request.getStProfileOfExpertEvaluatorsId();
		}

		String isFinalSubmit = "";
		if (request.getIsFinalSubmit() != null) {
			isFinalSubmit = " and is_final_submit = " + request.getIsFinalSubmit();
		}

		String orderBy = "";
		if (!StringUtils.isEmpty(request.getOrderBy())) {
			orderBy = request.getOrderBy().equals("profile_marks") ? " order by profile_marks desc nulls last"
					: request.getOrderBy().equals("proposal_marks") ? " order by proposal_marks desc nulls last"
							: request.getOrderBy().equals("profile_proposal_marks")
									? " order by profile_marks desc nulls last, proposal_marks DESC NULLS last"
									: request.getOrderBy().equals("all") ? " order by proposal_id desc" : null;
		}

		String SQL = getSql(stFiscalYearId, researchTitle, researcherName, stResearchCatTypeId, approvalStatus, userId,
				stProfileOfExpertEvaluatorsId, isFinalSubmit, request.getPageableRequestBodyDTO(), orderBy);
		EntityManager entityManager = entityManagerFactory.createEntityManager();
		Query nativeQuery = entityManager.createNativeQuery(SQL);
		List<Object[]> l = nativeQuery.getResultList();

		List<ViewResearcherList> list = new ArrayList<ViewResearcherList>();

		for (Object[] objects : l) {
			if (objects[0] != null) {

				ViewResearcherList dto = new ViewResearcherList();

//				dto.setProposalId(Long.parseLong(objects[0].toString()));
//
//				dto.setProposalUuid(objects[1].toString());
//
//				dto.setResearcherProfilePersonalInfoMasterId(Long.parseLong(objects[2].toString()));
//
//				if (objects[3] != null) {
//					dto.setCancellationNote(objects[3].toString());
//				}
//
//				if (objects[4] != null) {
//					dto.setCancelledBy(Long.parseLong(objects[4].toString()));
//				}
//
//				if (objects[5] != null) {
//					dto.setIsCancelled(Long.parseLong(objects[5].toString()));
//				}
//
//				if (objects[6] != null) {
//					dto.setIsEditable(Long.parseLong(objects[6].toString()));
//				}
//
//				if (objects[7] != null) {
//					dto.setResearchTitle(objects[7].toString());
//				}
//
//				if (objects[8] != null) {
//					dto.setStFiscalYearId(Long.parseLong(objects[8].toString()));
//				}
//
//				if (objects[9] != null) {
//					dto.setStResearchCatTypeId(Long.parseLong(objects[9].toString()));
//				}
//
//				if (objects[10] != null) {
//					dto.setStSdgsGoalsId(Long.parseLong(objects[10].toString()));
//				}
//
//				if (objects[11] != null) {
//					dto.setStSectorTypeId(Long.parseLong(objects[11].toString()));
//				}
//
//				if (objects[12] != null) {
//					dto.setStSubSectorsId(Long.parseLong(objects[12].toString()));
//				}
//
//				if (objects[13] != null) {
//					dto.setCancellationNote(objects[13].toString());
//				}
//
//				if (objects[14] != null) {
//					dto.setResProfilePersonalInfoId(Long.parseLong(objects[14].toString()));
//				}
//
//				if (objects[15] != null) {
//					dto.setProfileId(Long.parseLong(objects[15].toString()));
//				}
//
//				if (objects[16] != null) {
//					dto.setProfileUuid(objects[16].toString());
//				}
//
////				dto.setPresentAddress(objects[17].toString());
////				dto.setPermanentAddress(objects[18].toString());
////				dto.setFullName(objects[19].toString());
//
//				if (objects[20] != null) {
//					dto.setRmsUserSignatureId(Long.parseLong(objects[20].toString()));
//				}
//
//				if (objects[21] != null) {
//					dto.setRmsUserImageId(Long.parseLong(objects[21].toString()));
//				}
//
//				if (objects[22] != null) {
//					dto.setUserId(Long.parseLong(objects[22].toString()));
//					dto.setUserDto(uaaClientService.getUser(dto.getUserId()).getBody());
//				}
//
//				if (objects[23] != null) {
//					dto.setUpzilaId(objects[23].toString());
//				}
//
//				if (objects[24] != null) {
//					dto.setUnionId(objects[24].toString());
//				}
//
//				if (objects[25] != null) {
//					dto.setTotalResearcherNumbers(objects[25].toString());
//				}
//
//				if (objects[26] != null) {
//					dto.setTINVerificationStatus(objects[26].toString());
//				}
//
//				if (objects[27] != null) {
//					dto.setTINNumber(objects[27].toString());
//				}
//
//				if (objects[28] != null) {
//					dto.setResearchTraining(objects[28].toString());
//				}
//
//				if (objects[29] != null) {
//					dto.setRegNumber(objects[29].toString());
//				}
//
//				if (objects[30] != null) {
//					dto.setOccupation(objects[30].toString());
//				}
//
//				if (objects[31] != null) {
//					dto.setNIDVerificationStatus(objects[31].toString());
//				}
//
//				if (objects[32] != null) {
//					dto.setNIDNumber(objects[32].toString());
//				}
//
//				if (objects[33] != null) {
//					dto.setMotherName(objects[33].toString());
//				}
//
//				if (objects[34] != null) {
//					dto.setMobileNo(objects[34].toString());
//				}
//
//				if (objects[35] != null) {
//					dto.setIsPending(Boolean.valueOf(objects[35].toString()));
//				}
//
//				if (objects[36] != null) {
//					dto.setIsFinalApproval(Boolean.valueOf(objects[36].toString()));
//				}
//
//				if (objects[37] != null) {
//					dto.setIsDraftApproval(Boolean.valueOf(objects[37].toString()));
//				}
//
//				if (objects[38] != null) {
//					dto.setFatherName(objects[38].toString());
//				}
//
//				if (objects[39] != null) {
//					dto.setEmailAddress(objects[39].toString());
//				}
//
//				if (objects[40] != null) {
//					dto.setDistrictId(objects[40].toString());
//				}
//
//				if (objects[41] != null) {
//					dto.setDetailsPresentAddress(objects[41].toString());
//				}
//
//				if (objects[42] != null) {
//					dto.setDesignation(objects[42].toString());
//				}
//
////                  dto.setDateOfBirth(objects[43].toString());
//
//				if (objects[44] != null) {
//					dto.setAge(Long.parseLong(objects[44].toString()));
//				}
//
//				if (objects[46] != null) {
//					dto.setApprovalStatus(Integer.parseInt(objects[46].toString()));
//				}
//
//				if (objects[47] != null) {
//					dto.setApprovedBy(Integer.parseInt(objects[47].toString()));
//				}
//
//				if (objects[48] != null) {
//					dto.setProposalMarks(Double.parseDouble(objects[48].toString()));
//				}
//
//				if (objects[49] != null) {
//					dto.setProfileMarks(Double.parseDouble(objects[49].toString()));
//				}
//
//				if (objects[50] != null) {
//					dto.setStProfileOfExpertEvaluatorsId(Long.parseLong(objects[50].toString()));
//				}
//
//				total = Long.parseLong(objects[51].toString());

				dto.setProposalId(Long.parseLong(objects[0].toString()));

				dto.setProposalUuid(objects[1].toString());

				if (objects[2] != null) {
					dto.setResearcherProfilePersonalInfoMasterId(Long.parseLong(objects[2].toString()));
				}

				if (objects[3] != null) {
					dto.setResearchTitle(objects[3].toString());
				}

				if (objects[4] != null) {
					dto.setStFiscalYearId(Long.parseLong(objects[4].toString()));
				}

				if (objects[5] != null) {
					dto.setStResearchCatTypeId(Long.parseLong(objects[5].toString()));
				}

				if (objects[6] != null) {
					dto.setStSectorTypeId(Long.parseLong(objects[6].toString()));
				}

				if (objects[7] != null) {
					dto.setStSubSectorsId(Long.parseLong(objects[7].toString()));
				}

				if (objects[8] != null) {
					dto.setProfileId(Long.parseLong(objects[8].toString()));
				}

				if (objects[9] != null) {
					dto.setProfileUuid(objects[9].toString());
				}

				if (objects[10] != null) {
					dto.setUserId(Long.parseLong(objects[10].toString()));
					dto.setUserDto(uaaClientService.getUser(dto.getUserId()).getBody());
				}

				if (objects[12] != null) {
					dto.setApprovalStatus(Integer.parseInt(objects[12].toString()));
				}

				if (objects[13] != null) {
					dto.setApprovedBy(Integer.parseInt(objects[13].toString()));
				}

				if (objects[14] != null) {
					dto.setProposalMarks(Double.parseDouble(objects[14].toString()));
				}

				if (objects[15] != null) {
					dto.setProfileMarks(Double.parseDouble(objects[15].toString()));
				}

				if (objects[16] != null) {
					dto.setStProfileOfExpertEvaluatorsId(Long.parseLong(objects[16].toString()));
				}

				if (objects[17] != null) {
					dto.setIsInstitutional(Boolean.parseBoolean(objects[17].toString()));
				}

				if (objects[18] != null) {
					dto.setIsFinalSubmit(Boolean.parseBoolean(objects[18].toString()));
				}

				if (objects[19] != null) {
					dto.setStProfileOfExpertEvaluatorsIdForProMarks(Long.parseLong(objects[19].toString()));
				}

				total = Long.parseLong(objects[20].toString());

				list.add(dto);

			}
		}

		return new PageImpl<>(list, pageable, total);
	}

}
