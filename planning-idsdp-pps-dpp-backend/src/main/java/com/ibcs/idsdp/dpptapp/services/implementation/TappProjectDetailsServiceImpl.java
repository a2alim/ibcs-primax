package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.TappProjectDetails;
import com.ibcs.idsdp.dpptapp.model.repositories.TappObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.TappProjectDetailsRepository;
import com.ibcs.idsdp.dpptapp.services.TappProjectDetailsService;
import com.ibcs.idsdp.dpptapp.web.dto.request.TappProjectDetailsRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@AllArgsConstructor
@Transactional
public class TappProjectDetailsServiceImpl implements TappProjectDetailsService {
    private  TappProjectDetailsRepository tappProjectDetailsRepository;
    private final IdGeneratorComponent idGeneratorComponent;
    private final TappObjectiveCostRepository masterRepo;

    /**
     * For create tapp project details records
     * @param request
     * @return
     */
    @Override
    public ResponseStatus save(TappProjectDetailsRequest request) {

        /*--------Data will be save into the database table--------*/
//        if (request.getUuid().isEmpty()) {
            TappProjectDetails tappProjectDetails = new TappProjectDetails();

            /*-------Store all request value in tappProjectDetailsSave-------*/
            BeanUtils.copyProperties(request, tappProjectDetails);
            tappProjectDetails.setUuid(idGeneratorComponent.generateUUID());
            tappProjectDetails.setCreatedBy("admin");
            tappProjectDetails.setTappMasterId(masterRepo.findByProjectConceptUuidAndIsDeleted(request.getPcUuid(), false).get());
            tappProjectDetails.setCreatedOn(LocalDate.now());
            tappProjectDetails.setIsDeleted(false);

            tappProjectDetailsRepository.save(tappProjectDetails);
            return new ResponseStatus(1, "Data saved successfully!");

//        } else {
//
//            /*--------Data will be update into the database table--------*/
//            Optional<TappProjectDetails> tappProjectDetailsOptional = tappProjectDetailsRepository.findByUuid(request.getUuid());
//            TappProjectDetails tappProjectDetails = tappProjectDetailsOptional.get();
//
//            /*-------Store all request value in tappProjectDetails-------*/
//            BeanUtils.copyProperties(request,tappProjectDetails);
//            tappProjectDetails.setUuid(idGeneratorComponent.generateUUID());
//            tappProjectDetails.setUpdatedBy("admin");
//            tappProjectDetails.setUpdatedOn(LocalDate.now());
//            tappProjectDetails.setIsDeleted(false);
//
//            tappProjectDetailsRepository.save(tappProjectDetails);
//            return new ResponseStatus(1, "Data updated successfully!");
//        }
    }

    public ResponseStatus updateProjectDetails(TappProjectDetailsRequest request, String pcUuid){
        Optional<TappProjectDetails> optional = tappProjectDetailsRepository.findByPcUuid(pcUuid);
        TappProjectDetails tappProjectDetails = optional.get();
        /*-------Store all request value in tappProjectDetails-------*/
        BeanUtils.copyProperties(request,tappProjectDetails);
        tappProjectDetails.setUuid(idGeneratorComponent.generateUUID());
        tappProjectDetails.setUpdatedBy("admin");
        tappProjectDetails.setUpdatedOn(LocalDate.now());
        tappProjectDetails.setIsDeleted(false);

        tappProjectDetailsRepository.save(tappProjectDetails);
        return new ResponseStatus(1, "Data updated successfully!");
    }

    /**
     * For get tapp project details records
     * @return
     */
    public TappProjectDetails getFirstRowData (){
        Optional<TappProjectDetails> tappProjectDetails =  tappProjectDetailsRepository.findAll().stream().findFirst();
        return tappProjectDetails.get();
    }

    /**
     * For get tapp project details records
     * @return
     */
    public ResponseWithResults getProjectDetailsData(String pcUuid){
        Optional<TappProjectDetails> optional = tappProjectDetailsRepository.findByPcUuid(pcUuid);
        if(!optional.isPresent()){
            return new ResponseWithResults(0, "not found","");
        }else{
            TappProjectDetails projectDetails = optional.get();
            TappProjectDetailsRequest request = new TappProjectDetailsRequest();
            BeanUtils.copyProperties(projectDetails, request);
            return new ResponseWithResults(1, "success", request);
        }

    }


}
