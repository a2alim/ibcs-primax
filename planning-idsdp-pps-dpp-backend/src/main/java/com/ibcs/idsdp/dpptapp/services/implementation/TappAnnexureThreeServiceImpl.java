package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.IdentityResponse;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.dpptapp.model.domain.TappAnnexureThree;
import com.ibcs.idsdp.dpptapp.model.repositories.TappAnnexureThreeRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.TappObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.services.TappAnnexureThreeService;
import com.ibcs.idsdp.dpptapp.web.dto.request.TappAnnexureThreeDetailsRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.TappAnnexureThreeRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j

@Service
@Transactional
public class TappAnnexureThreeServiceImpl extends BaseService<TappAnnexureThree, TappAnnexureThreeRequest> implements TappAnnexureThreeService {

    private final TappAnnexureThreeRepository tappRepository;
    private final IdGeneratorComponent idGeneratorComponent;
    private final TappObjectiveCostRepository masterRepo;

    public TappAnnexureThreeServiceImpl(ServiceRepository<TappAnnexureThree> repository,
                                        TappAnnexureThreeRepository tappRepository,
                                        IdGeneratorComponent idGeneratorComponent,
                                        TappObjectiveCostRepository masterRepo) {
        super(repository);
        this.tappRepository = tappRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.masterRepo = masterRepo;
    }

    // For Create new  Consultant
    @Override
    public ResponseEntity<IdentityResponse> createConsultant(List<TappAnnexureThreeDetailsRequest> consultantDetailsRequest) {

        try {
            for (TappAnnexureThreeDetailsRequest request : consultantDetailsRequest) {
                String uuid = idGeneratorComponent.generateUUID();
                TappAnnexureThree tappAnnexureThree = new TappAnnexureThree();
                tappAnnexureThree.setCreatedBy("admin");
                tappAnnexureThree.setCreatedOn(LocalDate.now());
                tappAnnexureThree.setIsDeleted(false);
                tappAnnexureThree.setUuid(uuid);
                tappAnnexureThree.setTappMasterId(masterRepo.findByProjectConceptUuidAndIsDeleted(request.getProjectConceptUuid(), false).get());
                tappAnnexureThree.setConsultants(request.getConsultants());
                tappAnnexureThree.setEducationalQualification(request.getEducationalQualification());
                tappAnnexureThree.setExperience(request.getExperience());
                tappAnnexureThree.setProjectConceptMasterId(request.getProjectConceptMasterId());
                tappAnnexureThree.setProjectConceptUuid(request.getProjectConceptUuid());
                tappAnnexureThree.setResponsibilities(request.getResponsibilities());
                tappAnnexureThree.setNumberOfPost(request.getNumberOfPost());
                tappAnnexureThree.setRemarks(request.getRemarks());

                tappRepository.save(tappAnnexureThree);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity(new IdentityResponse("Data save successfully"), HttpStatus.OK);
    }

    @Override
    public TappAnnexureThreeRequest getAnnexureThree(String uuid) {
        TappAnnexureThreeRequest request = new TappAnnexureThreeRequest();

        List<TappAnnexureThreeDetailsRequest> list = new ArrayList<>();
        List<TappAnnexureThree> annexureThreeList = tappRepository.findAllByProjectConceptUuidAndIsDeleted(uuid, false);
        for(TappAnnexureThree annexureThree : annexureThreeList){
            TappAnnexureThreeDetailsRequest detailsRequest = new TappAnnexureThreeDetailsRequest();

                detailsRequest.setProjectConceptMasterId(annexureThree.getProjectConceptMasterId());
                detailsRequest.setProjectConceptUuid(annexureThree.getProjectConceptUuid());
                detailsRequest.setConsultants(annexureThree.getConsultants());
                detailsRequest.setEducationalQualification(annexureThree.getEducationalQualification());
                detailsRequest.setExperience(annexureThree.getExperience());
                detailsRequest.setUuid(annexureThree.getUuid());
                detailsRequest.setResponsibilities(annexureThree.getResponsibilities());
                detailsRequest.setNumberOfPost(annexureThree.getNumberOfPost());
                detailsRequest.setRemarks(annexureThree.getRemarks());
                list.add(detailsRequest);

            request.consultantsList = list;

        }
        return request;
    }

    @Override
    public TappAnnexureThreeRequest updateConsultant(TappAnnexureThreeRequest request) {

        List<TappAnnexureThreeDetailsRequest> list = request.consultantsList;
        for (TappAnnexureThreeDetailsRequest detailsRequest : list){
                if(detailsRequest.getUuid() != null){
                  Optional<TappAnnexureThree> annexureThree = tappRepository.findByUuid(detailsRequest.getUuid());
                  TappAnnexureThree three = annexureThree.get();
                    BeanUtils.copyProperties(detailsRequest, three);
                    three.setUpdatedBy("admin");
                    three.setUpdatedOn(LocalDate.now());
                    tappRepository.save(three);
                }else {
                    String uuid = idGeneratorComponent.generateUUID();
                    TappAnnexureThree newThreee = new TappAnnexureThree();

                    newThreee.setCreatedBy("user");
                    newThreee.setCreatedOn(LocalDate.now());
                    newThreee.setIsDeleted(false);

                    BeanUtils.copyProperties(detailsRequest, newThreee);
                    newThreee.setUuid(uuid);
                    tappRepository.save(newThreee);
                }
            }

        return null;
    }

    public ResponseEntity<ResponseStatus> deleteRow(String uuid){
        // dppProjectManagementSetupRepository.delete(dppProjectManagementSetupRepository.findByUuid(uuid).get());
        Optional<TappAnnexureThree> optional = tappRepository.findByUuid(uuid);
        TappAnnexureThree annexureThree = optional.get();
        annexureThree.setIsDeleted(true);
        annexureThree.setUpdatedBy("admin");
        annexureThree.setUpdatedOn(LocalDate.now());
        tappRepository.save(annexureThree);

        return new ResponseEntity( new ResponseStatus(1, "Deleted successfully"), HttpStatus.OK);
    }
}
