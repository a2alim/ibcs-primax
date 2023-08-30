package com.ibcs.idsdp.rdpprtapp.services.implementation.tappAnnexurs;

import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.client.ConfigurationClientService;
import com.ibcs.idsdp.rdpprtapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.rdpprtapp.model.domain.tappAnnexurs.TappAnnexureGoods;
import com.ibcs.idsdp.rdpprtapp.model.domain.tappAnnexurs.TappAnnexureGoodsDetails;
import com.ibcs.idsdp.rdpprtapp.model.repositories.tappAnnexurs.TappAnnexureGoodsDetailsRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.tappAnnexurs.TappAnnexureGoodsRepository;
import com.ibcs.idsdp.rdpprtapp.services.tappAnnexurs.TappAnnexureGoodService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.tappAnnexurs.TappAnnexureGoodSaveWithChildRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.tappAnnexurs.TappAnnexureGoodsDetailsRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.tappAnnexurs.TappAnnexureGoodsRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.TappAnnexureGoodsDetailsDto;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@AllArgsConstructor
public class TappAnnexureGoodServiceImp implements TappAnnexureGoodService {

    private TappAnnexureGoodsRepository tappAnnexureGoodsRepository;
    private TappAnnexureGoodsDetailsRepository tappAnnexureGoodsDetailsRepository;
    private ProjectConceptClientService projectConceptClientService;
    private ConfigurationClientService configurationClientService;

    /**
     * For get all tapp annexure goods records
     * @return
     */
    @Override
    public List<TappAnnexureGoods> getListData(){
        return tappAnnexureGoodsRepository.findAll();
    }


