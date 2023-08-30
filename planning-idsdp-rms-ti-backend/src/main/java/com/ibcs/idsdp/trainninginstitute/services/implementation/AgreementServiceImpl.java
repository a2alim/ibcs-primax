package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.common.services.LoggedUsersService;
import com.ibcs.idsdp.common.utils.RandomGanaratorUtils;
import com.ibcs.idsdp.trainninginstitute.model.domain.*;
import com.ibcs.idsdp.trainninginstitute.model.repositories.*;
import com.ibcs.idsdp.trainninginstitute.services.AgreementService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.AgreementInstallmentRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.AgreementRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.*;
import lombok.AllArgsConstructor;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AgreementServiceImpl implements AgreementService {
	
    private final AgreementRepository agreementRepository;
    private final CourseRepository courseRepository;
    private final ParticipantRepository participantRepository;
    private final GuarantorRepository guarantorRepository;
    private final LoggedUsersService loggedUsersService;
    private final RandomGanaratorUtils randomGanaratorUtils;
    private final ProposalRepository proposalRepository;

    @Override
    public ResponseEntity<ApiMessageResponse> createAgreement(AgreementRequest agreementRequest) {

        boolean isExistsByProposal = agreementRepository.existsByProposalModel_IdAndIsDeleted(agreementRequest.getProposalId(), false);

        if (isExistsByProposal)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Agreement already exists for this proposal");

        List<AgreementInstallmentModel> agreementInstallmentModelList = new ArrayList<>();
        for (AgreementInstallmentRequest agreementInstallmentRequest : agreementRequest.getAgreementInstallments()) {
            AgreementInstallmentModel agreementInstallmentModel = new AgreementInstallmentModel();

            BeanUtils.copyProperties(agreementInstallmentRequest, agreementInstallmentModel);

            agreementInstallmentModelList.add(agreementInstallmentModel);
        }

        AgreementModel agreementModel = new AgreementModel();
        AgreementPartiesModel onBehalf = new AgreementPartiesModel();
        AgreementPartiesModel witness = new AgreementPartiesModel();

        BeanUtils.copyProperties(agreementRequest.getOnBehalf(), onBehalf);
        BeanUtils.copyProperties(agreementRequest.getWitness(), witness);
        BeanUtils.copyProperties(agreementRequest, agreementModel);

        agreementModel.setUuid(randomGanaratorUtils.getUuid());
        agreementModel.setAgreementInstallments(agreementInstallmentModelList);
        agreementModel.setOnBehalf(onBehalf);
        agreementModel.setWitness(witness);
        agreementModel.setAgreementStatus(AgreementStatus.RUNNING);

        Optional<ProposalModel> proposalModelOptional = proposalRepository.findByIsDeletedAndId(false, agreementRequest.getProposalId());
        if (proposalModelOptional.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Proposal Found with ID: " + agreementRequest.getProposalId());
        agreementModel.setProposalModel(proposalModelOptional.get());

        Optional<GuarantorModel> guarantorModelOptional = guarantorRepository.findByIsDeletedAndId(false, agreementRequest.getGuarantorId());
        if (guarantorModelOptional.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Guarantor Found with ID: " + agreementRequest.getGuarantorId());
        agreementModel.setGuarantorModel(guarantorModelOptional.get());

        agreementRepository.save(agreementModel);

        return new ResponseEntity<>(new ApiMessageResponse(201, "Agreement Created"), HttpStatus.CREATED);

    }

    @Override
    public ResponseEntity<PaginationResponse<List<AgreementModel>>> getAgreements(int pageNo, int pageSize, String search) {
//        Sort sort = Sort.by(Sort.Direction.ASC, "CreatedOn");
        Sort sort = Sort.by(Sort.Direction.DESC, "CreatedOn");
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<AgreementModel> agreementModelPage = agreementRepository.findAllByIsDeleted(false, pageable);

        //Check User
        List<AgreementModel> agreementModelList = agreementModelPage.getContent();
        if (loggedUsersService.getLoggedUserType().equals("Rms_Training_Institute")) {
            agreementModelList = agreementModelList.stream().filter(res -> res.getProposalModel().getCreatedBy().equals(loggedUsersService.getLoggedUserId())).collect(Collectors.toList());

            Pageable paging = PageRequest.of(pageNo, pageSize);
            int start = Math.min((int) paging.getOffset(), agreementModelList.size());
            int end = Math.min((start + paging.getPageSize()), agreementModelList.size());

            agreementModelPage = new PageImpl<AgreementModel>(agreementModelList.subList(start, end), paging, agreementModelList.size());
        }

        PaginationResponse<List<AgreementModel>> paginationResponse = new PaginationResponse<>(
                pageSize, pageNo, agreementModelPage.getContent().size(), agreementModelPage.isLast(), agreementModelPage.getTotalElements(),
                agreementModelPage.getTotalPages(), agreementModelPage.getContent()
        );

        if (agreementModelPage.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Agreements Found");
        else
            return new ResponseEntity<>(paginationResponse, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ApiMessageResponse> deleteAgreement(Long agreementId) {
        Optional<AgreementModel> agreementModelOptional = agreementRepository.findByIdAndIsDeleted(agreementId, false);
        if (agreementModelOptional.isPresent()) {
            AgreementModel agreementModel = agreementModelOptional.get();

            agreementModel.setIsDeleted(true);
            agreementRepository.save(agreementModel);

            return new ResponseEntity<>(new ApiMessageResponse(200, "Agreement Deleted"), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Agreement Found with ID: " + agreementId);
        }
    }

    @Override
    public ResponseEntity<ApiMessageResponse> editAgreement(Long agreementId, AgreementRequest agreementRequest) {

//        boolean isExistsByProposal = agreementRepository.existsByProposalModel_IdAndIsDeleted(agreementRequest.getProposalId(), false);
//
//        if (isExistsByProposal)
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Agreement already exists for this proposal");

        Optional<AgreementModel> agreementModelOptional = agreementRepository.findByIdAndIsDeleted(agreementId, false);
        if (agreementModelOptional.isPresent()) {
            AgreementModel agreementModel = agreementModelOptional.get();

            List<AgreementInstallmentModel> agreementInstallmentModelList = new ArrayList<>();
            for (AgreementInstallmentRequest agreementInstallmentRequest : agreementRequest.getAgreementInstallments()) {
                AgreementInstallmentModel agreementInstallmentModel = new AgreementInstallmentModel();

                BeanUtils.copyProperties(agreementInstallmentRequest, agreementInstallmentModel);

                agreementInstallmentModelList.add(agreementInstallmentModel);
            }

            AgreementPartiesModel onBehalf = new AgreementPartiesModel();
            AgreementPartiesModel witness = new AgreementPartiesModel();

            BeanUtils.copyProperties(agreementRequest.getOnBehalf(), onBehalf);
            BeanUtils.copyProperties(agreementRequest.getWitness(), witness);
            BeanUtils.copyProperties(agreementRequest, agreementModel);

            agreementModel.setAgreementInstallments(agreementInstallmentModelList);
            agreementModel.setOnBehalf(onBehalf);
            agreementModel.setWitness(witness);


            Optional<ProposalModel> proposalModelOptional = proposalRepository.findByIsDeletedAndId(false, agreementRequest.getProposalId());
            if (proposalModelOptional.isEmpty())
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Proposal Found with ID: " + agreementRequest.getProposalId());
            agreementModel.setProposalModel(proposalModelOptional.get());

            Optional<GuarantorModel> guarantorModelOptional = guarantorRepository.findByIsDeletedAndId(false, agreementRequest.getGuarantorId());
            if (guarantorModelOptional.isEmpty())
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Guarantor Found with ID: " + agreementRequest.getGuarantorId());
            agreementModel.setGuarantorModel(guarantorModelOptional.get());

            agreementRepository.save(agreementModel);

            return new ResponseEntity<>(new ApiMessageResponse(200, "Agreement Edited"), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Agreement Found with ID: " + agreementId);
        }
    }

    @Override
    public ResponseEntity<AgreementModel> getSingleAgreement(Long agreementId) {
        Optional<AgreementModel> agreementModelOptional = agreementRepository.findByIdAndIsDeleted(agreementId, false);
        if (agreementModelOptional.isPresent()) {
            AgreementModel agreementModel = agreementModelOptional.get();

            return new ResponseEntity<>(agreementModel, HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Agreement Found with ID: " + agreementId);
        }
    }

    @Override
    public ResponseEntity<ApiMessageResponse> changeStatus(Long agreementId, AgreementStatus agreementStatus) {
        Optional<AgreementModel> agreementModelOptional = agreementRepository.findByIdAndIsDeleted(agreementId, false);
        if (agreementModelOptional.isPresent()) {
            AgreementModel agreementModel = agreementModelOptional.get();

//            if (agreementModel.getAgreementStatus().equals(AgreementStatus.COMPLETED))
//                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can't Change Completed Status");

            agreementModel.setAgreementStatus(agreementStatus);

            if(agreementStatus.equals(AgreementStatus.COMPLETED) || agreementStatus.equals(AgreementStatus.REJECTED)){
                GuarantorModel guarantorModel = guarantorRepository.findByIsDeletedAndProposalModel_Id(false, agreementModel.getProposalModel().getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No Guarantor Found with Proposal"));
                guarantorModel.setSubmitted(true);
                guarantorRepository.save(guarantorModel);

                agreementModel.setGuarantorModel(guarantorModel);

                List<ParticipantModel> participantModels = participantRepository.findByIsDeletedAndProposalModel_Id(false, agreementModel.getProposalModel().getId());
                participantModels.forEach(
                        participantModel -> {
                            participantModel.setEditable(false);
                        }
                );
                participantRepository.saveAll(participantModels);
            } else if(agreementStatus.equals(AgreementStatus.RUNNING)) {
                GuarantorModel guarantorModel = guarantorRepository.findByIsDeletedAndProposalModel_Id(false, agreementModel.getProposalModel().getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No Guarantor Found with Proposal"));
                guarantorModel.setSubmitted(false);
                guarantorRepository.save(guarantorModel);

                agreementModel.setGuarantorModel(guarantorModel);

                List<ParticipantModel> participantModels = participantRepository.findByIsDeletedAndProposalModel_Id(false, agreementModel.getProposalModel().getId());
                participantModels.forEach(
                        participantModel -> {
                            participantModel.setEditable(true);
                        }
                );
                participantRepository.saveAll(participantModels);
            }


            agreementRepository.save(agreementModel);

            return new ResponseEntity<>(new ApiMessageResponse(200, "Status Changed to " + agreementStatus), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Agreement Found with ID: " + agreementId);
        }
    }

    @Override
    public AgreementViewList getAllAgreementLetter(Long id) {

        List<AgreementInstallmentViewList> agreementInstallmentViewLists = new ArrayList<>();
        List<ParticipantView> participantViewList = new ArrayList<>();
        List<GuarantorViewList> guarantorViewListList = new ArrayList<>();
        List<AcademicBackGroundView> academicBackGroundViewList = new ArrayList<>();

        Optional<AgreementModel> agreementModelOptional = agreementRepository.findByIdAndIsDeleted(id, false);
        AgreementModel agreementModel = agreementModelOptional.get();

        Optional<List<ParticipantModel>> participantModelOptional =
                participantRepository.findAllByProposalModel(agreementModel.getProposalModel());

        if (!participantModelOptional.isPresent()) {
            throw new RuntimeException("Not Found");
        }

        List<ParticipantModel> participantModelList = participantModelOptional.get();

        participantModelList.forEach(participantModel -> {

            ParticipantView participantView = new ParticipantView();

            participantView.setName(participantModel.getName());
            participantView.setGender(participantModel.getGender());
            participantView.setDateOfBirth(participantModel.getDateOfBirth());
            participantView.setOrganizationName(participantModel.getOrganizationName());
            participantView.setOrganizationAddress(participantModel.getOrganizationAddress());
            participantView.setDesignation(participantModel.getDesignation());
            participantView.setYearsOfExperience(participantModel.getYearsOfExperience());
            participantView.setPresentAddress(participantModel.getPresentAddress());
            participantView.setPermanentAddress(participantModel.getPermanentAddress());
            participantView.setPhoneNo(participantModel.getPhoneNo());
            participantView.setEmail(participantModel.getEmail());
            participantView.setHowYouKnowThisProgram(participantModel.getHowYouKnowThisProgram());

            participantModel.getAcademicBackgroundModels().forEach(accademicBgList -> {
                AcademicBackGroundView academicBackGroundView = new AcademicBackGroundView();

                academicBackGroundView.setSubject(accademicBgList.getSubject());
                academicBackGroundView.setPassingYear(accademicBgList.getPassingYear());
                academicBackGroundView.setBoard(accademicBgList.getBoard());
                academicBackGroundView.setInstituteName(accademicBgList.getInstituteName());
                academicBackGroundViewList.add(academicBackGroundView);

            });
            participantView.setAcademicBackGroundViews(academicBackGroundViewList);

            participantViewList.add(participantView);

        });

        agreementModel.getAgreementInstallments().forEach(installmentListData -> {
            agreementInstallmentViewLists.add(new AgreementInstallmentViewList(installmentListData.getPercentageOfInstallment(), installmentListData.getTotalAmount()));
        });


        GuarantorModel guarantorModel =
                agreementModel.getGuarantorModel();

        guarantorViewListList.add(new GuarantorViewList(
                guarantorModel.getProposalModel().getTrainingName(),
                guarantorModel.getGuarantorName(), guarantorModel.getJobInfo(),
                guarantorModel.getDesignation(), guarantorModel.getMobileNo(),
                guarantorModel.getEmail(), guarantorModel.getPresentAddress(),
                guarantorModel.getPermanentAddress(), guarantorModel.getRefundDays(),
                guarantorModel.getImage(), guarantorModel.getNid(), guarantorModel.getSignatureImage(),
                guarantorModel.getNidImage(), guarantorModel.getIsActive()
        ));


        return AgreementViewList.builder()
                .agreementDate(agreementModel.getAgreementDate())
                .onBehalf(agreementModel.getOnBehalf())
                .witness(agreementModel.getWitness())
                .amountOfGrant(agreementModel.getAmountOfGrant())
                .traineeRecommended(agreementModel.getTraineeRecommended())
                .noOfInstallment(agreementModel.getNoOfInstallment())
                .agreementStatus(agreementModel.getAgreementStatus())
                .fiscalYear(agreementModel.getFiscalYearId())
                .installmentViewLists(agreementInstallmentViewLists)
                .guarantorViewListList(guarantorViewListList)
                .participantViewList(participantViewList)
                .build();
    }

    @Override
    public ResponseEntity<AgreementModel> getAgreementByProposalId(Long id) {
        AgreementModel agreementModel = agreementRepository.findByIsDeletedAndProposalModel_Id(false, id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agreement not found for this proposal id :" + id));

        return new ResponseEntity<>(agreementModel, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<AgreementInstallmentResponse>> getInstallmentsByProposalId(Long proposalId) {
        AgreementModel agreementModel = agreementRepository.findByIsDeletedAndProposalModel_Id(false, proposalId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agreement not found for this proposal id : " + proposalId));

        List<AgreementInstallmentResponse> agreementInstallmentResponses =
                agreementModel.getAgreementInstallments().stream().map(agreementInstallment -> {
                    return new AgreementInstallmentResponse(agreementInstallment.getInstallmentName(), agreementInstallment.getTotalAmount());
                }).collect(Collectors.toList());

        return new ResponseEntity<>(agreementInstallmentResponses, HttpStatus.OK);
    }

	@Override
	public ResponseEntity<List<AgreementModel>> findProposalList() {
		
		List<AgreementModel> list = agreementRepository.findAllByIsDeleted(false);
		if(list !=null && !CollectionUtils.isEmpty(list)) {
			list =list.stream().filter(f->f.getProposalModel().getTrainingInstituteProfileModel().getUserId().equals(loggedUsersService.getLoggedUserId())).collect(Collectors.toList());
		}		
		 return new ResponseEntity<>(list, HttpStatus.OK);
	}

}
