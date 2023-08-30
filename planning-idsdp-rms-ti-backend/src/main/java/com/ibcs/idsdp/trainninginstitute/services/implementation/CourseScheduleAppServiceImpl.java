package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.trainninginstitute.model.domain.CourseScheduleModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.Trainer;
import com.ibcs.idsdp.trainninginstitute.model.repositories.CourseScheduleRepositoryNew;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ProposalRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TrainersRepository;
import com.ibcs.idsdp.trainninginstitute.services.CourseScheduleAppService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.CourseScheduleRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.CourseScheduleResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import com.ibcs.idsdp.util.Response;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseScheduleAppServiceImpl extends BaseService<CourseScheduleModel, CourseScheduleRequest, CourseScheduleResponse> implements CourseScheduleAppService {


    private final CourseScheduleRepositoryNew courseScheduleRepositoryNew;
    private final ProposalRepository proposalRepository;
    private final TrainersRepository trainersRepository;


    protected CourseScheduleAppServiceImpl(ServiceRepository<CourseScheduleModel> repository, CourseScheduleRepositoryNew courseScheduleRepositoryNew, ProposalRepository proposalRepository, TrainersRepository trainersRepository) {
        super(repository);
        this.courseScheduleRepositoryNew = courseScheduleRepositoryNew;
        this.proposalRepository = proposalRepository;
        this.trainersRepository = trainersRepository;
    }


    @Override
    protected CourseScheduleModel convertForCreate(CourseScheduleRequest dto) {

        CourseScheduleModel entity = super.convertForCreate(dto);
        Optional<ProposalModel> optional = proposalRepository.findByIsDeletedAndId(false, dto.getProposalId());
        List<Trainer> trainers = trainersRepository.findAllByIsDeletedAndIdIn(false, dto.getSpeakers());

        if (optional.isPresent()) {
            entity.setProposalModel(optional.get());
        }
        entity.setSpeakers(trainers);
        return entity;
    }

    @Override
    protected void convertForUpdate(CourseScheduleRequest dto, CourseScheduleModel entity) {

        super.convertForUpdate(dto, entity);
        Optional<ProposalModel> optional = proposalRepository.findByIsDeletedAndId(false, dto.getProposalId());
        List<Trainer> trainers = trainersRepository.findAllByIsDeletedAndIdIn(false, dto.getSpeakers());

        if (optional.isPresent()) {
            entity.setProposalModel(optional.get());
        }
        entity.setSpeakers(trainers);

    }


    @Override
    public ResponseEntity<PaginationResponse<List<CourseScheduleModel>>> getCourseScheduleList(String instituteName, int pageNo, int pageSize, Long proposalId) {

        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<CourseScheduleModel> courseScheduleModelPage = courseScheduleRepositoryNew.findAllByIsDeletedAndProposalModel(false, pageable, new ProposalModel() {{
            setId(proposalId);
        }});
        List<CourseScheduleModel> researchBudgetModeList = courseScheduleModelPage.get().collect(Collectors.toList());
        courseScheduleModelPage = new PageImpl<CourseScheduleModel>(researchBudgetModeList, pageable, researchBudgetModeList.size());

        PaginationResponse<List<CourseScheduleModel>> paginationResponse = new PaginationResponse<>(
                pageSize, pageNo, courseScheduleModelPage.getContent().size(), courseScheduleModelPage.isLast(),
                courseScheduleModelPage.getTotalElements(), courseScheduleModelPage.getTotalPages(), courseScheduleModelPage.getContent()
        );
        if (courseScheduleModelPage.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Research Budget Found");
        else
            return new ResponseEntity<>(paginationResponse, HttpStatus.OK);
    }

    @Override
    public Response<CourseScheduleModel> getByProposalId(Long proposalId) {
        Optional<ProposalModel> proposalModel = proposalRepository.findByIdAndIsDeleted(proposalId,false);
        if (proposalModel.isPresent()) {
            ProposalModel proposalModel1 = proposalModel.get();

            List<CourseScheduleModel> courseScheduleModel = courseScheduleRepositoryNew.findAllByProposalModelAndIsDeleted(proposalModel1, false);

            if (courseScheduleModel.isEmpty()) {
                return getErrorResponse("Data Empty");
            } else {
                Response<CourseScheduleModel> response = new Response<>();
               // List<CourseScheduleResponse> courseScheduleResponses = super.convertForRead(courseScheduleModel);
                response.setSuccess(true);
                response.setMessage("Data Found");
                response.setItems(courseScheduleModel);
                return response;


            }


        }
        return getErrorResponse("Data Not Found");
    }

}
