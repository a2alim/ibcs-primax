package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.common.utils.RandomGanaratorUtils;
import com.ibcs.idsdp.trainninginstitute.model.domain.*;
import com.ibcs.idsdp.trainninginstitute.model.repositories.*;
import com.ibcs.idsdp.trainninginstitute.services.SpeakerEvaluationService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.SpeakerEvaluationQuestionRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.SpeakerEvaluationRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import lombok.Data;
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

@Service
@Data
public class SpeakerEvaluationServiceImpl implements SpeakerEvaluationService {
    private final SpeakerEvaluationRepository speakerEvaluationRepository;
    private final ProposalRepository proposalRepository;
    private final CourseScheduleRepository courseScheduleRepository;
    private final TrainersRepository trainersRepository;
    private final RandomGanaratorUtils randomGanaratorUtils;
    private final ParticipantRepository participantRepository;
    private final AttendanceRepository attendanceRepository;

    @Override
    public ResponseEntity<ApiMessageResponse> addEvaluation(SpeakerEvaluationRequest speakerEvaluationRequest) {
        SpeakerEvaluationModel speakerEvaluationModel = new SpeakerEvaluationModel();


        AttendanceModel attendanceModel =
                attendanceRepository.findByIsDeletedAndProposalModel_IdAndCourseScheduleModel_IdAndTrainer_Id(
                        false, speakerEvaluationRequest.getProposalId(), speakerEvaluationRequest.getCourseScheduleId(), speakerEvaluationRequest.getTrainerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Attendance Not Found"));

        List<ParticipantAttendanceModel> participantAttendanceModels = attendanceModel.getParticipantAttendanceModels();

        ParticipantAttendanceModel participantAttendanceModel = participantAttendanceModels.stream()
                .filter(pam -> pam.getParticipantModel().getId().equals(speakerEvaluationRequest.getParticipantId()))
                .findFirst().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Participant Not Found on Attendance"));

        if(!participantAttendanceModel.getIsPresent()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You are Not Present on that session");
        }

        boolean isAlreadyExist = speakerEvaluationRepository
                .existsByIsDeletedAndProposalModel_IdAndCourseScheduleModel_IdAndTrainer_IdAndParticipantModel_Id(false,
                        speakerEvaluationRequest.getProposalId(), speakerEvaluationRequest.getCourseScheduleId(),
                        speakerEvaluationRequest.getTrainerId(), speakerEvaluationRequest.getParticipantId());

        if(isAlreadyExist)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You Already Submitted this classes evaluation");

        ProposalModel proposalModel = proposalRepository.findByIsDeletedAndId(false, speakerEvaluationRequest.getProposalId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proposal Not Found."));

        CourseScheduleModel courseScheduleModel = courseScheduleRepository.findByIsDeletedAndId(false, speakerEvaluationRequest.getCourseScheduleId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course Schedule Not Found."));

        Trainer trainer = trainersRepository.findByIdAndIsDeleted(speakerEvaluationRequest.getTrainerId(), false)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trainer Not Found."));

        ParticipantModel participantModel = participantRepository.findByIsDeletedAndId(false, speakerEvaluationRequest.getParticipantId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Participant Not Found."));

        BeanUtils.copyProperties(speakerEvaluationRequest, speakerEvaluationModel);
        speakerEvaluationModel.setProposalModel(proposalModel);
        speakerEvaluationModel.setCourseScheduleModel(courseScheduleModel);
        speakerEvaluationModel.setTrainer(trainer);
        speakerEvaluationModel.setParticipantModel(participantModel);
        speakerEvaluationModel.setUuid(randomGanaratorUtils.getUuid());


        List<SpeakerEvaluationQuestionModel> speakerEvaluationQuestionModelList = new ArrayList<>();
        if (speakerEvaluationRequest.getSpeakerEvaluationQuestionModels() != null) {
            for (SpeakerEvaluationQuestionRequest speakerEvaluationQuestionRequest : speakerEvaluationRequest.getSpeakerEvaluationQuestionModels()) {
                SpeakerEvaluationQuestionModel speakerEvaluationQuestionModel = new SpeakerEvaluationQuestionModel();
                speakerEvaluationQuestionModel.setUuid(randomGanaratorUtils.getUuid());
                BeanUtils.copyProperties(speakerEvaluationQuestionRequest, speakerEvaluationQuestionModel);
                speakerEvaluationQuestionModelList.add(speakerEvaluationQuestionModel);
            }
        }

        System.out.println(speakerEvaluationQuestionModelList.toString());

        speakerEvaluationModel.setSpeakerEvaluationQuestionModels(speakerEvaluationQuestionModelList);

        speakerEvaluationRepository.save(speakerEvaluationModel);

        return new ResponseEntity<>(new ApiMessageResponse(201,"Evaluation Submitted Successfully"), HttpStatus.OK);

    }

    @Override
    public ResponseEntity<PaginationResponse<List<SpeakerEvaluationModel>>> getEvaluation(int pageNo, int pageSize, Long evaluationId) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<SpeakerEvaluationModel> speakerEvaluationModelPage;

        if (evaluationId == null)
            speakerEvaluationModelPage = speakerEvaluationRepository.findByIsDeleted(false, pageable);
        else {
            speakerEvaluationModelPage = speakerEvaluationRepository.findByIdAndIsDeleted(evaluationId, false, pageable);
        }

        PaginationResponse<List<SpeakerEvaluationModel>> paginationResponse = new PaginationResponse<>(
                pageNo, pageSize, speakerEvaluationModelPage.getContent().size(), speakerEvaluationModelPage.isLast(),
                speakerEvaluationModelPage.getTotalElements(), speakerEvaluationModelPage.getTotalPages(), speakerEvaluationModelPage.getContent()
        );

        if (speakerEvaluationModelPage.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Speaker Evaluation Found");
        } else {
            return new ResponseEntity<>(paginationResponse, HttpStatus.OK);
        }
    }

    @Override
    public ResponseEntity<ApiMessageResponse> deleteEvaluation(Long evaluationId) {
        Optional<SpeakerEvaluationModel> speakerEvaluationModelOptional = speakerEvaluationRepository.findByIsDeletedAndId(false, evaluationId);
        if (speakerEvaluationModelOptional.isPresent()) {
            SpeakerEvaluationModel speakerEvaluationModel = speakerEvaluationModelOptional.get();
            speakerEvaluationModel.setIsDeleted(true);

            speakerEvaluationRepository.save(speakerEvaluationModel);

            return new ResponseEntity<>(new ApiMessageResponse(200, "Speaker Evaluation is Deleted!"), HttpStatus.OK);
        } else throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evaluation Not found or already deleted.");
    }
}
