package com.ibcs.idsdp.rdpprtapp.services.implementation;

import com.ibcs.idsdp.rdpprtapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.rdpprtapp.model.domain.EffectImpact;
import com.ibcs.idsdp.rdpprtapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.EffectImpactRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.ProjectDetailsPartBRepository;
import com.ibcs.idsdp.rdpprtapp.services.EffectImpactService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.EffectImpactRequest;
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
public class EffectImpactServiceImpl implements EffectImpactService {
    EffectImpactRepository effectImpactRepository;
    ProjectDetailsPartBRepository projectDetailsPartBRepository;
    DppObjectiveCostRepository masterTableRepo;

    // For Crete Effet Impact
    @Override
    public EffectImpact saveEffectImpact(EffectImpactRequest effectImpactRequest) {
        EffectImpact effectImpact = new EffectImpact();
        // Convert request to object
        BeanUtils.copyProperties(effectImpactRequest, effectImpact);
        // one to one relation Proejct Details part B to Effect and Impact
        DppObjectiveCost masterData = masterTableRepo.findByProjectConceptUuid(effectImpactRequest.getProjectConceptUuid());
        effectImpact.setObjectiveCost(masterData);
        effectImpact.setProjectConceptMasterId(masterData.getProjectConceptMasterId());
        effectImpact.setCreatedBy("admin");
        effectImpact.setCreatedOn(LocalDate.now());
        effectImpact.setIsDeleted(false);
        effectImpact.setUuid(UUID.randomUUID().toString());
        effectImpactRepository.save(effectImpact);
        return effectImpact;
    }

    // For get EffectImpact by id
    @Override
    public EffectImpact getEffectImpact(Long id) {
        return effectImpactRepository.findById(id).get();
    }


    @Override
    public Boolean updateEffectImpact(EffectImpact effectImpact) {
        effectImpactRepository.save(effectImpact);
        return true;
    }

    // For Get Effect and impact by proejct id
    @Override
    public EffectImpact getEffectImpact(String projectId) {
        return effectImpactRepository.findByProjectConceptUuid(projectId);
    }

    // For Update Effect and Impact By object and project id
    @Override
    public EffectImpact updateEffectImpact(EffectImpactRequest effectImpactRequest, String id) {
        // get effect and impact by project id
        Optional<EffectImpact> impact = effectImpactRepository.findAllByProjectConceptUuid(id);
        if (!impact.isPresent()){
            throw new RuntimeException("Other details Not Found");
        }

        EffectImpact effectImpact = impact.get();
//        System.out.println("Project Details part b,........................................ " );
//        BeanUtils.copyProperties(effectImpactRequest, effectImpact);
        effectImpact.setUpdatedBy("admin");
        effectImpact.setUpdatedOn(LocalDate.now());
        effectImpact.setIsDeleted(false);
        effectImpact.setEmployment(effectImpactRequest.getEmployment());
        effectImpact.setEnvSustainabilityLand(effectImpactRequest.getEnvSustainabilityLand());
        effectImpact.setFutureDisasterManagement(effectImpactRequest.getFutureDisasterManagement());
        effectImpact.setGenderDisabilityGroups(effectImpactRequest.getGenderDisabilityGroups());
        effectImpact.setInstitutionalProductivity(effectImpactRequest.getInstitutionalProductivity());
        effectImpact.setOrganizationalArrangement(effectImpactRequest.getOrganizationalArrangement());
        effectImpact.setOtherProjectInstallations(effectImpactRequest.getOtherProjectInstallations());
        effectImpact.setPopulation(effectImpactRequest.getPopulation());
        effectImpact.setProvertySituation(effectImpactRequest.getProvertySituation());
        effectImpact.setRegionalDisparity(effectImpactRequest.getRegionalDisparity());
        effectImpact.setWhetherEnvironmentClearance(effectImpactRequest.getWhetherEnvironmentClearance());
        effectImpactRepository.save(effectImpact);
        return effectImpact;
    }
}
