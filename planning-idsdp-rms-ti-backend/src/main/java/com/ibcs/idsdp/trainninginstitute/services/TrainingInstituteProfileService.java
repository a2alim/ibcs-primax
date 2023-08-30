package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingInstituteProfileModel;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.TrainingInstituteProfileRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiResponse;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.ResponseEntity;

import java.util.List;

/**
 * @author moniruzzaman.rony
 * @create 12/4/21
 * @github `https://github.com/moniruzzamanrony`
 * @modify 2/1/22
 */
public interface TrainingInstituteProfileService {
    ResponseEntity saveOrUpdateProfile(TrainingInstituteProfileRequest trainingInstituteProfileRequest);

    ResponseEntity getTrainingInstituteProfileById(String id);

    ResponseEntity<ApiResponse<List<TrainingInstituteProfileModel>>> getTrainingInstituteList();

    Response getProfileList(int offset, int pageSize);
}