    //public TappAnnexureGoodSaveWithChildRequest saveWithChild(TappAnnexureGoodSaveWithChildRequest request){
    /**
     * Cor create tapp annexure goods records
     * @param request
     * @return
     */
    @Override
    public ResponseWithResults saveWithChild(TappAnnexureGoodSaveWithChildRequest request){

        Integer status = 0;
        String message = "";

        try {
            ProjectConceptResponse projectConceptResponse = projectConceptClientService.getProjectConceptByUuid(request.getProjectConceptUuid());
            if(projectConceptResponse.getId() < 1)
            {
                return new ResponseWithResults(status, "Project not found!", "");
            }
            else{
                /*--------Data will be save into the database table--------*/
                if(request.getUuid().isEmpty()){
                    TappAnnexureGoods tappAnnexureGoods = new TappAnnexureGoods();
                    BeanUtils.copyProperties(request, tappAnnexureGoods);
                    tappAnnexureGoods.setUuid(UUID.randomUUID().toString());
                    tappAnnexureGoods.setProjectConceptUuid(projectConceptResponse.getUuid());
                    tappAnnexureGoods.setProjectConceptMasterId(projectConceptResponse.getId());
                    tappAnnexureGoods.setCreatedBy("admin");
                    tappAnnexureGoods.setCreatedOn(LocalDate.now());
                    tappAnnexureGoods.setIsDeleted(false);
                    tappAnnexureGoodsRepository.save(tappAnnexureGoods);

                    /*--------At a time multiple data will be save into the database child table--------*/
                    for (TappAnnexureGoodsDetailsRequest requestVal : request.getList()){
                        TappAnnexureGoodsDetails tappAnnexureGoodsDetails = new TappAnnexureGoodsDetails();
                        BeanUtils.copyProperties(requestVal, tappAnnexureGoodsDetails);
                        tappAnnexureGoodsDetails.setUuid(UUID.randomUUID().toString());
                        tappAnnexureGoodsDetails.setTappAnnexureGoods(tappAnnexureGoods); //For Foreign key

                        tappAnnexureGoodsDetails.setCreatedBy("admin");
                        tappAnnexureGoodsDetails.setCreatedOn(LocalDate.now());
                        tappAnnexureGoodsDetails.setIsDeleted(false);
                        tappAnnexureGoodsDetailsRepository.save(tappAnnexureGoodsDetails);
                    }
                    status = 1;
                    message = "Data saved successfully!";
                }
                else
                {
                    /*--------Data will be update into the database table--------*/
                    Optional<TappAnnexureGoods> tappAnnexureGoodsOptional = tappAnnexureGoodsRepository.findByUuidAndIsDeleted(request.getUuid(), false);
                    TappAnnexureGoods tappAnnexureGoods = tappAnnexureGoodsOptional.get();

                    BeanUtils.copyProperties(request, tappAnnexureGoods);
                    tappAnnexureGoods.setProjectConceptUuid(projectConceptResponse.getUuid());
                    tappAnnexureGoods.setProjectConceptMasterId(projectConceptResponse.getId());
                    tappAnnexureGoods.setUpdatedBy("admin");
                    tappAnnexureGoods.setUpdatedOn(LocalDate.now());
                    tappAnnexureGoods.setIsDeleted(false);
                    tappAnnexureGoodsRepository.save(tappAnnexureGoods);

                    for(TappAnnexureGoodsDetailsRequest requestVal: request.getList()){
                        if(!requestVal.getUuid().isEmpty()){
                            /*------Update data------*/
                            Optional<TappAnnexureGoodsDetails> tappAnnexureGoodsDetailsOptional = tappAnnexureGoodsDetailsRepository.findByUuidAndIsDeleted(requestVal.getUuid(), false);
                            TappAnnexureGoodsDetails tappAnnexureGoodsDetails = tappAnnexureGoodsDetailsOptional.get();
                            BeanUtils.copyProperties(requestVal, tappAnnexureGoodsDetails);
                            tappAnnexureGoodsDetails.setUpdatedBy("admin");
                            tappAnnexureGoodsDetails.setUpdatedOn(LocalDate.now());
                            tappAnnexureGoodsDetails.setIsDeleted(false);
                            tappAnnexureGoodsDetailsRepository.save(tappAnnexureGoodsDetails);
                        }
                        else
                        {
                            /*------New data will be save into the database table------*/
                            TappAnnexureGoodsDetails tappAnnexureGoodsDetails = new TappAnnexureGoodsDetails();
                            BeanUtils.copyProperties(requestVal, tappAnnexureGoodsDetails);
                            tappAnnexureGoodsDetails.setTappAnnexureGoods(tappAnnexureGoods); //For Foreign key
                            tappAnnexureGoodsDetails.setUuid(UUID.randomUUID().toString());
                            tappAnnexureGoodsDetails.setCreatedBy("admin");
                            tappAnnexureGoodsDetails.setCreatedOn(LocalDate.now());
                            tappAnnexureGoodsDetails.setIsDeleted(false);
                            tappAnnexureGoodsDetailsRepository.save(tappAnnexureGoodsDetails);
                        }
                    }
                    status = 1;
                    message = "Data saved successfully!";
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ResponseWithResults(status, message, request);
    }

    /**
     * Get tapp annexure goods data by form type
     * @param formType
     * @return
     */
    @Override
    public ResponseWithResults getDataByFormType(String formType, Long rtappMasterId, Boolean isDelete){
        TappAnnexureGoodsRequest response = new TappAnnexureGoodsRequest();
        TappAnnexureGoods tappAnnexureGoods = tappAnnexureGoodsRepository.findTopByFormTypeAndRtappMasterIdAndIsDeleted(formType, rtappMasterId, isDelete);

        if(tappAnnexureGoods != null){
            response.setId(tappAnnexureGoods.getId());
            response.setProjectConceptUuid(tappAnnexureGoods.getProjectConceptUuid());
            response.setUuid(tappAnnexureGoods.getUuid());
            response.setStatus(tappAnnexureGoods.getStatus());
            response.setFormType(tappAnnexureGoods.getFormType());
            response.setRtappMasterId(tappAnnexureGoods.getRtappMasterId());
            response.setTotalAmount(tappAnnexureGoods.getTotalAmount());

            List<TappAnnexureGoodsDetails> tappAnnexureGoodsDetails = tappAnnexureGoodsDetailsRepository.findByTappAnnexureGoodsIdAndIsDeleted(tappAnnexureGoods.getId(), false);
            List<TappAnnexureGoodsDetailsDto> tappAnnexureGoodsDetailsDto = new ArrayList<>();
            for (TappAnnexureGoodsDetails annexure : tappAnnexureGoodsDetails) {
                TappAnnexureGoodsDetailsDto ann = new TappAnnexureGoodsDetailsDto();
                BeanUtils.copyProperties(annexure, ann);
                ann.setUnitType(configurationClientService.getUnitNameById(ann.getUnitId()));
                ann.setProcurementType(configurationClientService.getProcurementTypeById(ann.getProcurementTypeId()));
                ann.setProcurementMethod(configurationClientService.getProcurementMethodById(ann.getProcurementMethodId()));
                tappAnnexureGoodsDetailsDto.add(ann);
            }
            response.setList(tappAnnexureGoodsDetailsDto);
            return new ResponseWithResults(1, "Success", response);
        }
        else{
            return new ResponseWithResults(0, "Success", "");
        }
    }

    /*--------Data will be delete from the database table--------*/
    /**
     * Data will be delete from the database table
     * @param uuid
     * @return
     */
    public ResponseEntity<ResponseStatus> deleteRow(String uuid){
        Optional<TappAnnexureGoodsDetails> tappDetails = tappAnnexureGoodsDetailsRepository.findByUuid(uuid);
        if(tappDetails.isPresent())
        {
            TappAnnexureGoodsDetails tappAnnexureGoodsDetails = tappDetails.get();
            tappAnnexureGoodsDetails.setIsDeleted(true);
            tappAnnexureGoodsDetails.setUpdatedBy("admin");
            tappAnnexureGoodsDetails.setUpdatedOn(LocalDate.now());
            tappAnnexureGoodsDetailsRepository.save(tappAnnexureGoodsDetails);
            return new ResponseEntity(new ResponseStatus(1, "Data deleted successfully"), HttpStatus.OK);
        }
        else
        {
            return new ResponseEntity( new ResponseStatus(0, "Data deletion failed"), HttpStatus.OK);
        }
    }
}
