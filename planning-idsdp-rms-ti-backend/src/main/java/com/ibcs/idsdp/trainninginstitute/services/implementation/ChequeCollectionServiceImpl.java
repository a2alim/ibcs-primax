package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import com.ibcs.idsdp.common.services.LoggedUsersService;
import com.ibcs.idsdp.common.utils.RandomGanaratorUtils;
import com.ibcs.idsdp.trainninginstitute.model.domain.AttendanceModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ChequeCollectionModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingInstituteProfileModel;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ChequeCollectionRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ProposalRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TrainingInstituteProfileRepository;
import com.ibcs.idsdp.trainninginstitute.services.ChequeCollectionService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ChequeCollectionRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ChequeCollectionServiceImpl implements ChequeCollectionService {

    private final ProposalRepository proposalRepository;
    private ChequeCollectionRepository chequeCollectionRepository;
    private LoggedUsersService loggedUsersService;
    private RandomGanaratorUtils randomGanaratorUtils;
    private TrainingInstituteProfileRepository trainingInstituteProfileRepository;

    @Override
    public ResponseEntity<ApiMessageResponse> createChequeCollection(ChequeCollectionRequest chequeCollectionRequest) {

        System.out.println(chequeCollectionRequest.toString());
        ChequeCollectionModel chequeCollectionModel = new ChequeCollectionModel();
        chequeCollectionModel.setUuid(randomGanaratorUtils.getUuid());

        BeanUtils.copyProperties(chequeCollectionRequest, chequeCollectionModel);

        Optional<TrainingInstituteProfileModel> trainingInstituteProfileModelOptional = trainingInstituteProfileRepository.findById(chequeCollectionRequest.getInstituteId());
        if (trainingInstituteProfileModelOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Institute Found with ID: " + chequeCollectionRequest.getInstituteId());
        }

        chequeCollectionModel.setTrainingInstituteProfileModel(trainingInstituteProfileModelOptional.get());

        proposalRepository.findByIsDeletedAndId(false, chequeCollectionRequest.getProposalId())
                .ifPresentOrElse(chequeCollectionModel::setProposalModel,
                        () -> {
                            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Proposal Found.");
                        });

        chequeCollectionRepository.save(chequeCollectionModel);

        return new ResponseEntity<>(new ApiMessageResponse(201, "New Cheque Created"), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<PaginationResponse<List<ChequeCollectionModel>>> getChequeCollections(int pageNo, int pageSize, String instituteName) {

        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<ChequeCollectionModel> chequeCollectionModelPage;

        if (instituteName == null)
            chequeCollectionModelPage = chequeCollectionRepository.findByIsDeleted(false, pageable);
        else {
            chequeCollectionModelPage = chequeCollectionRepository.findByIsDeletedAndTrainingInstituteProfileModel_TrainingInstituteNameContainsIgnoreCase(false, instituteName, pageable);
        }
        //Check User
        List<ChequeCollectionModel> chequeCollectionModelList = chequeCollectionModelPage.getContent();
        if (loggedUsersService.getLoggedUserType().equals("Rms_Training_Institute")) {
            chequeCollectionModelList=  chequeCollectionModelList.stream().filter(res-> res.getProposalModel().getCreatedBy().equals(loggedUsersService.getLoggedUserId())).collect(Collectors.toList());

            Pageable paging = PageRequest.of(pageNo, pageSize);
            int start = Math.min((int)paging.getOffset(), chequeCollectionModelList.size());
            int end = Math.min((start + paging.getPageSize()), chequeCollectionModelList.size());

            chequeCollectionModelPage = new PageImpl<>(chequeCollectionModelList.subList(start, end), paging, chequeCollectionModelList.size());
        }

        PaginationResponse<List<ChequeCollectionModel>> paginationResponse = new PaginationResponse<>(pageSize, pageNo, chequeCollectionModelPage.getContent().size(), chequeCollectionModelPage.isLast(),
                chequeCollectionModelPage.getTotalElements(), chequeCollectionModelPage.getTotalPages(), chequeCollectionModelPage.getContent());

        if (chequeCollectionModelPage.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Cheque Collection Found");
        } else {
            return new ResponseEntity<>(paginationResponse, HttpStatus.OK);
        }
    }

    @Override
    public ResponseEntity<ApiMessageResponse> updateChequeCollection(Long chequeId, ChequeCollectionRequest chequeCollectionRequest) {
        Optional<ChequeCollectionModel> chequeCollectionModelOptional = chequeCollectionRepository.findByIsDeletedAndId(false, chequeId);
        if (chequeCollectionModelOptional.isPresent()) {
            ChequeCollectionModel chequeCollectionModel = chequeCollectionModelOptional.get();

            BeanUtils.copyProperties(chequeCollectionRequest, chequeCollectionModel);

            Optional<TrainingInstituteProfileModel> trainingInstituteProfileModelOptional = trainingInstituteProfileRepository.findByIsDeletedAndId(false, chequeCollectionRequest.getInstituteId());
            if (trainingInstituteProfileModelOptional.isEmpty())
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Training Institute Not found");

            chequeCollectionModel.setTrainingInstituteProfileModel(trainingInstituteProfileModelOptional.get());

            proposalRepository.findByIsDeletedAndId(false, chequeCollectionRequest.getProposalId())
                    .ifPresentOrElse(chequeCollectionModel::setProposalModel,
                            () -> {
                                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Proposal Found.");
                            });

            chequeCollectionRepository.save(chequeCollectionModel);

            return new ResponseEntity<>(new ApiMessageResponse(200, "Cheque Updated Successfully"), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cheque Collection Not found with id " + chequeId);
        }
    }

    @Override
    public ResponseEntity<ApiMessageResponse> deleteChequeCollection(Long chequeId) {
        Optional<ChequeCollectionModel> chequeCollectionModelOptional = chequeCollectionRepository.findByIsDeletedAndId(false, chequeId);
        if (chequeCollectionModelOptional.isPresent()) {
            ChequeCollectionModel chequeCollectionModel = chequeCollectionModelOptional.get();
            chequeCollectionModel.setIsDeleted(true);

            chequeCollectionRepository.save(chequeCollectionModel);
            return new ResponseEntity<>(new ApiMessageResponse(200, "Cheque Collection Deleted"), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cheque Collection Not found with id " + chequeId);
        }
    }

    @Override
    public ResponseEntity<ApiResponse<ChequeCollectionModel>> getChequeById(Long chequeId) {
        Optional<ChequeCollectionModel> chequeCollectionModelOptional = chequeCollectionRepository.findByIsDeletedAndId(false, chequeId);
        if (chequeCollectionModelOptional.isPresent()) {
            ChequeCollectionModel chequeCollectionModel = chequeCollectionModelOptional.get();

            return new ResponseEntity<>(new ApiResponse<>(200, "Cheque Collection Found", chequeCollectionModel), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cheque Collection Not found with id " + chequeId);
        }
    }

    @Override
    public ResponseEntity<ApiMessageResponse> uploadSignatureDocument(Long chequeId, MinioAttachment minioAttachment) {
        ChequeCollectionModel chequeCollectionModel = chequeCollectionRepository.findByIsDeletedAndId(false, chequeId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cheque Collection Not found with id " + chequeId)
        );

        chequeCollectionModel.setSignaturedDocument(minioAttachment);

        chequeCollectionRepository.save(chequeCollectionModel);

        return new ResponseEntity<>(new ApiMessageResponse(200, "Signature Document Uploaded"), HttpStatus.OK);
    }
}
