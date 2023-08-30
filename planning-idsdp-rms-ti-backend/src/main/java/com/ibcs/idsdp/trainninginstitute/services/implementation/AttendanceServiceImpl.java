package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.common.services.LoggedUsersService;
import com.ibcs.idsdp.common.utils.RandomGanaratorUtils;
import com.ibcs.idsdp.trainninginstitute.model.domain.*;
import com.ibcs.idsdp.trainninginstitute.model.repositories.*;
import com.ibcs.idsdp.trainninginstitute.services.AttendanceService;
import com.ibcs.idsdp.trainninginstitute.services.CourseScheduleAppService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.AttendanceRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ParticipantAttendanceRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.AttendanceResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import lombok.AllArgsConstructor;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final RandomGanaratorUtils randomGanaratorUtils;
    private final ProposalRepository proposalRepository;
    private final CourseScheduleRepository courseScheduleRepository;
    private final CourseRepository courseRepository;
    private final ParticipantRepository participantRepository;
    private final LoggedUsersService loggedUsersService;
    private final CourseScheduleAppService courseScheduleAppService;

    @Override
    public ResponseEntity<ApiMessageResponse> createAttendance(AttendanceRequest attendanceRequest) {

       // boolean isExist = attendanceRepository.existsByIsDeletedAndCourseScheduleModel_IdAndDate(false, attendanceRequest.getSessionId(), attendanceRequest.getDate());

        boolean isExistBySession = attendanceRepository.existsByIsDeletedAndCourseScheduleModel_IdAndProposalModel_Id(false, attendanceRequest.getSessionId(), attendanceRequest.getProposalId());

        if (isExistBySession) {
            return new ResponseEntity<>(new ApiMessageResponse(404, "This Session Attended Already Exist"), HttpStatus.OK);
        }
        boolean isExist = attendanceRepository.existsByIsDeletedAndCourseScheduleModel_IdAndDate(false, attendanceRequest.getSessionId(), attendanceRequest.getDate());

        if (isExist) {
            // throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attendance Already Exist");
            return new ResponseEntity<>(new ApiMessageResponse(404, "Attendance Already Exist"), HttpStatus.OK);
        }



        List<ParticipantAttendanceModel> participantAttendanceModels = new ArrayList<>();
        for (ParticipantAttendanceRequest participantAttendanceRequest : attendanceRequest.getParticipantAttendanceModels()) {
            ParticipantAttendanceModel participantAttendanceModel = new ParticipantAttendanceModel();

            ParticipantModel participantModel = participantRepository.findAllByIdAndIsDeleted(participantAttendanceRequest.getParticipantId(), false).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Participant Not Found"));

            participantAttendanceModel.setParticipantModel(participantModel);
            participantAttendanceModel.setIsPresent(participantAttendanceRequest.getIsPresent());
            participantAttendanceModel.setSpeakerComment(participantAttendanceRequest.getSpeakerComment());
            participantAttendanceModels.add(participantAttendanceModel);
        }

        AttendanceModel attendanceModel = new AttendanceModel();
        attendanceModel.setUuid(randomGanaratorUtils.getUuid());
        BeanUtils.copyProperties(attendanceRequest, attendanceModel);
//        attendanceModel.setEditable(true);

        attendanceModel.setParticipantAttendanceModels(participantAttendanceModels);

        ProposalModel proposalModel = proposalRepository.findByIsDeletedAndId(false, attendanceRequest.getProposalId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proposal not found"));
        attendanceModel.setProposalModel(proposalModel);
//        attendanceModel.setProposalId(proposalModel.getId());

        List<CourseScheduleModel> courseModel = courseScheduleAppService.getByProposalId(attendanceRequest.getProposalId()).getItems();


        /*CourseModel courseModel = courseRepository.findByIsDeletedAndProposalModel_Id(false, attendanceRequest.getProposalId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));*/

        CourseScheduleModel courseScheduleModel = courseModel.stream().filter(csm -> Objects.equals(csm.getId(), attendanceRequest.getSessionId())).findFirst().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));


//        CourseScheduleModel courseScheduleModel = courseModel.getCourseScheduleModels().stream().filter(
//                csm -> csm.getId().equals(attendanceRequest.getSessionId())
//        ).findFirst().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));
        attendanceModel.setCourseScheduleModel(courseScheduleModel);

