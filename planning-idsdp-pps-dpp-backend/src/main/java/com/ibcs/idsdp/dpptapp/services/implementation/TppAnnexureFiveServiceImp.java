package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.model.domain.TppAnnexureFive;
import com.ibcs.idsdp.dpptapp.model.repositories.TppAnnexureFiveRepository;
import com.ibcs.idsdp.dpptapp.services.TppAnnexureFiveService;
import com.ibcs.idsdp.dpptapp.web.dto.request.TppAnnexureFiveRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Slf4j
@Service
@AllArgsConstructor
public class TppAnnexureFiveServiceImp implements TppAnnexureFiveService {
    private TppAnnexureFiveRepository tppAnnexureFiveRepository;
    private ProjectConceptClientService projectConceptClientService;

    @Override
    public ResponseWithResults save(TppAnnexureFiveRequest response) {
        Integer status = 0;
        String message = "Project not found!";
        try {
            ProjectConceptResponse projectConceptResponse = projectConceptClientService.getProjectConceptMasterId(response.getProjectConceptUuid());
            System.out.println(projectConceptResponse);

            if(projectConceptResponse.getId()  < 1)
            {
                status = 1;
                message = "Project not found";
            }
            else{
                for(TppAnnexureFiveRequest request : response.getList()){
                    saveUpdateData(request, projectConceptResponse);
                }
                status = 1;
                message = "Data saved successfully";
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseWithResults(status, message, HttpStatus.OK);
    }

    public TppAnnexureFiveRequest saveUpdateData(TppAnnexureFiveRequest request, ProjectConceptResponse projectConceptResponse) {
        TppAnnexureFive tppAnnexureFive;

        if(request.getUuid().isEmpty()) {
            tppAnnexureFive = new TppAnnexureFive();
            tppAnnexureFive.setCreatedBy("admin");
            tppAnnexureFive.setCreatedOn(LocalDate.now());
            tppAnnexureFive.setIsDeleted(false);
            BeanUtils.copyProperties(request, tppAnnexureFive);
            tppAnnexureFive.setUuid(UUID.randomUUID().toString());
            tppAnnexureFive.setProjectConceptMasterId(projectConceptResponse.getId());
            tppAnnexureFive.setProjectConceptUuid(request.getProjectConceptUuid());
        } else {
            tppAnnexureFive = tppAnnexureFiveRepository.findByUuidAndIsDeleted(request.getUuid(), false).get();
            tppAnnexureFive.setUpdatedBy("admin");
            tppAnnexureFive.setUpdatedOn(LocalDate.now());
            BeanUtils.copyProperties(request, tppAnnexureFive);
            tppAnnexureFive.setProjectConceptMasterId(projectConceptResponse.getId());
            tppAnnexureFive.setProjectConceptUuid(request.getProjectConceptUuid());
        }
        tppAnnexureFiveRepository.save(tppAnnexureFive);
        return  request;
    }

    @Override
    public List<TppAnnexureFive> getListByProConceptUuid(String projectUuid){
        return tppAnnexureFiveRepository.findByProjectConceptUuidAndIsDeleted(projectUuid, false);
    }

    public ResponseEntity<ResponseStatus> deleteRow(Long id){
        Optional<TppAnnexureFive> tppAnnexureFive = tppAnnexureFiveRepository.findById(id);
        TppAnnexureFive tppAnnexureFive1 = tppAnnexureFive.get();
        tppAnnexureFive1.setIsDeleted(true);
        tppAnnexureFiveRepository.save(tppAnnexureFive1);
        return new ResponseEntity(new ResponseStatus(1, "Data deleted successfully"), HttpStatus.OK);
    }

}
