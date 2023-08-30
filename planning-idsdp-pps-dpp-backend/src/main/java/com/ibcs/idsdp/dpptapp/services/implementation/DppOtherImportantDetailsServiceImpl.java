package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.dpptapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.dpptapp.model.domain.DppOtherImportantDetails;
import com.ibcs.idsdp.dpptapp.model.domain.ProjectDetailsPartB;
import com.ibcs.idsdp.dpptapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.DppOtherImportantDetailsRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.ProjectDetailsPartBRepository;
import com.ibcs.idsdp.dpptapp.services.DppOtherImportantDetailsService;
import com.ibcs.idsdp.dpptapp.web.dto.request.DppOtherImportantDetailsRequest;
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
public class DppOtherImportantDetailsServiceImpl implements DppOtherImportantDetailsService {
    private DppOtherImportantDetailsRepository dppOtherImportantDetailsRepository;
    private DppObjectiveCostRepository masterTableRepo;

    // For Create Other Important Details
    @Override
    public Boolean saveOtherImportantDetails(DppOtherImportantDetailsRequest dppOtherImportantDetailsRequest) {
        DppOtherImportantDetails dppOtherImportantDetails = new DppOtherImportantDetails();
        // Convert request to object
        BeanUtils.copyProperties(dppOtherImportantDetailsRequest, dppOtherImportantDetails);
        // one to one relation Project Details Part B to Other Important Details and set
        DppObjectiveCost masterData = masterTableRepo.findByProjectConceptUuid(dppOtherImportantDetailsRequest.getProjectConceptUuid());
        dppOtherImportantDetails.setObjectiveCost(masterData);
        dppOtherImportantDetails.setProjectConceptMasterId(masterData.getProjectConceptMasterId());
        dppOtherImportantDetails.setCreatedBy("admin");
        dppOtherImportantDetails.setCreatedOn(LocalDate.now());
        dppOtherImportantDetails.setIsDeleted(false);
        dppOtherImportantDetails.setUuid(UUID.randomUUID().toString());
        dppOtherImportantDetailsRepository.save(dppOtherImportantDetails);
        return true;
    }

    // For get Other Important Details by uuid
    @Override
    public DppOtherImportantDetailsRequest getOtherImportantDetailsByUuid(String uuid) {
        return null;
    }

    // For Get Other Important Details by Project id
    @Override
    public DppOtherImportantDetails getOtherImportantDetailsByProjectId(String projectId) {
        return dppOtherImportantDetailsRepository.findByProjectConceptUuid(projectId);
    }

    // For udpate Other Important Details by object and project id
    @Override
    public DppOtherImportantDetailsRequest updateOtherImportantDetails(DppOtherImportantDetailsRequest otherImportantDetailsRequest, String id) {
        // get other important details by project id
        Optional<DppOtherImportantDetails> otherImportantDetails = dppOtherImportantDetailsRepository.findAllByProjectConceptUuid(id);

        if (!otherImportantDetails.isPresent()) {
            throw new RuntimeException("Other Important details Not Found");
        }
        DppOtherImportantDetails details = otherImportantDetails.get();
        System.out.println("Project Details part b,........................................ ");
//        BeanUtils.copyProperties(otherDetails, otherDetail);
        details.setUpdatedBy("admin");
        details.setUpdatedOn(LocalDate.now());
        details.setImplementationCommitteeTor(otherImportantDetailsRequest.getImplementationCommitteeTor());
        details.setSteeringCommitteeTor(otherImportantDetailsRequest.getSteeringCommitteeTor());
        details.setSustainabilityBenefit(otherImportantDetailsRequest.getSustainabilityBenefit());
        details.setOthers(otherImportantDetailsRequest.getOthers());
        dppOtherImportantDetailsRepository.save(details);
        return null;
    }
}