//        Trainer trainer = courseScheduleModel.getSpeakers().stream().filter(
//                s -> s.getId().equals(attendanceRequest.getSpeakerId())
//        ).findFirst().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Speaker not found"));
//
//        attendanceModel.setTrainer(trainer);

        attendanceRepository.save(attendanceModel);

        return new ResponseEntity<>(new ApiMessageResponse(201, "Attendance Created"), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<PaginationResponse<List<AttendanceModel>>> getAttendances(int pageNo, int pageSize) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<AttendanceModel> attendanceModelPage = attendanceRepository.findAllByIsDeleted(false, pageable);
        //Check User
        List<AttendanceModel> attendanceModelList = attendanceModelPage.getContent();
        if (loggedUsersService.getLoggedUserType().equals("Rms_Training_Institute")) {
            attendanceModelList = attendanceModelList.stream().filter(res -> res.getCreatedBy().equals(loggedUsersService.getLoggedUserId())).collect(Collectors.toList());

            Pageable paging = PageRequest.of(pageNo, pageSize);
            int start = Math.min((int) paging.getOffset(), attendanceModelList.size());
            int end = Math.min((start + paging.getPageSize()), attendanceModelList.size());

            attendanceModelPage = new PageImpl<>(attendanceModelList.subList(start, end), paging, attendanceModelList.size());
        }

        PaginationResponse<List<AttendanceModel>> paginationResponse = new PaginationResponse<>(pageSize, pageNo, attendanceModelPage.getContent().size(), attendanceModelPage.isLast(), attendanceModelPage.getTotalElements(), attendanceModelPage.getTotalPages(), attendanceModelPage.getContent());

        if (attendanceModelPage.isEmpty()) return new ResponseEntity<>(paginationResponse, HttpStatus.OK);
        else return new ResponseEntity<>(paginationResponse, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ApiMessageResponse> deleteAttendance(Long attendanceId) {
        Optional<AttendanceModel> attendanceModelOptional = attendanceRepository.findByIsDeletedAndId(false, attendanceId);
        if (attendanceModelOptional.isPresent()) {
            AttendanceModel attendanceModel = attendanceModelOptional.get();
            if (!attendanceModel.isEditable())
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can't Edit Final Saved Attendance");

            attendanceModel.setIsDeleted(true);

            attendanceRepository.save(attendanceModel);

            return new ResponseEntity<>(new ApiMessageResponse(200, "Attendance Deleted"), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Attendance Found with ID: " + attendanceId);
        }
    }

    @Override
    public ResponseEntity<AttendanceResponse> getSingleAttendance(Long attendanceId) {
        Optional<AttendanceModel> attendanceModelOptional = attendanceRepository.findByIsDeletedAndId(false, attendanceId);
        if (attendanceModelOptional.isPresent()) {
            AttendanceModel attendanceModel = attendanceModelOptional.get();

            AttendanceResponse attendanceResponse = new AttendanceResponse();
            BeanUtils.copyProperties(attendanceModel, attendanceResponse);

//            CourseModel courseModel = courseRepository.findByIsDeletedAndProposalModel_Id(false, attendanceModel.getProposalModel().getId())
//                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
//
//            attendanceResponse.setCourseModel(courseModel);

            return new ResponseEntity<>(attendanceResponse, HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Attendance Found with ID: " + attendanceId);
        }
    }

    @Override
    public ResponseEntity<ApiMessageResponse> editAttendance(Long attendanceId, AttendanceRequest attendanceRequest) {
        Optional<AttendanceModel> attendanceModelOptional = attendanceRepository.findByIsDeletedAndId(false, attendanceId);
        if (attendanceModelOptional.isPresent()) {
            AttendanceModel attendanceModel = attendanceModelOptional.get();

            if (!attendanceModel.isEditable())
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can't Edit Final Saved Attendance");

            attendanceModel.setEditable(attendanceRequest.getEditable());
            attendanceModel.setDate(attendanceRequest.getDate());

            List<ParticipantAttendanceModel> participantAttendanceModels = new ArrayList<>();
            for (ParticipantAttendanceRequest participantAttendanceRequest : attendanceRequest.getParticipantAttendanceModels()) {

                boolean isAvailable = false;
                if (attendanceModel.getParticipantAttendanceModels() != null) {
                    for (ParticipantAttendanceModel participantAttendanceModel : attendanceModel.getParticipantAttendanceModels()) {
                        if (participantAttendanceModel.getParticipantModel().getId().equals(participantAttendanceRequest.getParticipantId())) {
                            participantAttendanceModel.setIsPresent(participantAttendanceRequest.getIsPresent());
                            participantAttendanceModel.setSpeakerComment(participantAttendanceRequest.getSpeakerComment());
                            participantAttendanceModels.add(participantAttendanceModel);

                            isAvailable = true;
                        }
                    }
                }


                if (!isAvailable) {
                    ParticipantAttendanceModel participantAttendanceModel = new ParticipantAttendanceModel();

                    ParticipantModel participantModel = participantRepository.findAllByIdAndIsDeleted(participantAttendanceRequest.getParticipantId(), false).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Participant Not Found"));

                    participantAttendanceModel.setParticipantModel(participantModel);

                    participantAttendanceModel.setIsPresent(participantAttendanceRequest.getIsPresent());
                    participantAttendanceModel.setSpeakerComment(participantAttendanceRequest.getSpeakerComment());
                    participantAttendanceModels.add(participantAttendanceModel);
                }


            }

            ProposalModel proposalModel = proposalRepository.findByIsDeletedAndId(false, attendanceRequest.getProposalId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proposal not found"));
            attendanceModel.setProposalModel(proposalModel);
//            attendanceModel.setProposalId(attendanceRequest.getProposalId());

            //
            List<CourseScheduleModel> courseModel = courseScheduleAppService.getByProposalId(attendanceRequest.getProposalId()).getItems();
            CourseScheduleModel courseScheduleModel = courseModel.stream().filter(csm -> Objects.equals(csm.getId(), attendanceRequest.getSessionId())).findFirst().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));

            attendanceModel.setCourseScheduleModel(courseScheduleModel);

            attendanceModel.setAttendancePhoto(attendanceRequest.getAttendancePhoto());


            //



/*
            CourseModel courseModel = courseRepository.findByIsDeletedAndProposalModel_Id(false, attendanceRequest.getProposalId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

            CourseScheduleModel courseScheduleModel = courseModel.getCourseScheduleModels().stream().filter(
                    csm -> csm.getId().equals(attendanceRequest.getSessionId())
            ).findFirst().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));
            attendanceModel.setCourseScheduleModel(courseScheduleModel);

//            Trainer trainer = courseScheduleModel.getSpeakers().stream().filter(
//                    s -> s.getId().equals(attendanceRequest.getSpeakerId())
//            ).findFirst().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Speaker not found"));
//            attendanceModel.setTrainer(trainer);
//            attendanceModel.setParticipantAttendanceModels(participantAttendanceModels);*/

            attendanceRepository.save(attendanceModel);

            return new ResponseEntity<>(new ApiMessageResponse(200, "Attendance Edited"), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Attendance Found with ID: " + attendanceId);
        }
    }

    @Override
    public ResponseEntity<ApiMessageResponse> checkIsExistsAttendance(AttendanceRequest attendanceRequest) {
        boolean isExistBySession = attendanceRepository.existsByIsDeletedAndCourseScheduleModel_IdAndProposalModel_Id(false, attendanceRequest.getSessionId(), attendanceRequest.getProposalId());

        if (isExistBySession) {
            return new ResponseEntity<>(new ApiMessageResponse(422, "This Session Attended Already Exist"), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ApiMessageResponse(200, "Ok to create new One"), HttpStatus.OK);
    }

	@Override
	public ResponseEntity<List<AttendanceModel>> findAllByParticipantId(Long participantId) {
		 List<AttendanceModel> list = attendanceRepository.findAllByParticipantId(participantId);
		 if(list!=null && !CollectionUtils.isEmpty(list)) {
			 return new ResponseEntity<>(list, HttpStatus.OK);
		 }else {
			 throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Attendance Found with ID: " + participantId);
		 }
	}

}
