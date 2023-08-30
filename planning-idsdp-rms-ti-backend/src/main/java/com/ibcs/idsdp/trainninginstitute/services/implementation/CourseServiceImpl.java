package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.common.services.LoggedUsersService;
import com.ibcs.idsdp.common.utils.RandomGanaratorUtils;
import com.ibcs.idsdp.trainninginstitute.model.domain.CourseModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.CourseScheduleModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.Trainer;
import com.ibcs.idsdp.trainninginstitute.model.repositories.*;
import com.ibcs.idsdp.trainninginstitute.services.CourseService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.CourseRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.CourseScheduleRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiResponse;
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

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Data
@Service
public class CourseServiceImpl implements CourseService {
    private final CourseRepository courseRepository;
    private final CourseScheduleRepository courseScheduleRepository;
    private final TrainersRepository trainersRepository;
    private final RandomGanaratorUtils randomGanaratorUtils;
    private final TrainingInstituteProfileRepository trainingInstituteProfileRepository;
    private final LoggedUsersService loggedUsersService;
    private final ProposalRepository proposalRepository;

    @Transactional
    @Override
    public ResponseEntity<ApiResponse<Long>> addCourse(CourseRequest courseRequest) {

        ProposalModel proposalModel = proposalRepository.findByIsDeletedAndId(false, courseRequest.getProposalId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proposal Not Found"));

        List<CourseScheduleModel> courseScheduleModels = new ArrayList<>();
        if (courseRequest.getCourseSchedules() != null) {
            for (CourseScheduleRequest courseScheduleRequest : courseRequest.getCourseSchedules()) {
                courseScheduleRequest.setId(null);
                CourseScheduleModel courseScheduleModel = new CourseScheduleModel();

                BeanUtils.copyProperties(courseScheduleRequest, courseScheduleModel);

                List<Trainer> trainers = trainersRepository.findAllByIsDeletedAndIdIn(false, courseScheduleRequest.getSpeakers());
                courseScheduleModel.setSpeakers(trainers);

                courseScheduleModels.add(courseScheduleModel);
            }
        }


        CourseModel courseModel = new CourseModel();
        courseModel.setUuid(randomGanaratorUtils.getUuid());

        BeanUtils.copyProperties(courseRequest, courseModel);
        courseModel.setCourseScheduleModels(courseScheduleModels);
        courseModel.setM3TrainingInstituteProfileId(trainingInstituteProfileRepository.findByUserId(loggedUsersService.getLoggedUserId()).get());

        courseModel.setProposalModel(proposalModel);
        courseModel = courseRepository.save(courseModel);


        return new ResponseEntity<>(new ApiResponse<>(201, "New Course Created", courseModel.getId()), HttpStatus.CREATED);

    }

    @Override
    public ResponseEntity<PaginationResponse<List<CourseModel>>> getCourseList(int pageNo, int pageSize, String courseTitle) {
//        Sort sort = Sort.by(Sort.Direction.ASC, "createdOn");
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<CourseModel> courseModelPage = courseRepository.findByIsDeleted(false, pageable);

//        if (courseTitle == null)
//            courseModelPage = courseRepository.findByIsDeleted(false, pageable);
//        else
//            courseModelPage = courseRepository.findByIsDeletedAndCourseTitleContainsIgnoreCase(false, courseTitle, pageable);

        PaginationResponse<List<CourseModel>> paginationResponse = new PaginationResponse<>(
                pageSize, pageNo, courseModelPage.getContent().size(), courseModelPage.isLast(), courseModelPage.getTotalElements(),
                courseModelPage.getTotalPages(), courseModelPage.getContent()
        );

        if (courseModelPage.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Course Found");
        else
            return new ResponseEntity<>(paginationResponse, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ApiMessageResponse> deleteCourse(Long courseId) {
        Optional<CourseModel> courseModelOptional = courseRepository.findByIsDeletedAndId(false, courseId);
        if (courseModelOptional.isPresent()) {
            CourseModel courseModel = courseModelOptional.get();
            courseModel.setIsDeleted(true);

            courseRepository.save(courseModel);

            return new ResponseEntity<>(new ApiMessageResponse(200, "Course Deleted"), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Course Found with ID: " + courseId);
        }
    }

    @Override
    public ResponseEntity<ApiMessageResponse> editCourse(CourseRequest courseRequest, Long courseId) {
        Optional<CourseModel> courseModelOptional = courseRepository.findByIsDeletedAndId(false, courseId);
        if (courseModelOptional.isPresent()) {

            CourseModel courseModel = courseModelOptional.get();
            List<CourseScheduleModel> courseScheduleModels = new ArrayList<>();
            if (courseRequest.getCourseSchedules() != null) {
                for (CourseScheduleRequest courseScheduleRequest : courseRequest.getCourseSchedules()) {
                    boolean savedItem = true;

                    List<Trainer> trainers = trainersRepository.findAllByIsDeletedAndIdIn(false, courseScheduleRequest.getSpeakers());

                    for (CourseScheduleModel courseScheduleModel : courseModel.getCourseScheduleModels()) {

                        if (courseScheduleModel.getId().equals(courseScheduleRequest.getId())) {
                            BeanUtils.copyProperties(courseScheduleRequest, courseScheduleModel);
                            courseScheduleModels.add(courseScheduleModel);
                            courseScheduleModel.setSpeakers(trainers);
                            savedItem = false;
                        }
                    }
                    if (savedItem) {
                        CourseScheduleModel courseScheduleModel = new CourseScheduleModel(courseScheduleRequest.getSession(),
                                null,trainers, courseScheduleRequest.getTopic(), courseScheduleRequest.getDate(),
                                courseScheduleRequest.getDay(), courseScheduleRequest.getTime());
                        courseScheduleModels.add(courseScheduleModel);
                    }
                }
            }

            BeanUtils.copyProperties(courseRequest, courseModel);
            courseModel.setCourseScheduleModels(courseScheduleModels);


            ProposalModel proposalModel = proposalRepository.findByIsDeletedAndId(false, courseRequest.getProposalId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proposal Not Found"));

            courseModel.setProposalModel(proposalModel);
            courseModel = courseRepository.save(courseModel);

            return new ResponseEntity<>(new ApiMessageResponse(200, "Course Edited"), HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Course Found with ID: " + courseId);
        }
    }

    @Override
    public ResponseEntity<CourseModel> getSingleCourse(Long courseId) {
        Optional<CourseModel> courseModelOptional = courseRepository.findByIsDeletedAndId(false, courseId);
        if (courseModelOptional.isPresent()) {
            CourseModel courseModel = courseModelOptional.get();

            return new ResponseEntity<>(courseModel, HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Course Found with ID: " + courseId);
        }
    }

    @Override
    public ResponseEntity<List<CourseScheduleModel>> getAllCourseScheduleBy(Long courseScheduleId) {
        Optional<CourseModel> courseModelOptional = courseRepository.findById(courseScheduleId);
        if (courseModelOptional.isPresent()) {
            CourseModel courseModel = courseModelOptional.get();

            return new ResponseEntity<>(courseModel.getCourseScheduleModels(), HttpStatus.OK);

        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Course Found");
        }
    }

    @Override
    public ResponseEntity<CourseModel> getCourseByProposalId(Long proposalId) {
        CourseModel courseModel = courseRepository.findByIsDeletedAndProposalModel_Id(false, proposalId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No Course Found"));

        return new ResponseEntity<>(courseModel, HttpStatus.OK);
    }


}
