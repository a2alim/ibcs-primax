package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.common.utils.RandomGanaratorUtils;
import com.ibcs.idsdp.trainninginstitute.model.domain.*;
import com.ibcs.idsdp.trainninginstitute.model.repositories.*;
import com.ibcs.idsdp.trainninginstitute.services.AgreementService;
import com.ibcs.idsdp.trainninginstitute.services.RmsDashboardService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.AgreementInstallmentRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.AgreementRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.*;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RmsDashboardServiceImp implements RmsDashboardService {

    private final ParticipantRepository participantRepository;

    private final TrainingInstituteProfileRepository trainingInstituteProfileRepository;

    @Override
    public ResponseEntity<List<TrainingInstituteResponse>> getTrainingInstituteDataForDashboard() {
        List<TrainingInstituteResponse> trainingInstituteResponseList = new ArrayList<>();
        List<TrainingInstituteProfileModel> trainingInstituteProfileModelsList = trainingInstituteProfileRepository.findByIsDeleted(false);
        trainingInstituteProfileModelsList.forEach(res->{
            List<ParticipantModel> participantModelList = participantRepository.findAllByCreatedByAndIsDeleted(res.getUserId(),false);
            TrainingInstituteResponse trainingInstituteResponse = new TrainingInstituteResponse();
            trainingInstituteResponse.setInstituteName(res.getTrainingInstituteName());
            trainingInstituteResponse.setTotalPertinentCount(participantModelList.size());
            trainingInstituteResponse.setCourseCompletedPertinentCount(participantModelList.stream().filter(data-> data.getIsCompleted() == true).collect(Collectors.toList()).size());
            trainingInstituteResponseList.add(trainingInstituteResponse);
        });
        return new ResponseEntity(trainingInstituteResponseList, HttpStatus.OK);
    }
}
