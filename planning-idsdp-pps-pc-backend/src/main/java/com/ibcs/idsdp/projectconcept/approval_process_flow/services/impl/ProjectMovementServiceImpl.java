package com.ibcs.idsdp.projectconcept.approval_process_flow.services.impl;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.projectconcept.approval_process_flow.model.domain.MovementStageEnum;
import com.ibcs.idsdp.projectconcept.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.projectconcept.approval_process_flow.model.repositories.ProjectMovementRepository;
import com.ibcs.idsdp.projectconcept.approval_process_flow.services.ProjectMovementService;
import com.ibcs.idsdp.projectconcept.approval_process_flow.web.dto.request.ProjectMovementStageRequest;
import com.ibcs.idsdp.projectconcept.client.DppClientService;
import com.ibcs.idsdp.projectconcept.client.FSClientService;
import com.ibcs.idsdp.projectconcept.client.dto.FsSummaryDTO;
import com.ibcs.idsdp.projectconcept.model.domain.ProjectConceptMaster;
import com.ibcs.idsdp.projectconcept.model.repositories.ProjectConceptMasterRepository;
import com.ibcs.idsdp.projectconcept.services.implementation.ProjectConceptMasterServiceImp;
import com.ibcs.idsdp.projectconcept.web.dto.ProjectConceptMasterDTO;
import com.ibcs.idsdp.projectconcept.web.dto.response.DppObjectiveCostDTO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
@AllArgsConstructor
@Service
public class ProjectMovementServiceImpl implements ProjectMovementService {


    ProjectMovementRepository projectMovementRepository;
    private IdGeneratorComponent idGeneratorComponent;

    private final ProjectConceptMasterServiceImp projectConceptMasterService;
    private final ProjectConceptMasterRepository projectConceptRepository;
    private final FSClientService fsClientService;
    private final DppClientService dppClientService;

    @Override
    public void saveNewMovement(ProjectMovementStageRequest projectMovementStageRequest) {
        ProjectMovementStage projectMovementStage = new ProjectMovementStage();
        BeanUtils.copyProperties(projectMovementStageRequest,projectMovementStage);
        MovementStageEnum movementStageEnum =  MovementStageEnum.valueOf(projectMovementStageRequest.getCurrentStage());
        projectMovementStage.setCurrentStage(movementStageEnum);
        projectMovementStage.setUuid(idGeneratorComponent.generateUUID());
        projectMovementStage.setIsDeleted(false);
        LocalDateTime localDateTime = LocalDateTime.now();
        projectMovementStage.setCreatedOn(localDateTime.toLocalDate());
        projectMovementStage.setMovementTime(localDateTime);
        try{
            projectMovementRepository.save(projectMovementStage);
            projectConceptMasterService.updateMovementTimeByPcId(projectMovementStageRequest.getProjectConceptMasterId());
            log.info("saved projectMovementStage");
        }
        catch (Exception ex){
            log.info("failed projectMovementStage");
        }
    }

    @Override
    public ProjectMovementStage getCurrentStageInDpp(Long dppMasterId) {
       List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByDppMasterIdOrderByMovementTimeDesc(dppMasterId);
       if(!projectMovementStageList.isEmpty()){
           return projectMovementStageList.get(0);
       }
       else
           return null;
    }

    @Override
    public ProjectMovementStage getCurrentStageInTapp(Long dppMasterId) {
        List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByTappMasterIdOrderByMovementTimeDesc(dppMasterId);
        if(!projectMovementStageList.isEmpty()){
            return projectMovementStageList.get(0);
        }
        else
            return null;
    }

    @Override
    public ProjectMovementStage getCurrentStageInProjectConcept(Long pcMasterId) {
        List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByProjectConceptMasterIdOrderByMovementTimeDesc(pcMasterId);
        if(!projectMovementStageList.isEmpty()){
            return projectMovementStageList.get(0);
        }
        else
            return null;
    }

    public ProjectMovementStage getCurrentStageInFsProposal(Long fsProposalMasterId) {
        List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByFsProposalMasterIdOrderByMovementTimeDesc(fsProposalMasterId);
        if(!projectMovementStageList.isEmpty()){
            return projectMovementStageList.get(0);
        }
        else
            return null;
    }

    @Override
    public List<ProjectMovementStage> setMovementDateBatchProcess() {
        List<ProjectMovementStage> res = new ArrayList<>();
        List<ProjectConceptMaster> list = projectConceptRepository.findAllByIsDeleted(false);
        for (ProjectConceptMaster pcm : list) {
            ProjectMovementStage currentStage = null;
            if (pcm.getMovementDate() == null) {
                if (pcm.getSourceModuleType().equals("PC")) {
                    currentStage = getCurrentStageInProjectConcept((pcm.getId()));
                } else if (pcm.getSourceModuleType().equals("FS")) {
                    FsSummaryDTO fspSummary = fsClientService.getFspSummaryByPcUuid(pcm.getUuid());
                    if (fspSummary != null) {
                        currentStage = getCurrentStageInFsProposal(fspSummary.getId());
                    }
                } else if (pcm.getSourceModuleType().equals("DPP_TAPP")) {
                    DppObjectiveCostDTO dppInfo = dppClientService.getDppObjectiveCostByPcUuid(pcm.getUuid());
                    if (dppInfo != null) {
                        currentStage = getCurrentStageInDpp((dppInfo.getId()));
                    } else {
                        DppObjectiveCostDTO tappInfo = dppClientService.getTappObjectiveCostByPcUuid(pcm.getUuid());
                        if (tappInfo != null) {
                            currentStage = getCurrentStageInTapp((tappInfo.getId()));
                        }
                    }
                }
                saveMovementTime(pcm, currentStage);
                res.add(currentStage);
            }
        }
        return res;
    }

    private void saveMovementTime(ProjectConceptMaster pcm, ProjectMovementStage currentStage) {
        Date date;
        if (currentStage != null) {
            date = Date.from(currentStage.getMovementTime().atZone(ZoneId.systemDefault()).toInstant());
        } else {
            date = Date.from(pcm.getCreatedOn().atStartOfDay(ZoneId.systemDefault()).toInstant());
        }
        pcm.setMovementDate(date);
        projectConceptRepository.save(pcm);
    }

}
