package com.ibcs.idsdp.trainninginstitute.services.implementation;

import java.math.BigInteger;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.trainninginstitute.model.domain.CourseScheduleModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ParticipantModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.TiSpeakerEvaluation;
import com.ibcs.idsdp.trainninginstitute.model.domain.Trainer;
import com.ibcs.idsdp.trainninginstitute.model.repositories.CourseScheduleRepositoryNew;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ParticipantRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ProposalRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TiSpeakerEvaluationRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TrainersRepository;
import com.ibcs.idsdp.trainninginstitute.services.TiSpeakerEvaluationService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.TiSpeakerEvaluationRequestDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TiSelectAnswerResponseDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TiSpeakerEvaluationInfoResponseDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TiSpeakerEvaluationResponseDto;
import com.ibcs.idsdp.util.Response;

@Service
public class TiSpeakerEvaluationImpl extends BaseService<TiSpeakerEvaluation, TiSpeakerEvaluationRequestDto, TiSpeakerEvaluationResponseDto>	implements TiSpeakerEvaluationService {

	private static final int DEFAULT_PAGE_SIZE = 1000000;

	@Autowired
	private Environment env;
	
	@Autowired
	private EntityManagerFactory entityManagerFactory;

	private final TiSpeakerEvaluationRepository tiSpeakerEvaluationRepository;
	private final ProposalRepository proposalRepository;
	private final TrainersRepository trainersRepository;
	private final ParticipantRepository participantRepository;
	private final CourseScheduleRepositoryNew courseScheduleRepositoryNew;
	private final TiSelectAnswerImpl selectAnswerImpl;

	protected TiSpeakerEvaluationImpl(ServiceRepository<TiSpeakerEvaluation> repository,
			TiSpeakerEvaluationRepository tiSpeakerEvaluationRepository, ProposalRepository proposalRepository,
			TrainersRepository trainersRepository, ParticipantRepository participantRepository,
			CourseScheduleRepositoryNew courseScheduleRepositoryNew, TiSelectAnswerImpl selectAnswerImpl) {
		super(repository);
		this.tiSpeakerEvaluationRepository = tiSpeakerEvaluationRepository;
		this.proposalRepository = proposalRepository;
		this.trainersRepository = trainersRepository;
		this.participantRepository = participantRepository;
		this.courseScheduleRepositoryNew = courseScheduleRepositoryNew;
		this.selectAnswerImpl = selectAnswerImpl;
	}

	@Override
	protected TiSpeakerEvaluation convertForCreate(TiSpeakerEvaluationRequestDto dto) {
		TiSpeakerEvaluation entity = super.convertForCreate(dto);

		if (dto.getProposalId() != null) {
			Optional<ProposalModel> option1 = proposalRepository.findByIdAndIsDeleted(dto.getProposalId(), false);
			entity.setProposalId(option1.get());
		}
		if (dto.getTrainerId() != null) {
			Optional<Trainer> option2 = trainersRepository.findByIdAndIsDeleted(dto.getTrainerId(), false);
			entity.setTrainerId(option2.get());
		}

		if (dto.getParticipantId() != null) {
			Optional<ParticipantModel> option3 = participantRepository.findByIdAndIsDeleted(dto.getParticipantId(),
					false);
			entity.setParticipantId(option3.get());
		}

		if (dto.getSessionId() != null) {
			Optional<CourseScheduleModel> option4 = courseScheduleRepositoryNew.findByIdAndIsDeleted(dto.getSessionId(),
					false);
			entity.setSessionId(option4.get());
		}

		return entity;
	}

