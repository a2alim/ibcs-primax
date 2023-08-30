package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.TappTermOfReference;
import com.ibcs.idsdp.dpptapp.model.repositories.TappObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.TappTermOfReferenceRepository;
import com.ibcs.idsdp.dpptapp.services.TappTermOfReferenceService;
import com.ibcs.idsdp.dpptapp.web.dto.request.TappTermOfReferenceRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
@Transactional
public class TappTermOfConditionServiceImpl extends BaseService<TappTermOfReference, TappTermOfReferenceRequest> implements TappTermOfReferenceService {

    private final TappTermOfReferenceRepository termOfReferenceRepository;
    private final IdGeneratorComponent idGeneratorComponent;
    private final TappObjectiveCostRepository masterRepo;

    public TappTermOfConditionServiceImpl(ServiceRepository<TappTermOfReference> repository, TappTermOfReferenceRepository termOfReferenceRepository, IdGeneratorComponent idGeneratorComponent, TappObjectiveCostRepository masterRepo) {
        super(repository);
        this.termOfReferenceRepository = termOfReferenceRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.masterRepo = masterRepo;
    }

    // For create Term of Reference
    @Override
    public ResponseEntity<TappTermOfReferenceRequest> saveTermOfReference(TappTermOfReferenceRequest termOfReferenceRequest) {
        String uuid = idGeneratorComponent.generateUUID();
        TappTermOfReference termOfReference = new TappTermOfReference();
        termOfReference.setCreatedBy("admin");
        termOfReference.setCreatedOn(LocalDate.now());
        termOfReference.setIsDeleted(false);
        termOfReference.setUuid(uuid);
        termOfReference.setObjectiveCost(masterRepo.findByProjectConceptUuidAndIsDeleted(termOfReferenceRequest.getProjectConceptUuid(), false).get());
        termOfReference.setProjectConceptUuid(termOfReferenceRequest.getProjectConceptUuid());
        termOfReference.setProjectConceptMasterId(termOfReferenceRequest.getProjectConceptMasterId());
        termOfReference.setInstitutionalAgreement(termOfReferenceRequest.getInstitutionalAgreement());
        termOfReferenceRepository.save(termOfReference);

        return null;
    }

    // For Get Term of reference data find by project id
    @Override
    public ResponseWithResults getReferenceByProjectId(String id) {
        Optional<TappTermOfReference> optional = termOfReferenceRepository.findByProjectConceptUuid(id);
        if(!optional.isPresent()){
         return new ResponseWithResults(0, "Not Found", "");
        }else {
            TappTermOfReference reference = optional.get();
            TappTermOfReferenceRequest request = new TappTermOfReferenceRequest();
            request.setInstitutionalAgreement(reference.getInstitutionalAgreement());
            request.setProjectConceptMasterId(reference.getProjectConceptMasterId());
            request.setProjectConceptUuid(reference.getProjectConceptUuid());
            request.setUuid(reference.getUuid());
          return new ResponseWithResults(1, "Success", request);
        }
    }

    // For Update Term of Reference
    @Override
    public TappTermOfReferenceRequest updateReference(TappTermOfReferenceRequest referenceRequest, String id) {
       Optional<TappTermOfReference> optional = termOfReferenceRepository.findByProjectConceptUuid(id);
        TappTermOfReference ref = optional.get();

        ref.setUpdatedBy("admin");
        ref.setUpdatedOn(LocalDate.now());
        ref.setInstitutionalAgreement(referenceRequest.getInstitutionalAgreement());
        BeanUtils.copyProperties(ref, referenceRequest);
        termOfReferenceRepository.save(ref);
        return null;
    }

}
