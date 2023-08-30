package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.common.services.LoggedUsersService;
import com.ibcs.idsdp.common.utils.RandomGanaratorUtils;
import com.ibcs.idsdp.trainninginstitute.model.domain.*;
import com.ibcs.idsdp.trainninginstitute.model.repositories.AgreementRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.CourseRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ParticipantRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ProposalRepository;
import com.ibcs.idsdp.trainninginstitute.services.ParticipantService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.AcademicBackgroundRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ParticipantRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.*;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

@AllArgsConstructor
@Service
public class ParticipantServiceImpl implements ParticipantService {
	
    private final ParticipantRepository participantRepository;
    private final CourseRepository courseRepository;
    private final ProposalRepository proposalRepository;
    private final LoggedUsersService loggedUsersService;
    private final AgreementRepository agreementRepository;
    private final RandomGanaratorUtils randomGanaratorUtils;

    @Transactional
    @Override
    public ResponseEntity<ApiResponse<Long>> createParticipant(ParticipantRequest participantRequest) {
        List<AcademicBackgroundModel> participantAcademicBackgroundModels = new ArrayList<>();

        if (participantRequest.getAcademicBackgroundModels() != null) {
            for (AcademicBackgroundRequest academicBackgroundRequest : participantRequest.getAcademicBackgroundModels()) {
                AcademicBackgroundModel participantAcademicBackgroundModel = new AcademicBackgroundModel();

                BeanUtils.copyProperties(academicBackgroundRequest, participantAcademicBackgroundModel);
                participantAcademicBackgroundModels.add(participantAcademicBackgroundModel);
            }
        }

        ParticipantModel participantModel = new ParticipantModel();
        BeanUtils.copyProperties(participantRequest, participantModel);
        participantModel.setAcademicBackgroundModels(participantAcademicBackgroundModels);
        participantModel.setUuid(randomGanaratorUtils.getUuid());

        AgreementModel agreementModel = agreementRepository.findByIsDeletedAndProposalModel_Id(false, participantRequest.getProposalId())
                .orElse(null);

        if(agreementModel != null && (agreementModel.getAgreementStatus().equals(AgreementStatus.COMPLETED) ||
                agreementModel.getAgreementStatus().equals(AgreementStatus.REJECTED))){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Agreement is completed. You can not add participants now.");
        }

        Optional<ProposalModel> proposalModelOptional = proposalRepository.findByIsDeletedAndId(false, participantRequest.getProposalId());
        if (proposalModelOptional.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Proposal Found with ID: " + participantRequest.getProposalId());


        participantModel.setProposalModel(proposalModelOptional.get());

//        for complete status
        participantModel.setIsCompleted(false);
        participantModel.setEditable(true);
        participantModel.setImage(participantRequest.getImage());
        participantModel.setNidImage(participantRequest.getNidImage());
        participantModel = participantRepository.save(participantModel);

        return new ResponseEntity<>(new ApiResponse<>(201, "Participant Created", participantModel.getId()), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<PaginationResponse<List<ParticipantModel>>> getParticipantList(int pageNo, int pageSize, String name) {

        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<ParticipantModel> participantModelPage;

        if (name == null)
            participantModelPage = participantRepository.findByIsDeleted(false, pageable);
        else
            participantModelPage = participantRepository.findByIsDeletedAndNameContainingIgnoreCase(false, name, pageable);

        //Check User
        List<ParticipantModel> participantModelsList = participantModelPage.getContent();
        if (loggedUsersService.getLoggedUserType().equals("Rms_Training_Institute")) {
            participantModelsList=  participantModelsList.stream().filter(res-> res.getCreatedBy().equals(loggedUsersService.getLoggedUserId())).collect(Collectors.toList());

            Pageable paging = PageRequest.of(pageNo, pageSize);
            int start = Math.min((int)paging.getOffset(), participantModelsList.size());
            int end = Math.min((start + paging.getPageSize()), participantModelsList.size());

            participantModelPage = new PageImpl<ParticipantModel>(participantModelsList.subList(start, end), paging, participantModelsList.size());
        }

        PaginationResponse<List<ParticipantModel>> paginationResponse = new PaginationResponse<>(
                pageSize, pageNo, participantModelPage.getContent().size(), participantModelPage.isLast(), participantModelPage.getTotalElements(),
                participantModelPage.getTotalPages(), participantModelPage.getContent()
        );

        if (participantModelPage.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Participant Found");
        else
            return new ResponseEntity<>(paginationResponse, HttpStatus.OK);

    }

    @Override
    public ResponseEntity<ApiMessageResponse> editParticipant(Long participantId, ParticipantRequest participantRequest) {
        Optional<ParticipantModel> participantModelOptional = participantRepository.findByIsDeletedAndId(false, participantId);
        if (participantModelOptional.isPresent()) {
            ParticipantModel participantModel = participantModelOptional.get();

            List<AcademicBackgroundModel> participantAcademicBackgroundModels = new ArrayList<>();

            if(participantRequest.getAcademicBackgroundModels() != null){
                for (AcademicBackgroundRequest academicBackgroundRequest : participantRequest.getAcademicBackgroundModels()) {
                    AcademicBackgroundModel participantAcademicBackgroundModel = new AcademicBackgroundModel();

                    BeanUtils.copyProperties(academicBackgroundRequest, participantAcademicBackgroundModel);
                    participantAcademicBackgroundModels.add(participantAcademicBackgroundModel);
                }
            }

            participantModel.setAcademicBackgroundModels(participantAcademicBackgroundModels);

            BeanUtils.copyProperties(participantRequest, participantModel);

            Optional<ProposalModel> proposalModelOptional = proposalRepository.findByIsDeletedAndId(false, participantRequest.getProposalId());
            if (proposalModelOptional.isEmpty())
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Proposal Found with ID: " + participantRequest.getProposalId());

            participantModel.setProposalModel(proposalModelOptional.get());

            participantRepository.save(participantModel);

            return new ResponseEntity<>(new ApiMessageResponse(200, "Edit Successful"), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Participant found with id: " + participantId);
        }
    }

    @Override
    public ResponseEntity<ApiMessageResponse> deleteParticipant(Long participantId) {
        Optional<ParticipantModel> participantModelOptional = participantRepository.findByIsDeletedAndId(false, participantId);
        if (participantModelOptional.isPresent()) {
            ParticipantModel participantModel = participantModelOptional.get();

            participantModel.setIsDeleted(true);

            participantRepository.save(participantModel);

            return new ResponseEntity<>(new ApiMessageResponse(200, "Delete Successful"), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Participant found with id: " + participantId);
        }
    }

    @Override
    public ResponseEntity<ParticipantModel> getParticipant(Long participantId) {
        Optional<ParticipantModel> participantModelOptional = participantRepository.findByIsDeletedAndId(false, participantId);
        if (participantModelOptional.isPresent()) {
            ParticipantModel participantModel = participantModelOptional.get();

            return new ResponseEntity<>(participantModel, HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Participant found with id: " + participantId);
        }
    }

    @Override
    public ParticipantView getParticipantView(Long id) {

        Optional<ParticipantModel> participantModelOptional = participantRepository.findAllByIdAndIsDeleted(id,false);

        List<AcademicBackGroundView> academicBackGroundViewList = new ArrayList<>();

        ParticipantModel participantModel = participantModelOptional.get();

        participantModel.getAcademicBackgroundModels().forEach(acbList -> {
            AcademicBackGroundView academicBackGroundView = new AcademicBackGroundView();

            academicBackGroundView.setSubject(acbList.getSubject());
            academicBackGroundView.setExamination(acbList.getExaminationName());
            academicBackGroundView.setResult(acbList.getResultId());
            academicBackGroundView.setPassingYear(acbList.getPassingYear());
            academicBackGroundView.setInstituteName(acbList.getInstituteName());
            academicBackGroundView.setBoard(acbList.getBoard());
            academicBackGroundView.setCertificateImage(acbList.getCertificateImage());

            academicBackGroundViewList.add(academicBackGroundView);

        });

        ProposalModel proposalModel = participantModel.getProposalModel();


        return ParticipantView.builder()
                .courseTitle(proposalModel.getTrainingName())
                .name(participantModel.getName())
                .dateOfBirth(participantModel.getDateOfBirth())
                .gender(participantModel.getGender())
                .email(participantModel.getEmail())
                .phoneNo(participantModel.getPhoneNo())
                .permanentAddress(participantModel.getPermanentAddress())
                .presentAddress(participantModel.getPresentAddress())
                .howYouKnowThisProgram(participantModel.getHowYouKnowThisProgram())
                .facebookOrTwitterLink(participantModel.getFacebookOrTwitterLink())
                .ifOthers(participantModel.getIfOthers())
                .organizationName(participantModel.getOrganizationName())
                .designation(participantModel.getDesignation())
                .organizationAddress(participantModel.getOrganizationAddress())
                .yearsOfExperience(participantModel.getYearsOfExperience())
                .nidNo(participantModel.getNidNo())
                .image(participantModel.getImage())
                .nidImage(participantModel.getNidImage())
                .academicBackGroundViews(academicBackGroundViewList)
                .build();
    }

    @Override
    public ResponseEntity<List<ParticipantModel>> getParticipantsByCourseId(Long courseId) {
        List<ParticipantModel> participantModels = participantRepository.findAllByIsDeletedAndProposalModel_Id(false, courseId);
        return new ResponseEntity<>(participantModels, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ApiMessageResponse> changeCompleteStatus(Long participantId, boolean completeStatus) {
    	
        ParticipantModel participantModel = participantRepository.findByIsDeletedAndId(false, participantId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Attendance not found with id: " + participantId));
        participantModel.setIsCompleted(completeStatus);
        participantRepository.save(participantModel);
        return new ResponseEntity<>(new ApiMessageResponse(200, "Complete status updated successfully"), HttpStatus.OK);
    }

	@Override
	public ResponseEntity<List<ParticipantModel>> getParticipantsByProposalId(Long proposalId) {
		List<ParticipantModel> participantModels = participantRepository.findAllByIsDeletedAndProposalModel_Id(false, proposalId);
        return new ResponseEntity<>(participantModels, HttpStatus.OK);		
	}


}
