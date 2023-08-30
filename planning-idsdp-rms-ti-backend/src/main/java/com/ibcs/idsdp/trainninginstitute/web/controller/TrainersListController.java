package com.ibcs.idsdp.trainninginstitute.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainersList;
import com.ibcs.idsdp.trainninginstitute.services.TrainesListService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.TrainersListRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TrainersListResponse;
import com.ibcs.idsdp.util.Response;

/**
 * Created by : rakibul.hasan on 3/27/2022 5:29 PM
 * github : https://github.com/rhmtechno
 */
@RestApiController
@RequestMapping("api/trainers-list")
public class TrainersListController extends BaseController<TrainersList, TrainersListRequest, TrainersListResponse> {

    private  final TrainesListService trainesListService;

    public TrainersListController(BaseService<TrainersList, TrainersListRequest, TrainersListResponse> service, TrainesListService trainesListService) {
        super(service);
        this.trainesListService = trainesListService;
    }

@GetMapping("/profile/{ProfileId}/{offset}/{pageSize}")
    public Response getTrainersByProfileId(@PathVariable Long ProfileId,@PathVariable int offset, @PathVariable int pageSize){
       return trainesListService.getTrainersListByProfileId(ProfileId,offset,pageSize);

    }
/*for get Trainers by Profile Id*/
@GetMapping("/profile/{ProfileId}")
    public Response getTrainersByProfileIdWithoutPagination(@PathVariable Long ProfileId){
	System.out.println();
        return trainesListService.getTrainersListByProfileIdWithoutPagination(ProfileId);

    }
    /*for get Trainers by User Id*/
    @GetMapping("/profile/by-user-id/{userId}")
    public Response getTrainersListByUserIdWithoutPagination(@PathVariable Long userId){
        return trainesListService.getTrainersListByUserIdWithoutPagination(userId);

    }


}
