package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.common.exceptions.exception.ResourceNotFoundException;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.LoggedUsersService;
import com.ibcs.idsdp.common.utils.RandomGanaratorUtils;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.trainninginstitute.client.RmsConfigurationClientService;
import com.ibcs.idsdp.trainninginstitute.client.UaaClientService;
import com.ibcs.idsdp.trainninginstitute.enums.ProposalStatus;
import com.ibcs.idsdp.trainninginstitute.model.domain.*;
import com.ibcs.idsdp.trainninginstitute.model.repositories.*;
import com.ibcs.idsdp.trainninginstitute.services.ProposalService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.PagableRequestDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ProposalRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.*;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProposalServiceImpl extends BaseService<ProposalModel, ProposalRequest, ProposalRequest>
		implements ProposalService {

	private final ProposalRepository proposalRepository;
	private final TrainingBudgetRepository budgetRepository;
	private final TrainersRepository trainersRepository;
	private final CourseRepository courseRepository;
	private final CourseScheduleRepository courseScheduleRepository;
	private final CourseScheduleRepositoryNew courseScheduleRepositoryNew;
	private final UaaClientService uaaClientService;
	private final TrainingInstituteProfileRepository trainingInstituteProfileRepository;
	@Autowired
	private LoggedUsersService loggedUsersService;
	private final ParticipantRepository participantRepository;

	private final RmsConfigurationClientService rmsConfigurationClientService;

	private static final int DEFAULT_PAGE_SIZE = 1000000;

	protected ProposalServiceImpl(ServiceRepository<ProposalModel> repository, ProposalRepository proposalRepository,
			TrainingBudgetRepository budgetRepository, TrainersRepository trainersRepository,
			CourseRepository courseRepository, UaaClientService uaaClientService,
			TrainingInstituteProfileRepository trainingInstituteProfileRepository,
			 ParticipantRepository participantRepository,
			CourseScheduleRepository courseScheduleRepository,
			CourseScheduleRepositoryNew courseScheduleRepositoryNew,
		  	RmsConfigurationClientService rmsConfigurationClientService
								  ) {
		super(repository);
		this.proposalRepository = proposalRepository;
		this.budgetRepository = budgetRepository;
		this.trainersRepository = trainersRepository;
		this.courseRepository = courseRepository;
		this.courseScheduleRepository = courseScheduleRepository;
		this.uaaClientService = uaaClientService;
		this.trainingInstituteProfileRepository = trainingInstituteProfileRepository;
		this.participantRepository = participantRepository;
		this.courseScheduleRepositoryNew = courseScheduleRepositoryNew;
		this.rmsConfigurationClientService = rmsConfigurationClientService;

	}

	@Override
	protected ProposalModel convertForCreate(ProposalRequest dro) {
		ProposalModel entity = super.convertForCreate(dro);
		Optional<TrainingInstituteProfileModel> optional = trainingInstituteProfileRepository
				.findByUserId(loggedUsersService.getLoggedUserId());
		entity.setIsEditable(true);
		entity.setTrainingInstituteProfileModel(optional.get());
		entity.setIsShortListed(false);
		entity.setProposalStatus(0);
		entity.setIsSubmitted(false);
		return entity;
	}

	@Override
	protected void convertForUpdate(ProposalRequest dto, ProposalModel entity) {
		Optional<TrainingInstituteProfileModel> optional = trainingInstituteProfileRepository
				.findByUserId(loggedUsersService.getLoggedUserId());
		entity.setTrainingInstituteProfileModel(optional.get());
		super.convertForUpdate(dto, entity);
	}

	@Override
	public Response<ProposalRequest> createProposal(ProposalRequest proposalRequest) {

		Optional<TrainingInstituteProfileModel> trainingInstituteProfileModelOptional = trainingInstituteProfileRepository
				.findByUserId(loggedUsersService.getLoggedUserId());

		if (trainingInstituteProfileModelOptional.isEmpty()) {
			return getErrorResponse("No Training Institute Found");
		}

		TrainingInstituteProfileModel trainingInstituteProfileModel = trainingInstituteProfileModelOptional.get();

		boolean isOneExists = proposalRepository.existsByIsDeletedAndFiscalYearIdAndTrainingInstituteProfileModel_Id(
				false, proposalRequest.getFiscalYearId(), trainingInstituteProfileModel.getId());

		if (isOneExists) {
			return getErrorResponse("You Can't Add more than one proposal in same fiscal year");
		}

		return create(proposalRequest);
	}

	@Override
	public Response<ProposalRequest> editProposal(ProposalRequest proposalRequest) {
		return update(proposalRequest);
	}

	@Override
	public ResponseEntity<PaginationResponse<List<ProposalResponse>>> getProposalList(int pageNo, int pageSize,String proposalTitle) {
		loggedUsersService.getLoggedUserType();
		Sort sort = Sort.by(Sort.Direction.DESC, "id");
		Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
		Page<ProposalResponse> proposalResponsePage = null;
		Page<ProposalModel> proposalModelPage = proposalRepository.findAllByIsDeleted(false, pageable);

		// Show Rms_Training_Institute user's proposal
		if (loggedUsersService.getLoggedUserType().equals("Rms_Training_Institute")) {
			List<ProposalModel> proposalModelList = proposalModelPage.get()
					.filter(pm -> (pm.getTrainingInstituteProfileModel().getUserId()
							.equals(loggedUsersService.getLoggedUserId())
							&& pm.getTrainingInstituteProfileModel().getUserType().equals("Rms_Training_Institute")))
					.collect(Collectors.toList());

			List<ProposalResponse> proposalResponseList = new ArrayList<>();
			proposalModelList.forEach(proposal -> {
				ProposalResponse proposalResponse = new ProposalResponse();
				ProposalModel proposalModel = proposal;
				BeanUtils.copyProperties(proposalModel, proposalResponse);
				Optional<CourseModel> courseModel = courseRepository.findByIsDeletedAndProposalModel_Id(false,
						proposalModel.getId());
				if (courseModel.isPresent()) {
					proposalResponse.setCourseScheduleId(courseModel.get().getId());
				}
				proposalResponseList.add(proposalResponse);
			});
			proposalResponsePage = new PageImpl<ProposalResponse>(proposalResponseList, pageable,
					proposalResponseList.size());
		} else {
			List<ProposalModel> proposalModelList = proposalModelPage.getContent();

			List<ProposalResponse> proposalResponseList = new ArrayList<>();
			proposalModelList.forEach(proposal -> {
				ProposalResponse proposalResponse = new ProposalResponse();
				ProposalModel proposalModel = proposal;
				BeanUtils.copyProperties(proposalModel, proposalResponse);
				Optional<CourseModel> courseModel = courseRepository.findByIsDeletedAndProposalModel_Id(false,
						proposalModel.getId());
				if (courseModel.isPresent()) {
					proposalResponse.setCourseScheduleId(courseModel.get().getId());
				}
				proposalResponseList.add(proposalResponse);
			});
			proposalResponsePage = new PageImpl<ProposalResponse>(proposalResponseList, pageable,
					proposalResponseList.size());
		}

		PaginationResponse<List<ProposalResponse>> paginationResponse = new PaginationResponse<>(pageSize, pageNo,
				proposalResponsePage.getContent().size(), proposalResponsePage.isLast(),
				proposalResponsePage.getTotalElements(), proposalResponsePage.getTotalPages(),
				proposalResponsePage.getContent());

		if (proposalModelPage.isEmpty())
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Proposal Found");
		else
			return new ResponseEntity<>(paginationResponse, HttpStatus.OK);

	}

	@Override
	public ResponseEntity<ApiMessageResponse> deleteProposal(Long proposalId) {
		Optional<ProposalModel> proposalModelOptional = proposalRepository.findByIsDeletedAndId(false, proposalId);
		if (proposalModelOptional.isPresent()) {
			ProposalModel proposalModel = proposalModelOptional.get();

			proposalModel.setIsDeleted(true);

			proposalRepository.save(proposalModel);

			Optional<List<Trainer>> allByFiscalYearIdOp = trainersRepository
					.findAllByFiscalYearId(proposalModel.getFiscalYearId());
			allByFiscalYearIdOp.get().forEach(res -> {
				res.setIsDeleted(true);
				trainersRepository.save(res);
			});

			List<TrainingBudgetModel> trainingBudgetModelOp = budgetRepository
					.findAllByFiscalYearId(proposalModel.getFiscalYearId());
			trainingBudgetModelOp.forEach(res -> {
				res.setIsDeleted(true);
				budgetRepository.save(res);
			});

			List<CourseModel> courseRepositoryOp = courseRepository
					.findAllByFiscalYearId(proposalModel.getFiscalYearId());
			courseRepositoryOp.forEach(res -> {
				res.setIsDeleted(true);
				courseRepository.save(res);
			});
			return new ResponseEntity<>(new ApiMessageResponse(200, "Proposal Deleted"), HttpStatus.OK);
		} else {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Proposal Found");
		}
	}

	@Override
	public ResponseEntity<ProposalResponse> getSingleProposal(Long proposalId) {
		Optional<ProposalModel> proposalModelOptional = proposalRepository.findByIsDeletedAndId(false, proposalId);
		ProposalResponse proposalResponse = new ProposalResponse();
		if (proposalModelOptional.isPresent()) {
			ProposalModel proposalModel = proposalModelOptional.get();
			BeanUtils.copyProperties(proposalModel, proposalResponse);
			Optional<CourseModel> courseModel = courseRepository.findByIsDeletedAndProposalModel_Id(false,proposalModel.getId());
			if (courseModel.isPresent()) {
				proposalResponse.setCourseScheduleId(courseModel.get().getId());
			}
			return new ResponseEntity<>(proposalResponse, HttpStatus.OK);
		} else {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Proposal Found");
		}
	}

	/*
	 * @Override public ProposalListView getAllProposalByUuid(String uuid) {
	 * 
	 * List<CourseScheduleListView> courseScheduleListViewList = new ArrayList<>();
	 * List<ResearchBudgetListView> researchBudgetListViews = new ArrayList<>();
	 * List<TrainersListView> trainersListViewArrayList = new ArrayList<>();
	 * 
	 * Optional<ProposalModel> optionalProposalModel =
	 * proposalRepository.findAllByUuid(uuid);
	 * 
	 * ProposalModel proposalModel = optionalProposalModel.get();
	 * 
	 * List<TrainingBudgetModel> listDataForBudget =
	 * budgetRepository.findAllByProposalModel_IdAndIsDeleted(proposalModel.getId(),
	 * false);
	 * 
	 * List<CourseModel> courseModelList =
	 * courseRepository.findAllByFiscalYearIdAndIsDeleted(proposalModel.
	 * getFiscalYearId(), false);
	 * 
	 * Optional<List<Trainer>> allByFiscalYearTrainersIdOptional =
	 * trainersRepository.findAllByFiscalYearIdAndIsDeleted(proposalModel.
	 * getFiscalYearId(), false);
	 * 
	 * 
	 * allByFiscalYearTrainersIdOptional.get().forEach(result -> { TrainersListView
	 * trainersListView = new TrainersListView();
	 * trainersListView.setName(result.getName());
	 * trainersListView.setAddress(result.getAddress());
	 * trainersListView.setCurrentJobInstituteName(result.getCurrentJobInstituteName
	 * ()); trainersListView.setCurrentPosition(result.getCurrentPosition());
	 * trainersListView.setPhone(result.getPhone());
	 * trainersListView.setEmail(result.getEmail());
	 * trainersListView.setGender(result.getGender());
	 * trainersListView.setAge(result.getAge());
	 * trainersListView.setNidNumber(result.getNidNumber());
	 * 
	 * List<TrainersAcademicBackgroundList> trainersAcademicBackgroundLists = new
	 * ArrayList<>();
	 * 
	 * for (AcademicBackgroundModel objAcademiBeg :
	 * result.getAcademicBackgroundModelList()) {
	 * 
	 * TrainersAcademicBackgroundList trainersAcademicBackgroundList = new
	 * TrainersAcademicBackgroundList();
	 * 
	 * trainersAcademicBackgroundList.setId(objAcademiBeg.getId());
	 * trainersAcademicBackgroundList.setSubject(objAcademiBeg.getSubject());
	 * trainersAcademicBackgroundList.setExaminationName(objAcademiBeg.
	 * getExaminationName());
	 * trainersAcademicBackgroundList.setResultId(objAcademiBeg.getResultId());
	 * trainersAcademicBackgroundList.setPassingYear(objAcademiBeg.getPassingYear())
	 * ; trainersAcademicBackgroundList.setInstituteName(objAcademiBeg.
	 * getInstituteName());
	 * trainersAcademicBackgroundList.setBoard(objAcademiBeg.getBoard());
	 * trainersAcademicBackgroundLists.add(trainersAcademicBackgroundList);
	 * 
	 * } trainersListView.setTrainersAcademicBackgroundList(
	 * trainersAcademicBackgroundLists);
	 * trainersListViewArrayList.add(trainersListView);
	 * 
	 * });
	 * 
	 * listDataForBudget.forEach(budgetData -> { ResearchBudgetListView
	 * researchBudgetListView = new ResearchBudgetListView();
	 * researchBudgetListView.setExpenditureAmount(budgetData.getExpenditureAmount()
	 * ); researchBudgetListView.setItemOfExpenditureId(budgetData.
	 * getItemOfExpenditureId());
	 * researchBudgetListViews.add(researchBudgetListView); });
	 * 
	 * courseModelList.forEach(courseId -> {
	 * courseId.getCourseScheduleModels().forEach(courseScheduleId -> {
	 * 
	 * List<CourseScheduleSpeaker> courseScheduleSpeakerList = new ArrayList<>();
	 * CourseScheduleListView courseScheduleListView = new CourseScheduleListView();
	 * 
	 * Optional<CourseScheduleModel> courseScheduleModelOptional =
	 * courseScheduleRepository.findAllById(courseScheduleId.getId());
	 * 
	 * CourseScheduleModel courseScheduleModel = courseScheduleModelOptional.get();
	 * courseScheduleListView.setSession(courseScheduleModel.getSession());
	 * courseScheduleListView.setTopic(courseScheduleModel.getTopic());
	 * courseScheduleListView.setTime(courseScheduleModel.getTime());
	 * courseScheduleListView.setDate(courseScheduleModel.getDate());
	 * courseScheduleListView.setDay(courseScheduleModel.getDay());
	 * 
	 * for (Trainer trainer : courseScheduleModel.getSpeakers()) {
	 * 
	 * // Optional<Trainers> trainersOptional = trainersRepository.findById(id);
	 * 
	 * courseScheduleSpeakerList.add(new CourseScheduleSpeaker(trainer.getName()));
	 * }
	 * 
	 * 
	 * courseScheduleListView.setCourseScheduleSpeakerList(courseScheduleSpeakerList
	 * );
	 * 
	 * courseScheduleListViewList.add(courseScheduleListView); });
	 * 
	 * 
	 * });
	 * 
	 * Set<TrainersListView> trainersListViewSet = new HashSet<>();
	 * courseModelList.forEach(course -> {
	 * course.getCourseScheduleModels().forEach(courseSchedule -> {
	 * courseSchedule.getSpeakers().forEach( trainer -> { TrainersListView tlv = new
	 * TrainersListView(); BeanUtils.copyProperties(trainer, tlv);
	 * 
	 * trainersListViewSet.add(tlv); } ); }); });
	 * 
	 * return ProposalListView.builder()
	 * .trainingName(proposalModel.getTrainingName())
	 * .instituteName(proposalModel.getInstituteName())
	 * .instituteType(proposalModel.getInstituteType())
	 * .instituteHead(proposalModel.getInstituteHead())
	 * .previousExperience(proposalModel.getPreviousExperience())
	 * .courseNo(proposalModel.getCourseNo())
	 * .programDate(proposalModel.getProgramDate())
	 * .typeOfCourse(proposalModel.getTypeOfCourse())
	 * .noOfTrainer(proposalModel.getNoOfTrainer())
	 * .noOfTrainee(proposalModel.getNoOfTrainee())
	 * .isSubmitted(proposalModel.getIsSubmitted())
	 * .principalAndStrategies(proposalModel.getPrincipalAndStrategies())
	 * .courseObjective(proposalModel.getCourseObjective())
	 * .trainingMethods(proposalModel.getTrainingMethods())
	 * .infrastructuralFacility(proposalModel.getInfrastructuralFacility())
	 * .anyCourseFeeFromTrainee(proposalModel.getAnyCourseFeeFromTrainee())
	 * .otherRelevantInfo(proposalModel.getOtherRelevantInfo())
	 * .fiscalYearId(proposalModel.getFiscalYearId())
	 * .trainersListData(trainersListViewArrayList) //
	 * .trainersListData(List.copyOf(trainersListViewSet))
	 * .courseListData(courseScheduleListViewList)
	 * .researchBudgetListViewList(researchBudgetListViews) .build(); }
	 */

	@Override
	public ProposalListView getAllProposalByUuid(String uuid) {

		List<CourseScheduleListView> courseScheduleListViewList = new ArrayList<>();
		List<ResearchBudgetListView> researchBudgetListViews = new ArrayList<>();
		List<TrainersListView> trainersListViewArrayList = new ArrayList<>();
		List<Trainer> trainersList = new ArrayList<>();
		List<CourseScheduleModel> courseScheduleList = new ArrayList<>();

		Optional<ProposalModel> optionalProposalModel = proposalRepository.findAllByUuid(uuid);
		ProposalModel proposalModel = optionalProposalModel.get();

		//rmsConfigurationClientService.getByFiscalYearId(proposalModel.getFiscalYearId());

		CourseModel courseModel = courseRepository.findByIsDeletedAndProposalModel_Id(false, proposalModel.getId())
				.orElse(null);
		trainersList = trainersRepository.findAllByIsDeletedAndProposalModel(false, proposalModel);
		courseScheduleList = courseScheduleRepositoryNew.findAllByIsDeletedAndProposalModel(false, proposalModel);

		List<TrainingBudgetModel> trainingBudgetModels = budgetRepository
				.findAllByProposalModel_IdAndIsDeleted(proposalModel.getId(), false);
		trainingBudgetModels.forEach(trainingBudgetModel -> {
			ResearchBudgetListView researchBudgetListView = new ResearchBudgetListView();
			BeanUtils.copyProperties(trainingBudgetModel, researchBudgetListView);
			researchBudgetListViews.add(researchBudgetListView);
		});

		return ProposalListView.builder().trainingName(proposalModel.getTrainingName())
				.fiscalYear(rmsConfigurationClientService.getByFiscalYearId(proposalModel.getFiscalYearId()).getObj().getFiscalYear())
				.instituteName(proposalModel.getInstituteName()).instituteType(proposalModel.getInstituteType())
				.instituteHead(proposalModel.getInstituteHead())
				.previousExperience(proposalModel.getPreviousExperience()).courseNo(proposalModel.getCourseNo())
				.programDate(proposalModel.getProgramDate()).typeOfCourse(proposalModel.getTypeOfCourse())
				.noOfTrainer(proposalModel.getNoOfTrainer()).noOfTrainee(proposalModel.getNoOfTrainee())
				.isSubmitted(proposalModel.getIsSubmitted())
				.principalAndStrategies(proposalModel.getPrincipalAndStrategies())
				.courseObjective(proposalModel.getCourseObjective()).trainingMethods(proposalModel.getTrainingMethods())
				.infrastructuralFacility(proposalModel.getInfrastructuralFacility())
				.anyCourseFeeFromTrainee(proposalModel.getAnyCourseFeeFromTrainee())
				.otherRelevantInfo(proposalModel.getOtherRelevantInfo()).fiscalYearId(proposalModel.getFiscalYearId())
//				.trainersListData(List.copyOf(trainersListViewSet)).courseListData(courseScheduleListViewList)
				.researchBudgetListViewList(researchBudgetListViews).trainersList(trainersList)
				.courseScheduleList(courseScheduleList).trainingDuration(proposalModel.getTrainingDuration()).build();
	}

	public ProposalListView getAllPrrroposalByUuid(String uuid) {

		List<TrainersListView> trainersListViewArrayList = new ArrayList<>();
		List<CourseScheduleListView> courseScheduleListViewList = new ArrayList<>();
		List<ResearchBudgetListView> researchBudgetListViews = new ArrayList<>();

		Optional<ProposalModel> optionalProposalModel = proposalRepository.findAllByUuid(uuid);
		ProposalModel proposalModel = optionalProposalModel.get();
		CourseModel courseModel = courseRepository.findByIsDeletedAndProposalModel_Id(false, proposalModel.getId())
				.orElse(null);

		Set<TrainersListView> trainersListViewSet = new HashSet<>();
		if (courseModel != null) {
			courseModel.getCourseScheduleModels().forEach(courseSchedule -> {
				courseSchedule.getSpeakers().forEach(trainer -> {
					TrainersListView tlv = new TrainersListView();
					BeanUtils.copyProperties(trainer, tlv);

					List<TrainersAcademicBackgroundList> trainersAcademicBackgroundLists = new ArrayList<>();
//					trainer.getAcademicBackgroundModelList().forEach(academicBackgroundModel -> {
//						TrainersAcademicBackgroundList trainersAcademicBackgroundList = new TrainersAcademicBackgroundList();
//						BeanUtils.copyProperties(academicBackgroundModel, trainersAcademicBackgroundList);
//						trainersAcademicBackgroundLists.add(trainersAcademicBackgroundList);
//					});

					tlv.setTrainersAcademicBackgroundList(trainersAcademicBackgroundLists);
					trainersListViewSet.add(tlv);
				});
				CourseScheduleListView courseScheduleListView = new CourseScheduleListView();
				BeanUtils.copyProperties(courseSchedule, courseScheduleListView);

				List<CourseScheduleSpeaker> courseScheduleSpeakerList = new ArrayList<>();
				courseSchedule.getSpeakers().forEach(courseScheduleSpeaker -> {
					courseScheduleSpeakerList.add(new CourseScheduleSpeaker(courseScheduleSpeaker.getName()));

				});
				courseScheduleListView.setCourseScheduleSpeakerList(courseScheduleSpeakerList);

				courseScheduleListViewList.add(courseScheduleListView);
			});
		}

		List<TrainingBudgetModel> trainingBudgetModels = budgetRepository
				.findAllByProposalModel_IdAndIsDeleted(proposalModel.getId(), false);
		trainingBudgetModels.forEach(trainingBudgetModel -> {
			ResearchBudgetListView researchBudgetListView = new ResearchBudgetListView();
			BeanUtils.copyProperties(trainingBudgetModel, researchBudgetListView);

			researchBudgetListViews.add(researchBudgetListView);
		});

		return ProposalListView.builder().trainingName(proposalModel.getTrainingName())
				.instituteName(proposalModel.getInstituteName()).instituteType(proposalModel.getInstituteType())
				.instituteHead(proposalModel.getInstituteHead())
				.previousExperience(proposalModel.getPreviousExperience()).courseNo(proposalModel.getCourseNo())
				.programDate(proposalModel.getProgramDate()).typeOfCourse(proposalModel.getTypeOfCourse())
				.noOfTrainer(proposalModel.getNoOfTrainer()).noOfTrainee(proposalModel.getNoOfTrainee())
				.isSubmitted(proposalModel.getIsSubmitted())
				.principalAndStrategies(proposalModel.getPrincipalAndStrategies())
				.courseObjective(proposalModel.getCourseObjective()).trainingMethods(proposalModel.getTrainingMethods())
				.infrastructuralFacility(proposalModel.getInfrastructuralFacility())
				.anyCourseFeeFromTrainee(proposalModel.getAnyCourseFeeFromTrainee())
				.otherRelevantInfo(proposalModel.getOtherRelevantInfo()).fiscalYearId(proposalModel.getFiscalYearId())
				.trainersListData(List.copyOf(trainersListViewSet)).courseListData(courseScheduleListViewList)
				.researchBudgetListViewList(researchBudgetListViews)
				.trainingDuration(proposalModel.getTrainingDuration()).build();
	}

	@Override
	public ResponseEntity<ProposalModel> submitProposal(Long proposalId) {

		Optional<ProposalModel> proposalModelOptional = proposalRepository.findById(proposalId);

		if (proposalModelOptional.isEmpty()) {
			throw new ResourceNotFoundException("Proposal Not Found");
		}
		ProposalModel proposalModel = proposalModelOptional.get();

//        Optional<List<Trainer>> allByFiscalYearTrainersIdOptional = trainersRepository.findAllByFiscalYearId(proposalModel.getFiscalYearId());
//        List<TrainingBudgetModel> fiscalYearBudgetIdOptional = budgetRepository.findAllByFiscalYearId(proposalModel.getFiscalYearId());
//        List<CourseModel> fiscalYearIdInCourseOptional = courseRepository.findAllByFiscalYearId(proposalModel.getFiscalYearId());
//        Optional<List<Trainer>> allByFiscalYearTrainersIdOptional = trainersRepository.findAllByFiscalYearId(proposalModel.getFiscalYearId());

		// List<TrainingBudgetModel> fiscalYearBudgetIdOptional =
		// budgetRepository.findAllByProposalModel_IdAndIsDeleted(proposalModel.getId(),
		// false);
		Optional<CourseModel> fiscalYearIdInCourseOptional = courseRepository.findByIsDeletedAndProposalModel_Id(false,
				proposalModel.getId());

		proposalModel.setIsSubmitted(true);
		proposalRepository.save(proposalModel);

//        allByFiscalYearTrainersIdOptional.get().forEach(result -> {
//            result.setSubmitted(true);
//            trainersRepository.save(result);
//        });

//		fiscalYearBudgetIdOptional.forEach(result -> {
//			result.setSubmitted(true);
//			budgetRepository.save(result);
//		});

//        fiscalYearIdInCourseOptional.forEach(result -> {
//            result.setSubmitted(true);
//            courseRepository.save(result);
//        });
//		CourseModel courseModel = fiscalYearIdInCourseOptional.orElse(new CourseModel());
//		courseModel.setSubmitted(true);
//		courseRepository.save(courseModel);

//		courseModel.getCourseScheduleModels().forEach(result -> {
//			result.getSpeakers().forEach(speaker -> {
//			speaker.setSubmitted(true);
//				trainersRepository.save(speaker);
//			});
//		});

		return new ResponseEntity<>(proposalModel, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<ProposalResponse>> getAllProposalList() {
		List<ProposalModel> proposalModelList = proposalRepository.findAllByIsDeleted(false);
		List<ProposalResponse> proposalResponseList = new ArrayList<>();
		proposalModelList.forEach(proposal -> {
			ProposalResponse proposalResponse = new ProposalResponse();
			ProposalModel proposalModel = proposal;
			BeanUtils.copyProperties(proposalModel, proposalResponse);
			CourseModel courseModel = courseRepository.findByIsDeletedAndProposalModel_Id(false, proposalModel.getId())
					.orElse(null);
			proposalResponse.setCourseScheduleId(courseModel.getId());
			proposalResponseList.add(proposalResponse);
		});
		return new ResponseEntity(proposalResponseList, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<ProposalModel>> getAllProposalByParticipant(Long participantId) {
		ParticipantModel participantModel = participantRepository.findByIdAndIsDeleted(participantId, false)
				.orElseThrow(() -> new ResourceNotFoundException("Participant not found"));

		List<ProposalModel> proposalModels = new ArrayList<>();
		proposalModels.add(participantModel.getProposalModel());

		return new ResponseEntity<>(proposalModels, HttpStatus.OK);
	}

	@Override
	public Response<ProposalRequest> findByFiscalYearId(ProposalRequest proposalRequest) {	
		
		List<ProposalModel> list = new ArrayList<ProposalModel>();
		
		if(proposalRequest.getFiscalYearId()!=null) {			
			list =  proposalRepository.findAllByIsDeletedAndFiscalYearIdAndIsSubmitted(false, proposalRequest.getFiscalYearId(),true);			
		}else {
			list =  proposalRepository.findAllByIsDeletedAndIsSubmitted(false,true);
		}
		
		if(list !=null && !CollectionUtils.isEmpty(list)) {			
			Response<ProposalRequest> response=  new Response<ProposalRequest>();
			response.setSuccess(true);
			response.setMessage("Data found !.");
			response.setItems(convertForRead(list));
			
			return response;
					
		}
		
		return getErrorResponse("Data not found !.");
	}

	public ResponseEntity<List<ProposalListResponse>> getAllProposalByInstProfileId(Long id) {

		List<ProposalModel> proposalModelList = proposalRepository.findAllByTrainingInstituteProfileModel_IdAndIsDeletedAndIsSubmitted(id, false, true);
		List<ProposalListResponse> proposalResponseListList = new ArrayList<>();

		if(proposalModelList.isEmpty()){
			return new ResponseEntity("", HttpStatus.OK);
		}
		else {
			proposalModelList.forEach(proposal -> {
				ProposalListResponse proposalListResponse = new ProposalListResponse();
				ProposalModel proposalModel = proposal;
				BeanUtils.copyProperties(proposalModel, proposalListResponse);
				proposalResponseListList.add(proposalListResponse);
			});
			return new ResponseEntity(proposalResponseListList, HttpStatus.OK);
		}

	}

	public Response<ProposalResponse> getProposalList(PagableRequestDto requestDto){
		Page<ProposalModel> ePage = null;
		Response<ProposalResponse> response = new Response();
		//String loggedUserId = null;

		Pageable pageable = this.getPageable(requestDto.getPageableRequestBodyDTO());
		if (loggedUsersService.getLoggedUserType().equals("Rms_DO")) {
			ePage = proposalRepository.findAllByIsSubmittedAndIsDeletedOrderByIdDesc(true, false, getPageable(requestDto.getPageableRequestBodyDTO()));
		}
		if (loggedUsersService.getLoggedUserType().equals("Rms_Training_Institute")) {
			String loggedUserId = loggedUsersService.getLoggedUserId();
			ePage = proposalRepository.findAllByCreatedByAndIsDeletedOrderByIdDesc(loggedUserId, false, getPageable(requestDto.getPageableRequestBodyDTO()));
		}

		if(!CollectionUtils.isEmpty(ePage.getContent())){
			response.setPage(new PageImpl<>(ePage.getContent(), pageable, ePage.getTotalElements()));
			return getSuccessResponse("Data found ", response);
		}
		return getErrorResponse("Data not found !.");
	}


}