	@Override
	public Response<TiSpeakerEvaluationResponseDto> createEvaluation(TiSpeakerEvaluationRequestDto proposalRequest) {		
		
	   Boolean isExistResult = isExistsBeforeSave(proposalRequest.getParticipantId(), proposalRequest.getProposalId(), proposalRequest.getSessionId(),proposalRequest.getTrainerId());
	   if(isExistResult) {
		   return getErrorResponse("This evaluation already exist!.");  
	   }
		
		Response<TiSpeakerEvaluationResponseDto> response = create(proposalRequest);
		if (!response.isSuccess()) {
			return getErrorResponse("Save failed!.");
		}
		List<TiSelectAnswerResponseDto> list = new ArrayList<>();
		proposalRequest.getTiSelectAnswerRequestDto().forEach(e -> {
			e.setSpeakerEvaluationId(response.getObj().getId());
			if (e.getUuid() != null) {
				list.add(new ModelMapper().map(selectAnswerImpl.update(e).getObj(), TiSelectAnswerResponseDto.class));
			} else {
				list.add(new ModelMapper().map(selectAnswerImpl.create(e).getObj(), TiSelectAnswerResponseDto.class));
			}
		});
		response.getObj().setTiSelectAnswerResponseDto(list);
		return response;
	}
	
	
	public  Page<TiSpeakerEvaluationInfoResponseDto> test(TiSpeakerEvaluationInfoResponseDto request) {		
		
		
		Pageable pageable = getPageable(request.getPageableRequestBodyDTO());
		Long total = 0L;
		String SQL = getSql(request.getPageableRequestBodyDTO());

		Connection con = null;
		ResultSet rs = null;
		Statement stm = null;

		List<TiSpeakerEvaluationInfoResponseDto> list = new ArrayList<TiSpeakerEvaluationInfoResponseDto>();

		try {
			System.out.println("SQL === >>>> " + SQL);
			con = getOraConnection();
			stm = con.createStatement();
			rs = stm.executeQuery(SQL);

			while (rs.next()) {
				TiSpeakerEvaluationInfoResponseDto dto = new TiSpeakerEvaluationInfoResponseDto();			
				dto.setStCommonTypeId(rs.getLong("st_common_type_id"));
				
				dto.setProposalId(rs.getLong("m3_proposal_id"));				
				if(dto.getProposalId() !=null) {
					Optional<ProposalModel> option1 = proposalRepository.findByIdAndIsDeleted(dto.getProposalId(), false);	
					dto.setProposalModel(option1.get());
				}
				
				dto.setSessionId(rs.getLong("m3_session_id"));
				if(dto.getSessionId() !=null) {
					Optional<CourseScheduleModel> option2 = courseScheduleRepositoryNew.findByIdAndIsDeleted(dto.getSessionId(),false);	
					dto.setSession(option2.get());
				}	
				
				dto.setTrainerId(rs.getLong("m3_trainer_id"));
				if(dto.getTrainerId()!=null) {
					Optional<Trainer> option3 = trainersRepository.findByIdAndIsDeleted(dto.getTrainerId(), false);	
					dto.setTrainer(option3.get());
				}
				
				dto.setGood(rs.getLong("good"));
				dto.setVery_good(rs.getLong("very_good"));
				dto.setExcellent(rs.getLong("excellent"));				
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

	private String getSql(PageableRequestBodyDTO pageableRequestBodyDTO) {		
		return "with cte as ("+SQL()+") " + "SELECT * " + "FROM  (TABLE cte " + "LIMIT " + pageableRequestBodyDTO.getSize() + " OFFSET "
				+ pageableRequestBodyDTO.getPage() + ") sub "
				+ "RIGHT  JOIN (SELECT count(*) FROM cte) c(total) ON true";
	}

	@Override
	public Page<TiSpeakerEvaluationInfoResponseDto> gridList(TiSpeakerEvaluationInfoResponseDto reques) {
		// TODO Auto-generated method stub
		return test(reques);
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
	
	public static String  SQL() {		
		StringBuffer str = new StringBuffer();
		str.append(" select	");
		str.append(" select_ans.st_common_type_id, ");
		str.append(" speaker_evaluation.m3_proposal_id,	");
		str.append(" speaker_evaluation.m3_session_id,	");
		str.append(" speaker_evaluation.m3_trainer_id,	");
		str.append(" ( select count(*) from speaker_evaluation_view v where	v.st_common_type_id = select_ans.st_common_type_id	and  v.m3_proposal_id = speaker_evaluation.m3_proposal_id and v.m3_session_id = speaker_evaluation.m3_session_id and v.m3_trainer_id = speaker_evaluation.m3_trainer_id and  v.answer = 1) as good	, " );
		str.append(" ( select count(*) from speaker_evaluation_view v where v.st_common_type_id = select_ans.st_common_type_id and v.m3_proposal_id = speaker_evaluation.m3_proposal_id and v.m3_session_id = speaker_evaluation.m3_session_id and v.m3_trainer_id = speaker_evaluation.m3_trainer_id and v.answer = 2) as very_good , ");
		str.append(" ( select count(*) from speaker_evaluation_view v where v.st_common_type_id = select_ans.st_common_type_id and v.m3_proposal_id = speaker_evaluation.m3_proposal_id and v.m3_session_id = speaker_evaluation.m3_session_id and v.m3_trainer_id = speaker_evaluation.m3_trainer_id and v.answer = 3) as excellent " );
		str.append(" from ");
		str.append(" m3_ti_select_answer select_ans	");
		str.append(" left join m3_ti_speaker_evaluation speaker_evaluation on select_ans.m3_ti_speaker_evaluation_id = speaker_evaluation.id ");
		str.append(" group by speaker_evaluation.m3_proposal_id, select_ans.st_common_type_id, speaker_evaluation.m3_session_id,speaker_evaluation.m3_trainer_id");
		str.append(" order by m3_proposal_id , m3_trainer_id , m3_session_id ");
		return str.toString();
	}
	
	
public Boolean isExistsBeforeSave(Long participantId, Long proposalId, Long sessionId, Long trainerId) {
		
		String query = "SELECT COUNT(*) FROM m3_ti_speaker_evaluation WHERE m3_participant_id='"+participantId+"' AND m3_proposal_id ='"+proposalId+"' AND m3_session_id='"+sessionId+"' AND m3_trainer_id='"+trainerId+"' AND is_deleted=false";
		EntityManager entityManager = entityManagerFactory.createEntityManager();		
		Query nativeQuery = entityManager.createNativeQuery(query);		
		BigInteger result = (BigInteger) nativeQuery.getSingleResult();	
		
		if(result!=null && result==BigInteger.ZERO) {
			return false;
		}	
		
		System.out.println("result ==== > "+result);
		return true;
	}

}
