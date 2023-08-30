package com.ibcs.idsdp.trainninginstitute.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.trainninginstitute.model.domain.Trainer;
import com.ibcs.idsdp.trainninginstitute.services.TrainersService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.TrainerRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TrainersListView;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping("trainers")
public class TrainersController extends BaseController<Trainer, TrainerRequest, TrainerRequest>{

	private final TrainersService trainersService;
	
	public TrainersController(BaseService<Trainer, TrainerRequest, TrainerRequest> service, TrainersService trainersService) {
		super(service);	
		this.trainersService = trainersService;
	}	

	@PostMapping()
	public ResponseEntity<Trainer> saveTrainer(@RequestBody TrainerRequest trainerRequest) {
		return trainersService.saveTrainer(trainerRequest);
	}

	@GetMapping("/{offset}/{pageSize}/{proposalId}")
	public ResponseEntity getTrainer(@PathVariable("offset") int offset, @PathVariable("pageSize") int pageSize, @PathVariable("proposalId") Long proposalId) {
		return trainersService.getTrainer(offset, pageSize, proposalId);
	}
	
	@GetMapping("/find-by-proposalId/{proposalId}")
	public Response<TrainerRequest> findAllByProposalId(@PathVariable("proposalId") Long proposalId) {
		return trainersService.findAllByProposalId(proposalId);
	}

	@GetMapping("/{trainerId}")
	public ResponseEntity getTrainerById(@PathVariable Long trainerId) {
		return trainersService.getTrainerById(trainerId);
	}

	@PutMapping("/{trainerId}")
	public ResponseEntity updateTrainerById(@PathVariable Long trainerId, @RequestBody TrainerRequest trainerRequest) {
		return trainersService.updateTrainerById(trainerId, trainerRequest);
	}

	@DeleteMapping("/{trainerId}")
	public ResponseEntity deleteTrainerById(@PathVariable Long trainerId) {
		return trainersService.deleteTrainerById(trainerId);
	}

	@GetMapping("/trainers/view/{id}")
	public ResponseEntity<TrainersListView> getAllTrainersListBy(@PathVariable Long id){
		return new ResponseEntity(trainersService.getAllTrainersListBy(id), HttpStatus.OK);
	}
}
