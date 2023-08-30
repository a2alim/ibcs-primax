package com.ibcs.idsdp.trainninginstitute.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingInstituteProfileModel;
import com.ibcs.idsdp.trainninginstitute.services.TrainingInstituteProfileService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.TrainingInstituteProfileRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiResponse;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author moniruzzaman.rony
 * @create 12/4/21
 * @github `https://github.com/moniruzzamanrony`
 */

@RestApiController
@AllArgsConstructor
@RequestMapping("training-institute-profile")
public class TrainingInstituteProfileController {

    private final TrainingInstituteProfileService trainingInstituteProfileService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TrainingInstituteProfileModel>>> getTrainingInstituteList(){
        return trainingInstituteProfileService.getTrainingInstituteList();
    }

    @PostMapping()
    public ResponseEntity saveOrUpdateProfile(@RequestBody TrainingInstituteProfileRequest TrainingInstituteProfileRequest) {
        return trainingInstituteProfileService.saveOrUpdateProfile(TrainingInstituteProfileRequest);
    }

    @GetMapping("/{id}")
    public ResponseEntity saveOrUpdateProfile(@PathVariable("id") String id) {
        return trainingInstituteProfileService.getTrainingInstituteProfileById(id);
    }

    @GetMapping("/{offset}/{pageSize}")
    public Response getTrainersByProfileId( @PathVariable int offset, @PathVariable int pageSize){
        return trainingInstituteProfileService.getProfileList(offset,pageSize);

    }
}
