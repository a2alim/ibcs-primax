package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.trainninginstitute.model.domain.Trainer;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.TrainerRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TrainersListView;
import com.ibcs.idsdp.util.Response;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * @author moniruzzaman.rony
 * @create 11/17/21
 * @github `https://github.com/moniruzzamanrony`
 */
public interface TrainersService {

    ResponseEntity<Trainer> saveTrainer(TrainerRequest trainerRequest);

    ResponseEntity getTrainer(int offset, int pageSize, Long proposalId);
    
    Response<TrainerRequest> findAllByProposalId(Long proposalId);

    ResponseEntity getTrainerById(Long trainerId);

    ResponseEntity updateTrainerById(Long trainerId, TrainerRequest trainerRequest);

    ResponseEntity deleteTrainerById(Long trainerId);

    TrainersListView getAllTrainersListBy(Long id);
}
