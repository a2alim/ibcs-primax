package com.ibcs.idsdp.trainninginstitute.services.implementation;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ibcs.idsdp.common.services.LoggedUsersService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.trainninginstitute.enums.ProposalStatus;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingInstituteProfileModel;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ProposalRepository;
import com.ibcs.idsdp.trainninginstitute.services.NominatedInstituteService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ViewResearchList;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.NominatedInstituteResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class NominatedInstituteServiceImpl implements NominatedInstituteService {

	private final ProposalRepository proposalRepository;
	private final LoggedUsersService loggedUsersService;

	private static final int DEFAULT_PAGE_SIZE = 1000000;

	@Autowired
	private Environment env;

	@Override
	public ResponseEntity<ApiMessageResponse> changeShortListStatus(Long id, Boolean shortListStatus) {
		ProposalModel proposalModel = proposalRepository.findByIsDeletedAndId(false, id).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proposal not found with id: " + id));

		proposalModel.setIsShortListed(shortListStatus);

		proposalRepository.save(proposalModel);

		return new ResponseEntity<>(new ApiMessageResponse(200, "Proposal status updated successfully"), HttpStatus.OK);
	}

	@Override
	public ResponseEntity<PaginationResponse<List<NominatedInstituteResponse>>> getNominatedInstitutes(
			Boolean isShortListed, Long trainingInstituteId, Integer page, Integer size, Long fiscalYearId) {

		TrainingInstituteProfileModel trainingInstituteProfileModel = new TrainingInstituteProfileModel();
		trainingInstituteProfileModel.setId(trainingInstituteId);

		Sort sort = Sort.by(Sort.Direction.DESC, "id");
		Pageable pageable = PageRequest.of(page, size, sort);

		ProposalModel exampleProposal = ProposalModel.builder().isShortListed(isShortListed).fiscalYearId(fiscalYearId)
				.trainingInstituteProfileModel(trainingInstituteProfileModel).build();
		exampleProposal.setIsDeleted(false);

		Page<ProposalModel> proposalModelPage = proposalRepository.findAll(Example.of(exampleProposal), pageable);

		List<NominatedInstituteResponse> nominatedInstituteResponses = new ArrayList<>();

		proposalModelPage.getContent().forEach(proposalModel -> {
			NominatedInstituteResponse nominatedInstituteResponse = new NominatedInstituteResponse();
			if (proposalModel.getIsSubmitted()) {
				if (loggedUsersService.getLoggedUserType().equals("Rms_DO")) {

					BeanUtils.copyProperties(proposalModel, nominatedInstituteResponse);
					nominatedInstituteResponse.setTrainingInstituteNameDetails(
							proposalModel.getTrainingInstituteProfileModel().getTrainingInstituteName() + ", "
									+ proposalModel.getTrainingInstituteProfileModel().getHeadOfInstituteName() + ", "
									+ proposalModel.getTrainingInstituteProfileModel().getMobileNumber() + ", "
									+ proposalModel.getTrainingInstituteProfileModel().getEmail());

					nominatedInstituteResponse.setTrainingInstituteName(
							proposalModel.getTrainingInstituteProfileModel().getTrainingInstituteName());

					nominatedInstituteResponses.add(nominatedInstituteResponse);
				} else {
					System.out.println(loggedUsersService.getLoggedUserId());
					System.out.println(proposalModel.getTrainingInstituteProfileModel().getUserId());
					if (loggedUsersService.getLoggedUserId()
							.equals(proposalModel.getTrainingInstituteProfileModel().getUserId())) {

						BeanUtils.copyProperties(proposalModel, nominatedInstituteResponse);
						nominatedInstituteResponse.setTrainingInstituteName(
								proposalModel.getTrainingInstituteProfileModel().getTrainingInstituteName());

						nominatedInstituteResponses.add(nominatedInstituteResponse);
					}
				}
			}
		});

		PaginationResponse<List<NominatedInstituteResponse>> paginationResponse = new PaginationResponse<>(size, page,
				proposalModelPage.getContent().size(), proposalModelPage.isLast(), proposalModelPage.getTotalElements(),
				proposalModelPage.getTotalPages(), nominatedInstituteResponses);

		return new ResponseEntity<>(paginationResponse, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<ApiMessageResponse> changeStatus(Long id, Integer status) {
		ProposalModel proposalModel = proposalRepository.findByIsDeletedAndId(false, id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proposal not found with id: " + id));
		proposalModel.setProposalStatus(status);
		proposalRepository.save(proposalModel);
		return new ResponseEntity<>(new ApiMessageResponse(200, "Proposal status updated successfully"), HttpStatus.OK);
	}

	public Page<NominatedInstituteResponse> test(NominatedInstituteResponse request) {

		Pageable pageable = getPageable(request.getPageableRequestBodyDTO());

		Long total = 0L;

		String stFiscalYearId = "";
		if (request.getFiscalYearId() != null && request.getFiscalYearId() != 0) {
			stFiscalYearId = " and fiscal_year_id = " + request.getFiscalYearId();
		}

		String profileId = "";
		if (request.getProfileId() != null && request.getProfileId() !=0) {
			profileId = " and profile.id = " + request.getProfileId();
		}

		String proposalId = "";
		if (request.getProposalId() != null && request.getProposalId() !=0) {
			proposalId = " and proposal.id = " + request.getProposalId();
		}

		String isShortListed = "";
		if (request.getIsShortListed() != null) {
			isShortListed = " and is_short_listed = " + request.getIsShortListed();
		}

		String approvalStatus = "";
		if (request.getApprovalStatus() != null && request.getApprovalStatus() !=9) {
			approvalStatus = " and proposal_status = " + request.getApprovalStatus();
		}
		
		String userId = "";
		if (request.getUserId() != null) {
			userId = " and user_id = '" + request.getUserId() + "'";
		}

		String SQL = getSql(stFiscalYearId, profileId, proposalId, isShortListed, approvalStatus,userId, request.getPageableRequestBodyDTO());

		Connection con = null;
		ResultSet rs = null;
		Statement stm = null;

		List<NominatedInstituteResponse> list = new ArrayList<NominatedInstituteResponse>();

		try {
			System.out.println("SQL === >>>> " + SQL);
			con = getOraConnection();
			stm = con.createStatement();
			rs = stm.executeQuery(SQL);

			while (rs.next()) {

				NominatedInstituteResponse dto = new NominatedInstituteResponse();
				dto.setId(rs.getLong("id"));
				dto.setUuid(rs.getString("uuid"));
				dto.setTrainingName(rs.getString("training_name"));
				dto.setInstituteName(rs.getString("institute_name"));
				dto.setTrainingDuration(rs.getInt("training_duration"));
				dto.setProgramDate(rs.getDate("program_date"));
				dto.setFiscalYearId(rs.getLong("fiscal_year_id"));
				dto.setEditable(rs.getBoolean("is_editable"));
				dto.setSubmitted(rs.getBoolean("is_submitted"));
				dto.setTrainingInstituteName(rs.getString("training_institute_name"));
				// dto.setTrainingInstituteNameDetails(rs.getString(""));
				dto.setProposalStatusInt(rs.getInt("proposal_status"));
				dto.setIsShortListed(rs.getBoolean("is_short_listed"));
				dto.setIsCompletionReportSubmitted(rs.getBoolean("is_completion_report_submitted"));
				dto.setHeadOfInstituteName(rs.getString("head_of_institute_name"));
				dto.setMobileNumber(rs.getString("mobile_number"));
				dto.setEmail(rs.getString("email"));
				dto.setUserId(rs.getString("user_id"));
				dto.setProfileId(rs.getLong("profile_id"));
				dto.setCompletionReportId(rs.getLong("completion_report_id"));
				dto.setIsFinalSubmitted(rs.getBoolean("is_final_submitted"));
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

	private String getSql(String stFiscalYearId, String profileId, String proposalId, String isShortListed,
			String approvalStatus, String userId, PageableRequestBodyDTO pageableRequestBodyDTO) {

		return "with cte as (select proposal.id as id, proposal.uuid as uuid, proposal.training_name, proposal.institute_name, proposal.training_duration, proposal.program_date, proposal.fiscal_year_id,proposal.is_editable,proposal.is_short_listed,proposal.is_submitted,proposal.proposal_status, proposal.is_completion_report_submitted ,profile.id AS profile_id,profile.uuid as profile_uuid,profile.user_id ,profile.training_institute_name ,profile.head_of_institute_name ,profile.mobile_number ,profile.email , cr.id as completion_report_id , cr.is_final_submitted from m3_proposal proposal left join m3_training_institute_profile profile on proposal.m3_training_institute_profile_id = profile.id left join (select * from M3_COMPLETION_REPORT where is_deleted = false) cr on proposal.id=cr.m3_proposal_id where proposal.is_deleted = false and proposal.is_submitted = true "
				+ stFiscalYearId + profileId + proposalId + isShortListed + approvalStatus + userId + ") " + "SELECT * "
				+ "FROM  (TABLE cte " + "LIMIT " + pageableRequestBodyDTO.getSize() + " OFFSET "
				+ pageableRequestBodyDTO.getPage() + ") sub "
				+ "RIGHT  JOIN (SELECT count(*) FROM cte) c(total) ON true";
	}

	public Connection getOraConnection() {

		String driverClassName = env.getProperty("spring.datasource.driver-class-name");
		String url = env.getProperty("spring.datasource.url");
		String username = env.getProperty("spring.datasource.username");
		String password = env.getProperty("spring.datasource.password");

		try {
			Class.forName(env.getProperty("spring.datasource.driver-class-name"));

		} catch (ClassNotFoundException e) {
			System.out.println("Where is your Oracle JDBC Driver?");
		}

		Connection connection = null;

		try {
			connection = DriverManager.getConnection(env.getProperty("spring.datasource.url"),
					env.getProperty("spring.datasource.username"), env.getProperty("spring.datasource.password"));

		} catch (SQLException e) {
			System.out.println("Connection Failed! Check output console");
		}
		if (connection != null) {
			return connection;

		} else {
			System.out.println("Failed to make connection!");
			return null;
		}

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
	public Page<NominatedInstituteResponse> gridList(NominatedInstituteResponse request) {
		return test(request);
	}

}
