package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.UaaClientService;
import com.ibcs.idsdp.rpm.model.domain.AgreementInstallment;
import com.ibcs.idsdp.rpm.model.domain.ViewResearchFinalSubmissionReport;
import com.ibcs.idsdp.rpm.model.domain.ViewResearchListPublic;
import com.ibcs.idsdp.rpm.model.repositories.ViewResearchListPublicRepository;
import com.ibcs.idsdp.rpm.services.ViewResearchListPublicService;
import com.ibcs.idsdp.rpm.web.dto.request.ConnectionRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ConnectionResponseDto;
import com.ibcs.idsdp.util.Response;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManagerFactory;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class ViewResearchListPublicServiceImpl
		extends BaseService<AgreementInstallment, ConnectionRequestDto, ConnectionResponseDto>
		implements ViewResearchListPublicService {

	protected ViewResearchListPublicServiceImpl(ServiceRepository<AgreementInstallment> repository) {
		super(repository);
	}

	@Autowired
	private UaaClientService uaaClientService;

	@Autowired
	private ViewResearchListPublicRepository viewResearchListPublicRepository;

	@Autowired
	private EntityManagerFactory entityManagerFactory;

	@Autowired
	private Environment env;

	@Autowired
	private RmsConfigurationClientService rmsConfigurationClientService;

	private static final int DEFAULT_PAGE_SIZE = 1000000;

	public Page<ViewResearchListPublic> criteriaBasedSearch(ViewResearchListPublic request) {
		return test(request);
	}

	private String getSql(String stFiscalYearId, String keyWord, String stSectorTypeId, String divisionId,
			String districtId, String upzilaId, PageableRequestBodyDTO pageableRequestBodyDTO) {

		return "with cte as (select * from view_researcher_list_public_for_grid "
				+ "where is_deleted = false "
				+ stFiscalYearId + keyWord + stSectorTypeId + divisionId + districtId + upzilaId + ") "
				+ "SELECT * " + "FROM  (TABLE cte " + "LIMIT " + pageableRequestBodyDTO.getSize() + " OFFSET "
				+ pageableRequestBodyDTO.getPage() + ") sub "
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

	public Page<ViewResearchListPublic> test(ViewResearchListPublic request) {

		Pageable pageable = getPageable(request.getPageableRequestBodyDTO());

		Long total = 0L;

		String stFiscalYearId = "";
		if (request.getStFiscalYearId() != null) {
			stFiscalYearId = " and st_fiscal_year_id = " + request.getStFiscalYearId();
		}

		String keyWord = "";
		if (request.getKeyWord() != null) {
			keyWord = " and proposal_id in (select distinct (rpkw.researcher_proposal_id) from researcher_proposal_key_word rpkw where rpkw.key_word= '"+ request.getKeyWord()+"')" ;
		}

		String stSectorTypeId = "";
		if (request.getStSectorTypeId() != null) {
			stSectorTypeId = " and st_sector_type_id = " + request.getStSectorTypeId();
		}

		String divisionId = "";
		if (request.getDivisionId() != null) {
			divisionId = " and division_id = " + request.getDivisionId();
		}

		String districtId = "";
		if (request.getDistrictId() != null) {
			districtId = " and district_id = " + request.getDistrictId();
		}

		String upzilaId = "";
		if (request.getUpzilaId() != null) {
			upzilaId = " and upzila_id = " + request.getUpzilaId();
		}

		String SQL = getSql(stFiscalYearId, keyWord, stSectorTypeId, divisionId, districtId, upzilaId,	request.getPageableRequestBodyDTO());

		Connection con = null;
		ResultSet rs = null;
		Statement stm = null;

		List<ViewResearchListPublic> list = new ArrayList<ViewResearchListPublic>();

		try {
			//System.out.println("SQL === >>>> " + SQL);
			con = getOraConnection();
			stm = con.createStatement();
			rs = stm.executeQuery(SQL);

			while (rs.next()) {

				ViewResearchListPublic dto = new ViewResearchListPublic();

//				dto.setId(rs.getLong("id"));
//				dto.setKeyWord(rs.getString("key_word"));
				dto.setProposalId(rs.getLong("proposal_id"));

				if (dto.getProposalId() == null || dto.getProposalId() == 0) {
					break;
				}

				//dto.setProposalUuid(rs.getString("proposal_uuid"));
				//dto.setResearcherProfilePersonalInfoMasterId(rs.getLong("researcher_profile_personal_info_master_id"));

				dto.setResearchTitle(rs.getString("research_title"));
				dto.setStFiscalYearId(rs.getLong("st_fiscal_year_id"));
				dto.setStResearchCatTypeId(rs.getLong("st_research_cat_type_id"));
				dto.setStSectorTypeId(rs.getLong("st_sector_type_id"));
				dto.setStSubSectorsId(rs.getLong("st_sub_sectors_id"));

				//dto.setProfileId(rs.getLong("profile_id"));
				//dto.setProfileUuid(rs.getString("profile_uuid"));

				dto.setUserId(rs.getLong("user_id"));
				if (dto.getUserId() != null) {
					dto.setUserDto(uaaClientService.getUser(dto.getUserId()).getBody());
				}
				//dto.setApprovalStatus(rs.getInt("approval_status"));
				//dto.setApprovedBy(rs.getInt("approved_by"));
				dto.setIsInstitutional(rs.getBoolean("is_institutional"));
				//dto.setIsFinalSubmit(rs.getBoolean("is_final_submit"));
				dto.setDivisionName(rs.getString("division_name"));
				dto.setDistrictName(rs.getString("district_name"));
				dto.setUpzilaName(rs.getString("upzila_name"));
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
	public Response<ViewResearchListPublic> findByKeyWord(ViewResearchListPublic request) {
		String words = request.getHashTag().toLowerCase();
		String SQL = "select distinct(hash_tag) from view_research_final_submission_report where LOWER(hash_tag) like '%" +words+ "%'";

		Connection con = null;
		ResultSet rs = null;
		Statement stm = null;

		List<ViewResearchListPublic> list = new ArrayList<ViewResearchListPublic>();

		try {
			//System.out.println("SQL === >>>> " + SQL);
			con = getOraConnection();
			stm = con.createStatement();
			rs = stm.executeQuery(SQL);

			while (rs.next()) {
				ViewResearchListPublic dto = new ViewResearchListPublic();
				//dto.setId(rs.getLong("id"));
				dto.setKeyWord(rs.getString("hash_tag"));
				list.add(dto);
			}

		} catch (SQLException e) {
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

		if (!CollectionUtils.isEmpty(list) && list.size() > 0) {

			return new Response<ViewResearchListPublic>() {
				{
					setItems(list);
					setMessage("Data Found");
					setSuccess(true);
				}
			};
		}

		return getErrorResponse("Data Not Found !");

	}


	private String findingRecords(String stFiscalYearId, String keyWord, String stResearchCatTypeId, String stSectorTypeId, String stSubSectorsId, String divisionName, String districtName, String upzilaName, PageableRequestBodyDTO pageableRequestBodyDTO) {
		return "with cte as (select * from view_research_final_submission_report "
				+ "where is_deleted = false "
				+ stFiscalYearId + keyWord + stResearchCatTypeId + stSectorTypeId + stSubSectorsId + divisionName + districtName + upzilaName + ") "
				+ "SELECT * " + "FROM  (TABLE cte " + "LIMIT " + pageableRequestBodyDTO.getSize() + " OFFSET "
				+ pageableRequestBodyDTO.getPage() + ") sub "
				+ "RIGHT  JOIN (SELECT count(*) FROM cte) c(total) ON true";
	}
	public Page<ViewResearchFinalSubmissionReport> findByUserKeyWords(ViewResearchFinalSubmissionReport request) {

		Pageable pageable = getPageable(request.getPageableRequestBodyDTO());

		Long total = 0L;

		String stFiscalYearId = "";
		if (request.getStFiscalYearId() != null) {
			stFiscalYearId = " and st_fiscal_year_id = " + request.getStFiscalYearId();
		}

		String keyWord = "";
		if (request.getHashTag() != null) {
			String words = request.getHashTag().toLowerCase();
			keyWord = " and LOWER(hash_tag) like '%"+ words +"%'";
		}

		String stResearchCatTypeId = "";
		if (request.getStResearchCatTypeId() != null) {
			stResearchCatTypeId = " and st_research_cat_type_id = " + request.getStResearchCatTypeId();
		}

		String stSectorTypeId = "";
		if (request.getStSectorTypeId() != null) {
			stSectorTypeId = " and st_sector_type_id = " + request.getStSectorTypeId();
		}

		String stSubSectorsId = "";
		if (request.getStSubSectorsId() != null) {
			stSubSectorsId = " and st_sub_sectors_id = " + request.getStSubSectorsId();
		}

		String divisionName = "";
		if (request.getDivisionName() != null && request.getDivisionName() != "") {
			divisionName = " and LOWER(division_name) like '%"+ request.getDivisionName().toLowerCase() +"%'";
		}

		String districtName = "";
		if (request.getDistrictName() != null && request.getDistrictName() != "") {
			districtName =  " and LOWER(district_name) like '%"+ request.getDistrictName().toLowerCase() +"%'";
		}

		String upzilaName = "";
		if (request.getUpzilaName() != null && request.getUpzilaName() != "") {
			upzilaName = " and LOWER(upzila_name) like '%"+ request.getUpzilaName().toLowerCase() +"%'";
		}

		String SQL = findingRecords(stFiscalYearId, keyWord, stResearchCatTypeId, stSectorTypeId, stSubSectorsId, divisionName, districtName, upzilaName, request.getPageableRequestBodyDTO());

		Connection con = null;
		ResultSet rs = null;
		Statement stm = null;

		List<ViewResearchFinalSubmissionReport> list = new ArrayList<>();

		try {
			//System.out.println("SQL 222 === >>>> " + SQL);
			con = getOraConnection();
			stm = con.createStatement();
			rs = stm.executeQuery(SQL);
			//System.out.println("rs === >>>> " +rs);
			while (rs.next()) {
				//System.out.println(rs.getString(1));

				ViewResearchFinalSubmissionReport dto = new ViewResearchFinalSubmissionReport();

				dto.setResearchTitle(rs.getString("research_title"));

				dto.setStFiscalYearId(rs.getLong("st_fiscal_year_id"));

				var fYear = rmsConfigurationClientService.getByFiscalYearId(dto.getStFiscalYearId());
				if(fYear.isSuccess()){
					dto.setFiscalYear(fYear.getObj().getFiscalYear());
				}

				dto.setDivisionId(rs.getString("division_id"));
				dto.setDivisionName(rs.getString("division_name"));
				dto.setDistrictId(rs.getString("district_id"));
				dto.setDistrictName(rs.getString("district_name"));
				dto.setUpzilaId(rs.getString("upzila_id"));
				dto.setUpzilaName(rs.getString("upzila_name"));
				dto.setUuid(rs.getString("proposal_uuid"));
				dto.setId(rs.getLong("id"));

				dto.setStResearchCatTypeId(rs.getLong("st_research_cat_type_id"));

				dto.setStSectorTypeId(rs.getLong("st_sector_type_id"));

				dto.setStSubSectorsId(rs.getLong("st_sub_sectors_id"));
				var subSector = rmsConfigurationClientService.getSubSectorById(dto.getStSubSectorsId());
				if(subSector.isSuccess())
				{
					dto.setSubSectorResponseDto(subSector.getObj());
					//dto.setSubSectorResponseDto(rmsConfigurationClientService.getSubSectorById(dto.getStSubSectorsId()).getObj());
				}

				dto.setCreatedBy(rs.getString("created_by"));
				if (dto.getCreatedBy() != null) {
					dto.setUserDto(uaaClientService.getUser(Long.valueOf(dto.getCreatedBy().trim())).getBody());
				}

				dto.setBackground(rs.getString("background"));
				dto.setConclusion(rs.getString("conclusion"));
				dto.setDiscussion(rs.getString("discussion"));
				dto.setFindings(rs.getString("findings"));
				dto.setGeneralRecommendation(rs.getString("general_recommendation"));
				dto.setHashTag(rs.getString("hash_tag"));
				dto.setIntroduction(rs.getString("introduction"));
				dto.setM1ResearcherProfilePersonalInfoId(rs.getLong("m1_researcher_profile_personal_info_id"));
				dto.setM1ResearcherProposalId(rs.getLong("m1_researcher_proposal_id"));
				dto.setMethodFollowedInTheResearch(rs.getString("method_followed_in_the_research"));
				dto.setObjectSummary(rs.getString("object_summary"));
				dto.setPolicy(rs.getString("policy"));
				dto.setStatus(rs.getString("status"));

				list.add(dto);
			}
		}catch (SQLException e) {
			return new PageImpl<>(Collections.EMPTY_LIST, pageable, total);
		}

		return new PageImpl<>(list, pageable, total);
	}

}
