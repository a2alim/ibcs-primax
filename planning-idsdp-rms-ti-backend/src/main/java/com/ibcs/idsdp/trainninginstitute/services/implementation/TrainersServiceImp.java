package com.ibcs.idsdp.trainninginstitute.services.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.exceptions.exception.ResourceNotFoundException;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.LoggedUsersService;
import com.ibcs.idsdp.trainninginstitute.model.domain.AcademicBackgroundModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.Trainer;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ProposalRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TrainersRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TrainingInstituteProfileRepository;
import com.ibcs.idsdp.trainninginstitute.services.TrainersService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.TrainerRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TrainersAcademicBackgroundList;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TrainersListView;
import com.ibcs.idsdp.util.Response;

/**
 * @author moniruzzaman.rony
 * @create 11/17/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Service
public class TrainersServiceImp extends BaseService<Trainer, TrainerRequest, TrainerRequest> implements TrainersService {

	private final TrainersRepository trainersRepository;
	private final TrainingInstituteProfileRepository trainingInstituteProfileRepository;
	private final LoggedUsersService loggedUsersService;
	private final ProposalRepository proposalRepository;
//  private final RandomGanaratorUtils randomGanaratorUtils;
//	private final MinioServerService minioServerService;

	protected TrainersServiceImp(ServiceRepository<Trainer> repository, TrainersRepository trainersRepository,
			TrainingInstituteProfileRepository trainingInstituteProfileRepository,
			LoggedUsersService loggedUsersService, ProposalRepository proposalRepository) {
		super(repository);
		this.trainersRepository = trainersRepository;
		this.trainingInstituteProfileRepository = trainingInstituteProfileRepository;
		this.loggedUsersService = loggedUsersService;
		this.proposalRepository = proposalRepository;
	}

	@Override
	protected Trainer convertForCreate(TrainerRequest dto) {
		Trainer entity = super.convertForCreate(dto);
		Optional<ProposalModel> optional = proposalRepository.findByIsDeletedAndId(false, dto.getProposalId());
		if (optional.isPresent()) {
			entity.setProposalModel(optional.get());
		}
		entity.setIsActive(true);
		entity.setIsEditable(true);
		entity.setIsSubmitted(true);
		return entity;
	}

	@Override
	protected void convertForUpdate(TrainerRequest dto, Trainer entity) {
		super.convertForUpdate(dto, entity);
		Optional<ProposalModel> optional = proposalRepository.findByIsDeletedAndId(false, dto.getProposalId());
		if (optional.isPresent()) {
			entity.setProposalModel(optional.get());
		}
	}

	@Override
	public ResponseEntity<Trainer> saveTrainer(TrainerRequest trainerRequest) {
		// String uuid = randomGanaratorUtils.getUuid();
		Trainer trainer = new Trainer();
		BeanUtils.copyProperties(trainerRequest, trainer);
		// trainer.setUuid(uuid);

		List<AcademicBackgroundModel> academicBackgroundModels = new ArrayList<>();
//        for (AcademicBackgroundModel academicBackgroundModel: trainerRequest.getAcademicBackgroundModelList()){
//            AcademicBackgroundModel abModel = new AcademicBackgroundModel();
//
//            BeanUtils.copyProperties(academicBackgroundModel, abModel);
//            academicBackgroundModels.add(abModel);
//        }

//        trainer.setAcademicBackgroundModelList(academicBackgroundModels);
//        trainer.setM3TrainingInstituteProfileId(trainingInstituteProfileRepository.findByUserId(loggedUsersService.getLoggedUserId()).get());
		trainersRepository.save(trainer);
		return new ResponseEntity<>(trainer, HttpStatus.CREATED);
	}

	@Override
	public ResponseEntity getTrainer(int offset, int pageSize, Long proposalId) {
		Sort sort = Sort.by(Sort.Direction.DESC, "id");
		Page<Trainer> trainersListPage = trainersRepository.findAllByIsDeletedAndProposalModel(false,PageRequest.of(offset, pageSize, sort), new ProposalModel() {{setId(proposalId);}} );
		List<Trainer> proposalModelList = trainersListPage.get().collect(Collectors.toList());
		Pageable pageable = PageRequest.of(offset, pageSize, sort);
		trainersListPage = new PageImpl<Trainer>(proposalModelList, pageable, proposalModelList.size());
		return new ResponseEntity(trainersListPage, HttpStatus.OK);
	}

	@Override
	public ResponseEntity getTrainerById(Long trainerId) {
		Optional<Trainer> trainersOptional = trainersRepository.findById(trainerId);

		if (!trainersOptional.isPresent()) {
			throw new ResourceNotFoundException("Trainer Not Found");
		}
		Trainer trainer = trainersOptional.get();
		return new ResponseEntity(trainer, HttpStatus.OK);
	}

	@Override
	public ResponseEntity updateTrainerById(Long trainerId, TrainerRequest trainerRequest) {
		Optional<Trainer> trainersOptional = trainersRepository.findById(trainerId);

		if (!trainersOptional.isPresent()) {
			throw new ResourceNotFoundException("Trainer Not Found");
		}
		Trainer trainer = trainersOptional.get();
		BeanUtils.copyProperties(trainerRequest, trainer);
		trainersRepository.save(trainer);
		return new ResponseEntity(trainer, HttpStatus.OK);
	}

	@Override
	public ResponseEntity deleteTrainerById(Long trainerId) {
		Optional<Trainer> trainersOptional = trainersRepository.findById(trainerId);

		if (!trainersOptional.isPresent()) {
			throw new ResourceNotFoundException("Trainer Not Found");
		}
		Trainer trainer = trainersOptional.get();
		trainer.setIsDeleted(true);
		trainersRepository.save(trainer);
		return new ResponseEntity(trainer, HttpStatus.OK);
	}

	@Override
	public TrainersListView getAllTrainersListBy(Long id) {

		List<TrainersAcademicBackgroundList> academicBackgroundLists = new ArrayList<>();

		Optional<Trainer> optionalTrainers = trainersRepository.findAllByIdAndIsDeleted(id, false);

		Trainer trainer = optionalTrainers.get();

//        trainer.getAcademicBackgroundModelList().forEach(trainersList->{
//
//            TrainersAcademicBackgroundList trainersView = new TrainersAcademicBackgroundList();
//
//            trainersView.setId(trainersList.getId());
//            trainersView.setSubject(trainersList.getSubject());
//            trainersView.setExaminationName(trainersList.getExaminationName());
//            trainersView.setResultId(trainersList.getResultId());
//            trainersView.setPassingYear(trainersList.getPassingYear());
//            trainersView.setInstituteName(trainersList.getInstituteName());
//            trainersView.setBoard(trainersList.getBoard());
//            trainersView.setCertificateImage(trainersList.getCertificateImage());
//
//            academicBackgroundLists.add(trainersView);
//        });

		return TrainersListView.builder().name(trainer.getName())
				.currentJobInstituteName(trainer.getCurrentJobInstituteName())
				.currentPosition(trainer.getCurrentPosition()).phone(trainer.getPhone()).email(trainer.getEmail())
				.gender(trainer.getGender())
				// .age(trainer.getAge())
				// .profileImage(trainer.getProfileImage())
				// .nidNumber(trainer.getNidNumber())
				// .nidImage(trainer.getNidImage())
				.trainersAcademicBackgroundList(academicBackgroundLists)
				// .address(trainer.getAddress())
				.lastAcademicDegree(trainer.getLastAcademicDegree()).build();
	}

	@Override
	public Response<TrainerRequest> findAllByProposalId(Long proposalId) {
		 List<Trainer> list = trainersRepository.findAllByIsDeletedAndProposalModel(false, new ProposalModel() {{setId(proposalId);}});
		 if(list !=null && !CollectionUtils.isEmpty(list)) {
			 return new Response<TrainerRequest>() {{
				 setItems(convertForRead(list));
				 setSuccess(true);
				 setMessage("Data found !.");
			 }};
		 }
		 
		return getErrorResponse("Data not found !.");
	}
}
