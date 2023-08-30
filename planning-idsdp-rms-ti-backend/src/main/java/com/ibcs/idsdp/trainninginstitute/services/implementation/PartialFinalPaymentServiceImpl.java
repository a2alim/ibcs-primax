package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.common.services.LoggedUsersService;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.trainninginstitute.enums.Status;
import com.ibcs.idsdp.trainninginstitute.model.domain.*;
import com.ibcs.idsdp.trainninginstitute.model.repositories.PartialFinalPaymentRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ProposalRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TrainingBudgetRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TrainingInstituteProfileRepository;
import com.ibcs.idsdp.trainninginstitute.services.PartialFinalPaymentService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.PartialFinalPaymentRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.PaymentBillVoucherRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.PaymentVoucherRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.*;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class PartialFinalPaymentServiceImpl implements PartialFinalPaymentService {
    private final PartialFinalPaymentRepository partialFinalPaymentRepository;
    private final TrainingBudgetRepository trainingBudgetRepository;
    private final TrainingInstituteProfileRepository trainingInstituteProfileRepository;
    private final ProposalRepository proposalRepository;
    private final LoggedUsersService loggedUsersService;

    @Override
    public ResponseEntity<ApiResponse<Long>> createPartialFinalPayment(PartialFinalPaymentRequest partialFinalPaymentRequest){
    	
    	PartialFinalPaymentModel partialFinalPaymentModel = new PartialFinalPaymentModel();

        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails)SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();

        trainingInstituteProfileRepository.findByUserId(accessTokenDetail.getId())
                .ifPresentOrElse(partialFinalPaymentModel::setTrainingInstituteProfileModel, () -> {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Training Institute Profile not found. Please complete your profile first.");
                });
        partialFinalPaymentModel = partialFinalPaymentRequestToModel(partialFinalPaymentRequest, partialFinalPaymentModel);

        return new ResponseEntity<>(new ApiResponse<>(201, "Partial Final Payment created successfully",partialFinalPaymentModel.getId()), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<PaginationResponse<List<PartialFinalPaymentResponse>>> getPartialFinalPayments(int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<PartialFinalPaymentModel> partialFinalPaymentModelPage = partialFinalPaymentRepository.findAllByIsDeleted(false, pageable);

        //Check User
        List<PartialFinalPaymentModel> partialFinalPaymentModelList = partialFinalPaymentModelPage.getContent();
        if (loggedUsersService.getLoggedUserType().equals("Rms_Training_Institute")) {
            partialFinalPaymentModelList = partialFinalPaymentModelList.stream()
                    .filter(res -> res.getCreatedBy().equals(loggedUsersService.getLoggedUserId())).collect(Collectors.toList());

            Pageable paging = PageRequest.of(page, size);
            int start = Math.min((int) paging.getOffset(), partialFinalPaymentModelList.size());
            int end = Math.min((start + paging.getPageSize()), partialFinalPaymentModelList.size());

            partialFinalPaymentModelPage = new PageImpl<>(partialFinalPaymentModelList.subList(start, end), paging, partialFinalPaymentModelList.size());
        }

        List<PartialFinalPaymentResponse> partialFinalPaymentResponseList = new ArrayList<>();
        if (partialFinalPaymentModelPage.getContent().size() > 0) {

            for (PartialFinalPaymentModel partialFinalPaymentModel : partialFinalPaymentModelPage.getContent()) {
                PartialFinalPaymentResponse partialFinalPaymentResponse = new PartialFinalPaymentResponse();
                BeanUtils.copyProperties(partialFinalPaymentModel, partialFinalPaymentResponse);

                List<PaymentBillVoucherResponse> paymentBillVoucherResponseList = new ArrayList<>();
                if (partialFinalPaymentModel.getPaymentBillVoucherModels() != null) {
                    for (PaymentBillVoucherModel paymentBillVoucherModel : partialFinalPaymentModel.getPaymentBillVoucherModels()) {
                        PaymentBillVoucherResponse paymentBillVoucherResponse = new PaymentBillVoucherResponse();
                        BeanUtils.copyProperties(paymentBillVoucherModel, paymentBillVoucherResponse);
                        paymentBillVoucherResponse.setTrainingBudgetId(paymentBillVoucherModel.getTrainingBudgetModel().getId());
                        paymentBillVoucherResponseList.add(paymentBillVoucherResponse);
                    }
                }

                partialFinalPaymentResponse.setProposalName(partialFinalPaymentModel.getProposalModel().getTrainingName());
                partialFinalPaymentResponse.setPaymentBillVoucherModels(paymentBillVoucherResponseList);
                partialFinalPaymentResponseList.add(partialFinalPaymentResponse);
            }

        }


        PaginationResponse<List<PartialFinalPaymentResponse>> paginationResponse = new PaginationResponse<>(
                size, page, partialFinalPaymentModelPage.getContent().size(), partialFinalPaymentModelPage.isLast(),
                partialFinalPaymentModelPage.getTotalElements(), partialFinalPaymentModelPage.getTotalPages(), partialFinalPaymentResponseList
        );

        if (partialFinalPaymentModelPage.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Partial Final Payments not found");
        } else {
            return new ResponseEntity<>(paginationResponse, HttpStatus.OK);
        }

    }

    @Override
    public ResponseEntity<PartialFinalPaymentModel> getSinglePartialFinalPayment(Long id) {
        Optional<PartialFinalPaymentModel> partialFinalPaymentModelOptional = partialFinalPaymentRepository.findByIdAndIsDeleted(id, false);
        if (partialFinalPaymentModelOptional.isPresent()) {
            PartialFinalPaymentModel partialFinalPaymentModel = partialFinalPaymentModelOptional.get();

//            PartialFinalPaymentResponse partialFinalPaymentResponse = new PartialFinalPaymentResponse();
//            BeanUtils.copyProperties(partialFinalPaymentModel, partialFinalPaymentResponse);
//
//            List<PaymentBillVoucherResponse> paymentBillVoucherResponseList = new ArrayList<>();
//            if (partialFinalPaymentModel.getPaymentBillVoucherModels() != null) {
//                for (PaymentBillVoucherModel paymentBillVoucherModel : partialFinalPaymentModel.getPaymentBillVoucherModels()) {
//                    PaymentBillVoucherResponse paymentBillVoucherResponse = new PaymentBillVoucherResponse();
//                    BeanUtils.copyProperties(paymentBillVoucherModel, paymentBillVoucherResponse);
//                    paymentBillVoucherResponse.setTrainingBudgetId(paymentBillVoucherModel.getTrainingBudgetModel().getId());
//                    paymentBillVoucherResponseList.add(paymentBillVoucherResponse);
//                }
//            }
//
//            partialFinalPaymentResponse.setPaymentBillVoucherModels(paymentBillVoucherResponseList);


            return new ResponseEntity<>(partialFinalPaymentModel, HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Partial Final Payment not found with id: " + id);
        }
    }

    @Override
    public ResponseEntity<ApiMessageResponse> deletePartialFinalPayment(Long id) {
        Optional<PartialFinalPaymentModel> partialFinalPaymentModelOptional = partialFinalPaymentRepository.findByIdAndIsDeleted(id, false);
        if (partialFinalPaymentModelOptional.isPresent()) {
            PartialFinalPaymentModel partialFinalPaymentModel = partialFinalPaymentModelOptional.get();
            partialFinalPaymentModel.setIsDeleted(true);
            partialFinalPaymentRepository.save(partialFinalPaymentModel);

            return new ResponseEntity<>(new ApiMessageResponse(200, "Partial Final Payment deleted successfully"), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Partial Final Payment not found with id: " + id);
        }
    }

    @Override
    public ResponseEntity<ApiMessageResponse> updatePartialFinalPayment(Long id, PartialFinalPaymentRequest partialFinalPaymentRequest) {
        Optional<PartialFinalPaymentModel> partialFinalPaymentModelOptional = partialFinalPaymentRepository.findByIdAndIsDeleted(id, false);
        if (partialFinalPaymentModelOptional.isPresent()) {
            PartialFinalPaymentModel partialFinalPaymentModel = partialFinalPaymentModelOptional.get();
            partialFinalPaymentRequestToModel(partialFinalPaymentRequest, partialFinalPaymentModel);
            return new ResponseEntity<>(new ApiMessageResponse(200, "Partial Final Payment updated successfully"), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Partial Final Payment not found with id: " + id);
        }
    }

    @Override
    public ResponseEntity<ApiMessageResponse> changeStatus(Long id, Status status) {
        Optional<PartialFinalPaymentModel> partialFinalPaymentModelOptional = partialFinalPaymentRepository.findByIdAndIsDeleted(id, false);
        if (partialFinalPaymentModelOptional.isPresent()) {
            PartialFinalPaymentModel partialFinalPaymentModel = partialFinalPaymentModelOptional.get();

//            if (partialFinalPaymentModel.getStatus() == Status.APPROVED) {
//                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can't change status of approved partial final payment");
//            }
            if (status == Status.APPROVED) {
                partialFinalPaymentModel.setDateOfAcceptance(LocalDate.now());
            }

            partialFinalPaymentModel.setStatus(status);

            partialFinalPaymentRepository.save(partialFinalPaymentModel);

            return new ResponseEntity<>(new ApiMessageResponse(200, "Partial Final Payment status updated successfully"), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Partial Final Payment not found with id: " + id);
        }
    }

    @Override
    public ResponseEntity<List<PreviousPaymentResponse>> getPreviousPayments(Long proposalId) {

        List<PartialFinalPaymentModel> partialFinalPaymentModels = partialFinalPaymentRepository.findAllByIsDeletedAndProposalModel_Id(false, proposalId);

        List<PreviousPaymentResponse> previousPaymentResponseList = partialFinalPaymentModels.stream().map(
                        partialFinalPaymentModel -> new PreviousPaymentResponse(partialFinalPaymentModel.getInstallmentType(),
                                partialFinalPaymentModel.getInstallmentAmount(), partialFinalPaymentModel.getStatus()))
                .collect(Collectors.toList());

        return new ResponseEntity<>(previousPaymentResponseList, HttpStatus.OK);

    }

    private PartialFinalPaymentModel partialFinalPaymentRequestToModel(PartialFinalPaymentRequest partialFinalPaymentRequest, PartialFinalPaymentModel partialFinalPaymentModel) {

        List<PaymentVoucherModel> paymentVoucherModels = new ArrayList<>();
        if (partialFinalPaymentRequest.getPaymentVoucherModels() != null) {
            for (PaymentVoucherRequest paymentVoucherRequest : partialFinalPaymentRequest.getPaymentVoucherModels()) {
                PaymentVoucherModel paymentVoucherModel = new PaymentVoucherModel();
                BeanUtils.copyProperties(paymentVoucherRequest, paymentVoucherModel);
                paymentVoucherModels.add(paymentVoucherModel);
            }
        }

        List<PaymentBillVoucherModel> paymentBillVoucherModels = new ArrayList<>();
        if (partialFinalPaymentRequest.getPaymentBillVoucherModels() != null) {
            for (PaymentBillVoucherRequest paymentBillVoucherRequest : partialFinalPaymentRequest.getPaymentBillVoucherModels()) {
                PaymentBillVoucherModel paymentBillVoucherModel = new PaymentBillVoucherModel();

                Optional<TrainingBudgetModel> trainingBudgetModelOptional =trainingBudgetRepository.findByIdAndIsDeleted(paymentBillVoucherRequest.getTrainingBudgetId(), false);

                trainingBudgetModelOptional.ifPresentOrElse((paymentBillVoucherModel::setTrainingBudgetModel), () -> {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Training Budget not found with id: " + paymentBillVoucherRequest.getTrainingBudgetId());
                });

                BeanUtils.copyProperties(paymentBillVoucherRequest, paymentBillVoucherModel);
                paymentBillVoucherModels.add(paymentBillVoucherModel);
            }
        }


        BeanUtils.copyProperties(partialFinalPaymentRequest, partialFinalPaymentModel);
        partialFinalPaymentModel.setPaymentVoucherModels(paymentVoucherModels);
        partialFinalPaymentModel.setPaymentBillVoucherModels(paymentBillVoucherModels);
        partialFinalPaymentModel.setStatus(Status.PENDING);

        proposalRepository.findByIsDeletedAndId(false, partialFinalPaymentRequest.getProposalId())
                .ifPresentOrElse(partialFinalPaymentModel::setProposalModel,
                        () -> {
                            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Proposal not found.");
                        });

        return partialFinalPaymentRepository.save(partialFinalPaymentModel);
    }

}
