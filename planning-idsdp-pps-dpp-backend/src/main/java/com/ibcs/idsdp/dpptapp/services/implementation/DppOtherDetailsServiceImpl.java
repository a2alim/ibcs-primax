package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.dpptapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.dpptapp.model.domain.DppOtherDetails;
import com.ibcs.idsdp.dpptapp.model.domain.ProjectDetailsPartB;
import com.ibcs.idsdp.dpptapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.DppOtherDetailsRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.ProjectDetailsPartBRepository;
import com.ibcs.idsdp.dpptapp.services.DppOtherDetailsService;
import com.ibcs.idsdp.dpptapp.web.dto.request.DppOtherDetailsRequest;
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
public class DppOtherDetailsServiceImpl implements DppOtherDetailsService {
    DppObjectiveCostRepository masterTableRepo;
    DppOtherDetailsRepository dppOtherDetailsRepository;
    ProjectDetailsPartBRepository projectDetailsPartBRepository;

    // For Create Other Details
    @Override
    public Boolean saveDppOtherDetails(DppOtherDetailsRequest dppOtherDetailsRequest) {
        DppOtherDetails dppOtherDetails = new DppOtherDetails();
        // Convert request to object
        BeanUtils.copyProperties(dppOtherDetailsRequest,dppOtherDetails);
        // one to one relation to Project Details part b to Annes V-VI
        DppObjectiveCost masterData = masterTableRepo.findByProjectConceptUuid(dppOtherDetailsRequest.getProjectConceptUuid());
        dppOtherDetails.setObjectiveCost(masterData);
        dppOtherDetails.setProjectConceptMasterId(masterData.getProjectConceptMasterId());
        dppOtherDetails.setCreatedBy("admin");
        dppOtherDetails.setCreatedOn(LocalDate.now());
        dppOtherDetails.setIsDeleted(false);
        dppOtherDetails.setUuid(UUID.randomUUID().toString());
        dppOtherDetails.setIsPrivateSector(dppOtherDetailsRequest.getIsPrivateSector());
        dppOtherDetailsRepository.save(dppOtherDetails);
        return true;
    }

    // For Get Other Details by annex v-vi uuid
    @Override
    public DppOtherDetailsRequest getOtherDetailsByUuid(String uuid) {
        return null;
    }

    // For get Other Details by Project Id
    @Override
    public DppOtherDetails getOtherDetailsByProjectId(String projectId) {
        return dppOtherDetailsRepository.findByProjectConceptUuid(projectId);
    }

    // for Update Other Details by object and projct id
    @Override
    public DppOtherDetailsRequest updateOtherDetails(DppOtherDetailsRequest otherDetailsRequest, String id) {
        // get other details data by project id
        Optional<DppOtherDetails> otherDetails = dppOtherDetailsRepository.findAllByProjectConceptUuid(id);

        if (!otherDetails.isPresent()){
            throw new RuntimeException("Other details Not Found");
        }
        DppOtherDetails otherDetail = otherDetails.get();
        otherDetail.setUpdatedBy("admin");
        otherDetail.setUpdatedOn(LocalDate.now());
//        BeanUtils.copyProperties(otherDetails, otherDetail);
        otherDetail.setContributionProjectAchieving(otherDetailsRequest.getContributionProjectAchieving());
        otherDetail.setInvolvementCompensation(otherDetailsRequest.getInvolvementCompensation());
        otherDetail.setMajorConditionalityForeignAid(otherDetailsRequest.getMajorConditionalityForeignAid());
        otherDetail.setRelationProjectAllocation(otherDetailsRequest.getRelationProjectAllocation());
        otherDetail.setRiskAnalysisMitigation(otherDetailsRequest.getRiskAnalysisMitigation());
        otherDetail.setSpecificationLinkagePerspective(otherDetailsRequest.getSpecificationLinkagePerspective());
        otherDetail.setWhetherPrivateSector(otherDetailsRequest.getWhetherPrivateSector());
        otherDetail.setIsPrivateSector(otherDetailsRequest.getIsPrivateSector());
        dppOtherDetailsRepository.save(otherDetail);
        return null;
    }
}
