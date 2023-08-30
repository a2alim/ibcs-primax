package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.dpptapp.approval_process_flow.services.ProjectMovementService;
import com.ibcs.idsdp.dpptapp.client.ConfigurationClientService;
import com.ibcs.idsdp.dpptapp.client.PlisClientService;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.client.dto.request.*;
import com.ibcs.idsdp.dpptapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.dpptapp.model.domain.EffectImpact;
import com.ibcs.idsdp.dpptapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.EffectImpactRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.ProjectDetailsPartBRepository;
import com.ibcs.idsdp.dpptapp.services.DppLocationServiceImp;
import com.ibcs.idsdp.dpptapp.services.DppObjectiveCostService;
import com.ibcs.idsdp.dpptapp.services.EffectImpactService;
import com.ibcs.idsdp.dpptapp.web.dto.DppObjectiveCostDTO;
import com.ibcs.idsdp.dpptapp.web.dto.request.EffectImpactRequest;
import com.ibcs.idsdp.dpptapp.web.dto.response.*;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
@Transactional
public class EffectImpactServiceImpl implements EffectImpactService {
    EffectImpactRepository effectImpactRepository;
    ProjectDetailsPartBRepository projectDetailsPartBRepository;
    DppObjectiveCostRepository masterTableRepo;
    private final ProjectConceptClientService projectConceptClientService;
    private final ConfigurationClientService configClientService;
    private final DppObjectiveCostService dppObjectiveCostService;
    private final DppLocationServiceImp dppLocationService;
    private final ProjectMovementService projectMovementService;
    private final PlisClientService plisClientService;

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
        effectImpact.setEnvironmentalProjectCategory(effectImpactRequest.getEnvironmentalProjectCategory());
        effectImpact.setWhetherEnvironmentClearance(effectImpactRequest.getWhetherEnvironmentClearance());
        effectImpact.setEnvClearance(effectImpactRequest.getEnvClearance());
        effectImpactRepository.save(effectImpact);
        return effectImpact;
    }

    @Override
    public PlisProjectResponseDTO sendProjectDataToPlis(String pcUuid) {
        ProjectMovementStage currentStage = null;
        PlisProjectShortInfoDTO request = new PlisProjectShortInfoDTO();
        ProjectConceptResponse pcInfo = projectConceptClientService.getProjectConceptMasterId(pcUuid);
        SubSectorDTO subSector = configClientService.getBySubSectorId(pcInfo.getSubSectorId());
        SectorDTO sector = configClientService.getBySectorId(pcInfo.getSectorId());
        DppObjectiveCostDTO dppInfo = dppObjectiveCostService.getObjectiveCostByPcUuid(pcInfo.getUuid());
        if (dppInfo!=null) currentStage = projectMovementService.getCurrentStageInDpp(dppInfo.getId());
        UserGroupStatusResponse userGroup = configClientService.getUserGroupStatusResponse();
        LocationAndCostResponse location = dppLocationService.getLocationByObjectiveCostIdUsingProjectSummary(pcInfo.getId());

        request.setProject_id(pcInfo.getId());
        request.setProject_name(pcInfo.getTitleEn());
        request.setAgency_name(pcInfo.getImplementingAgencyName());
        request.setUser_type(userGroup.getRes().getGroupStatus());
        request.setDpp_status(currentStage==null?"":currentStage.getCurrentStage().toString().replaceAll("_", " "));
        request.setSector(sector.getSectorNameEn());
        request.setSub_sector(subSector.getSubSectorNameEn());
        request.setProject_start_date(pcInfo.getExpCommencementDate());
        request.setProject_end_date(pcInfo.getExpCompletionDate());
        request.setLocation(generatelocationList(location));

        return plisClientService.sendProjectToPlis(request);
    }

    private List<PlisProjectLocationDTO> generatelocationList(LocationAndCostResponse location) {
        List<PlisProjectLocationDTO> locationList = new ArrayList<>();
        for (DivisionRequest division: location.getDivisions()) {
            if (division.getZillaList().size() > 0) {
                for (ZillaRequest zilla: division.getZillaList()) {
                    if (zilla.getUpaZillaList().size() > 0) {
                        for (UpaZillaRequest upaZilla: zilla.getUpaZillaList()) {
                            locationList.add(addLocation(division, zilla, upaZilla));
                        }
                    } else {
                        locationList.add(addLocation(division, zilla, null));
                    }
                }
            }/* else {
                locationList.add(addLocation(division, null, null));
            }*/
        }

        return locationList;
    }

    private PlisProjectLocationDTO addLocation(DivisionRequest division, ZillaRequest zilla, UpaZillaRequest upaZilla) {
        PlisProjectLocationDTO locationDTO = new PlisProjectLocationDTO();
        locationDTO.setDistrict(zilla.getNameEn());
        if (upaZilla != null) {
            locationDTO.setUpazila(upaZilla.getNameEn());
        }
        return locationDTO;
    }

    /*
    private ProjectLocationDTO addLocation(DivisionRequest division, ZillaRequest zilla, UpaZillaRequest upaZilla) {
        ProjectLocationDTO locationDTO = new ProjectLocationDTO();
        locationDTO.setDivision(division.getNameEn());
        locationDTO.setDivisionBn(division.getNameBn());
        locationDTO.setDivisionGeoCode(division.getGeoCode());
        if (zilla != null) {
            locationDTO.setDistrict(zilla.getNameEn());
            locationDTO.setDistrictBn(zilla.getNameBn());
            locationDTO.setDistrictGeoCode(zilla.getGeoCode());
        }
        if (upaZilla != null) {
            locationDTO.setUpazila(upaZilla.getNameEn());
            locationDTO.setUpazilaBn(upaZilla.getNameBn());
            locationDTO.setUpazilaGeoCode(upaZilla.getGeoCode());
        }
        return locationDTO;
    }
    */
}
