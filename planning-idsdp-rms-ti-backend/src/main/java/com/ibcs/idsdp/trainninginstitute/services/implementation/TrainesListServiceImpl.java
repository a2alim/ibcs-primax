package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainersList;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingInstituteProfileModel;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TrainersListRepo;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TrainingInstituteProfileRepository;
import com.ibcs.idsdp.trainninginstitute.services.TrainesListService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.TrainersListRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TrainersListResponse;
import com.ibcs.idsdp.util.Response;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Created by : rakibul.hasan on 3/27/2022 5:33 PM
 * github : https://github.com/rhmtechno
 */
@Service
@Transactional
public class TrainesListServiceImpl extends BaseService<TrainersList, TrainersListRequest, TrainersListResponse> implements TrainesListService {

    private final TrainersListRepo trainersListRepo;
    private final TrainingInstituteProfileRepository instituteProfileRepository;

    public TrainesListServiceImpl(ServiceRepository<TrainersList> repository, TrainersListRepo trainersListRepo, TrainingInstituteProfileRepository instituteProfileRepository) {
        super(repository);
        this.trainersListRepo = trainersListRepo;
        this.instituteProfileRepository = instituteProfileRepository;
    }

    @Override
    public Response create(TrainersListRequest trainersListRequest) {
        Optional<TrainingInstituteProfileModel> probile = instituteProfileRepository.findById(trainersListRequest.getProfileId());
        probile.ifPresent(trainersListRequest::setProfileModel);
        return super.create(trainersListRequest);
    }

    @Override
    protected List<TrainersListResponse> convertForRead(List<TrainersList> e) {
        return super.convertForRead(e);
    }

    @Override
    public Response getTrainersListByProfileId(Long profileId, int offset, int pageSize) {
        Optional<TrainingInstituteProfileModel> byId = instituteProfileRepository.findById(profileId);
        Response<TrainersListResponse> response = new Response<>();
        if (byId.isPresent()) {
            Page<TrainersList> trainersLists = trainersListRepo.findByProfileModelAndIsDeleted(byId.get(), false, PageRequest.of(offset, pageSize));
            if (trainersLists.getSize() > 0) {
                response.setMessage("Data Found");
                response.setSuccess(true);
                response.setPage(trainersLists);
                return response;

            }

        }

        return getErrorResponse("Data Not Found");

    }

    @Override
    public Response getTrainersListByProfileIdWithoutPagination(Long profileId) {
        Optional<TrainingInstituteProfileModel> byId = instituteProfileRepository.findById(profileId);
        Response<TrainersListResponse> response = new Response<>();
        if (byId.isPresent()) {
            List<TrainersList> byProfileModelAndIsDeletedOrderByIdDesc = trainersListRepo.findByProfileModelAndIsDeletedOrderByIdDesc(byId.get(), false);
            if (!byProfileModelAndIsDeletedOrderByIdDesc.isEmpty()) {
                response.setMessage("Data Found");
                response.setSuccess(true);
                response.setItems(convertForRead(byProfileModelAndIsDeletedOrderByIdDesc));
                return response;
            }
        }
        return getErrorResponse("Data Not Found");

    }

    @Override
    public Response getTrainersListByUserIdWithoutPagination(Long userId) {
        Optional<TrainingInstituteProfileModel> byId = instituteProfileRepository.findByUserId(String.valueOf(userId));
        Response<TrainersListResponse> response = new Response<>();
        if (byId.isPresent()) {
            List<TrainersList> byProfileModelAndIsDeletedOrderByIdDesc = trainersListRepo.findByProfileModelAndIsDeletedOrderByIdDesc(byId.get(), false);
            if (!byProfileModelAndIsDeletedOrderByIdDesc.isEmpty()) {
                response.setMessage("Data Found");
                response.setSuccess(true);
                response.setItems(convertForRead(byProfileModelAndIsDeletedOrderByIdDesc));
                return response;
            }
        }
        return getErrorResponse("Data Not Found");
    }

}
