package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.common.utils.RandomGanaratorUtils;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingInstituteProfileModel;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TrainingInstituteProfileRepository;
import com.ibcs.idsdp.trainninginstitute.services.TrainingInstituteProfileService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.TrainingInstituteProfileRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiResponse;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * @author moniruzzaman.rony
 * @create 12/4/21
 * @github `https://github.com/moniruzzamanrony`
 * @modify 2/1/22
 */

@Service
@AllArgsConstructor
public class TrainingInstituteProfileServiceImpl implements TrainingInstituteProfileService {

    private final TrainingInstituteProfileRepository trainingInstituteProfileRepository;
    private final RandomGanaratorUtils ganaratorUtils;

    @Transactional
    @Override
    public ResponseEntity saveOrUpdateProfile(TrainingInstituteProfileRequest trainingInstituteProfileRequest) {
        Optional<TrainingInstituteProfileModel> trainingInstituteProfileModelOptional = trainingInstituteProfileRepository.findByUserId(trainingInstituteProfileRequest.getUserId());
        TrainingInstituteProfileModel trainingInstituteProfileModel = new TrainingInstituteProfileModel();
        if (!trainingInstituteProfileModelOptional.isPresent()) {
            BeanUtils.copyProperties(trainingInstituteProfileRequest, trainingInstituteProfileModel);
            trainingInstituteProfileModel.setUuid( ganaratorUtils.getUuid());
            trainingInstituteProfileRepository.save(trainingInstituteProfileModel);
        } else {
            trainingInstituteProfileModel = trainingInstituteProfileModelOptional.get();
            BeanUtils.copyProperties(trainingInstituteProfileRequest, trainingInstituteProfileModel);
            trainingInstituteProfileRepository.save(trainingInstituteProfileModel);
        }
        return new ResponseEntity(trainingInstituteProfileModel, HttpStatus.OK);
    }

    @Override
    public ResponseEntity getTrainingInstituteProfileById(String id) {
        Optional<TrainingInstituteProfileModel> trainingInstituteProfileModelOptional = trainingInstituteProfileRepository.findByUserId(String.valueOf(id));
        return new ResponseEntity(trainingInstituteProfileModelOptional.get(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ApiResponse<List<TrainingInstituteProfileModel>>> getTrainingInstituteList() {
        List<TrainingInstituteProfileModel> trainingInstituteProfileModelList = trainingInstituteProfileRepository.findByIsDeleted(false);
        return new ResponseEntity<>(new ApiResponse<>(200,"Institute Found",trainingInstituteProfileModelList),HttpStatus.OK);
    }

    @Override
    public Response getProfileList(int offset, int pageSize) {
        Response<TrainingInstituteProfileModel> response=new Response<>();
      Page<TrainingInstituteProfileModel> profileModelList=  trainingInstituteProfileRepository.findAllByIsDeletedOrderByIdDesc(false, PageRequest.of(offset, pageSize));
      if(profileModelList.getSize() > 0){
          response.setMessage("Data Found");
          response.setSuccess(true);
          response.setPage(profileModelList);

      }else{
          response.setMessage("Data Not Found");
          response.setSuccess(false);
      }
        return response;

    }
}
