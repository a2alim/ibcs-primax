package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.trainninginstitute.model.domain.ProgressVerificationModel;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ProgressVerificationRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ProposalRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TrainingInstituteProfileRepository;
import com.ibcs.idsdp.trainninginstitute.services.ProgressVerificationService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ProgressVerificationRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
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

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProgressVerificationServiceImpl implements ProgressVerificationService {
    private final ProgressVerificationRepository progressVerificationRepository;
    private final TrainingInstituteProfileRepository trainingInstituteProfileRepository;
    private final ProposalRepository proposalRepository;

    @Override
    public ResponseEntity<ApiMessageResponse> createProgressVerification(ProgressVerificationRequest progressVerificationRequest) {
        ProgressVerificationModel progressVerificationModel = new ProgressVerificationModel();

        progressVerificationRequestToModel(progressVerificationRequest, progressVerificationModel);

        return new ResponseEntity<>(new ApiMessageResponse(201, "Progress Verification Created Successfully"), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<PaginationResponse<List<ProgressVerificationModel>>> getProgressVerification(int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ProgressVerificationModel> progressVerificationModelPage = progressVerificationRepository.findAllByIsDeleted(false, pageable);

        PaginationResponse<List<ProgressVerificationModel>> paginationResponse = new PaginationResponse<>(
                size, page, progressVerificationModelPage.getContent().size(), progressVerificationModelPage.isLast(),
                progressVerificationModelPage.getTotalElements(), progressVerificationModelPage.getTotalPages(), progressVerificationModelPage.getContent()
        );

        if (progressVerificationModelPage.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Progress Verification Found");
        } else {
            return new ResponseEntity<>(paginationResponse, HttpStatus.OK);
        }
    }

    @Override
    public ResponseEntity<ApiMessageResponse> editProgressVerification(Long progressVerificationId, ProgressVerificationRequest progressVerificationRequest) {
        Optional<ProgressVerificationModel> progressVerificationModelOptional = progressVerificationRepository.findByIdAndIsDeleted(progressVerificationId, false);
        if (progressVerificationModelOptional.isPresent()) {
            ProgressVerificationModel progressVerificationModel = progressVerificationModelOptional.get();

            progressVerificationRequestToModel(progressVerificationRequest, progressVerificationModel);

            return new ResponseEntity<>(new ApiMessageResponse(200, "Progress Verification Edited Successfully"), HttpStatus.OK);

        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Progress Verification Not Found with Id: " + progressVerificationId);
        }
    }

    @Override
    public ResponseEntity<ApiMessageResponse> deleteProgressVerification(Long progressVerificationId) {
        Optional<ProgressVerificationModel> progressVerificationModelOptional = progressVerificationRepository.findByIdAndIsDeleted(progressVerificationId, false);
        if (progressVerificationModelOptional.isPresent()) {
            ProgressVerificationModel progressVerificationModel = progressVerificationModelOptional.get();
            progressVerificationModel.setIsDeleted(true);
            progressVerificationRepository.save(progressVerificationModel);

            return new ResponseEntity<>(new ApiMessageResponse(200, "Progress Verification Deleted Successfully"), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Progress Verification Not Found with Id: " + progressVerificationId);
        }
    }

    @Override
    public ResponseEntity<ProgressVerificationModel> getProgressVerificationById(Long progressVerificationId) {
        Optional<ProgressVerificationModel> progressVerificationModelOptional = progressVerificationRepository.findByIdAndIsDeleted(progressVerificationId, false);
        if (progressVerificationModelOptional.isPresent()) {
            ProgressVerificationModel progressVerificationModel = progressVerificationModelOptional.get();
            return new ResponseEntity<>(progressVerificationModel, HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Progress Verification Not Found with Id: " + progressVerificationId);
        }
    }

    private void progressVerificationRequestToModel(ProgressVerificationRequest progressVerificationRequest, ProgressVerificationModel progressVerificationModel) {
        trainingInstituteProfileRepository.findById(progressVerificationRequest.getTrainingInstituteProfileId())
                .ifPresentOrElse(progressVerificationModel::setTrainingInstituteProfileModel,
                        () -> {
                            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Training Institute Profile Not Found");
                        });

        proposalRepository.findByIsDeletedAndId(false, progressVerificationRequest.getProposalId())
                .ifPresentOrElse(progressVerificationModel::setProposalModel,
                        () -> {
                            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Proposal Not Found");
                        });

        BeanUtils.copyProperties(progressVerificationRequest, progressVerificationModel);

        progressVerificationRepository.save(progressVerificationModel);
    }

}
