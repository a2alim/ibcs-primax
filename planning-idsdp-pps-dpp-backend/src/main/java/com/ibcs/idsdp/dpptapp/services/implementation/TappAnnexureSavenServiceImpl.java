package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.TappObjectiveCost;
import com.ibcs.idsdp.dpptapp.model.domain.TppAnnexureSaven;
import com.ibcs.idsdp.dpptapp.model.repositories.TappObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.TppAnnexureSavenRepository;
import com.ibcs.idsdp.dpptapp.services.TappAnnexureSavenService;
import com.ibcs.idsdp.dpptapp.web.dto.TppAnnexureSavenDTO;
import com.ibcs.idsdp.dpptapp.web.dto.request.TppAnnexureSavenRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
@Transactional
public class TappAnnexureSavenServiceImpl implements TappAnnexureSavenService {
    private TppAnnexureSavenRepository tppAnnexureSavenRepository;
    private TappObjectiveCostRepository repository;

    /**
     * For create tapp annexure vii records
     * @param request
     * @return
     */
    @Override
    public TppAnnexureSavenDTO save(TppAnnexureSavenRequest request) {

        if (request.getUuid().isEmpty()) {
            /*--------Data will be save into the database table--------*/
            TppAnnexureSaven tppAnnexureSaven = new TppAnnexureSaven();

            tppAnnexureSaven.setUuid(UUID.randomUUID().toString());
            BeanUtils.copyProperties(request, tppAnnexureSaven);
            tppAnnexureSaven.setTappMasterId(repository.findByProjectConceptUuidAndIsDeleted(request.getProjectConceptUuid(), false).get());
            tppAnnexureSaven.setCreatedBy("admin");
            tppAnnexureSaven.setCreatedOn(LocalDate.now());
            tppAnnexureSaven.setIsDeleted(false);
            TppAnnexureSaven tppAnnexureSaven1 = tppAnnexureSavenRepository.save(tppAnnexureSaven);

            TppAnnexureSavenDTO tppAnnexureSavenDTO =new TppAnnexureSavenDTO();
            tppAnnexureSavenDTO.setStatus(1);
            tppAnnexureSavenDTO.setMessage("Created successfully!");
            BeanUtils.copyProperties(tppAnnexureSaven1,tppAnnexureSavenDTO);
            return tppAnnexureSavenDTO;

        } else {
            /*--------Data will be update into the database table--------*/
            Optional<TppAnnexureSaven> tppAnnexureSavenOptional = tppAnnexureSavenRepository.findByUuid(request.getUuid());

            TppAnnexureSaven tppAnnexureSaven = tppAnnexureSavenOptional.get();
            BeanUtils.copyProperties(request, tppAnnexureSaven);

            tppAnnexureSaven.setUpdatedBy("admin");
            tppAnnexureSaven.setUpdatedOn(LocalDate.now());
            tppAnnexureSaven.setIsDeleted(false);
            TppAnnexureSaven tappProjectDetails1 = tppAnnexureSavenRepository.save(tppAnnexureSaven);

            TppAnnexureSavenDTO tppAnnexureSavenDTO =new TppAnnexureSavenDTO();
            tppAnnexureSavenDTO.setStatus(2);
            tppAnnexureSavenDTO.setMessage("Updated successfully!");
            BeanUtils.copyProperties(tappProjectDetails1, tppAnnexureSavenDTO);
            return tppAnnexureSavenDTO;
        }
    }

    /**
     * For get first row data of tapp annexure vii
     * @return
     */

    public ResponseWithResults getFirstRowData(String proConcept_uuid){

        System.out.println("proConcept_uuid === " + proConcept_uuid);
        TppAnnexureSaven response = new TppAnnexureSaven();

        TppAnnexureSaven tppAnnexureSaven =  tppAnnexureSavenRepository.findByProjectConceptUuid(proConcept_uuid);

        if(tppAnnexureSaven != null){
            response.setId(tppAnnexureSaven.getId());
            response.setUuid(tppAnnexureSaven.getUuid());
            response.setLetterOfAgreement(tppAnnexureSaven.getLetterOfAgreement());
            response.setProjectConceptMasterId(tppAnnexureSaven.getProjectConceptMasterId());
            response.setProjectConceptUuid(tppAnnexureSaven.getProjectConceptUuid());
            return new ResponseWithResults(1, "Success", response);
        }
        else
        {
            return new ResponseWithResults(0, "Empty", "");
        }
    }


}
