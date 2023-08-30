package com.ibcs.idsdp.feasibilitystudy.approval_process_flow.services.impl;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.web.dto.request.IdHolderRequestBodyDTO;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.feasibilitystudy.approval_process_flow.model.domain.MovementStageEnum;
import com.ibcs.idsdp.feasibilitystudy.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.feasibilitystudy.approval_process_flow.model.repositories.ProjectMovementRepository;
import com.ibcs.idsdp.feasibilitystudy.approval_process_flow.services.ProjectMovementService;
import com.ibcs.idsdp.feasibilitystudy.approval_process_flow.web.dto.request.ProjectMovementStageRequest;
import com.ibcs.idsdp.feasibilitystudy.client.ProjectConceptClientService;
import com.ibcs.idsdp.feasibilitystudy.services.implementation.FspSummaryServiceImp;
import com.ibcs.idsdp.feasibilitystudy.web.dto.FspSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@AllArgsConstructor
@Service
public class ProjectMovementServiceImpl implements ProjectMovementService {


    ProjectMovementRepository projectMovementRepository;
    private IdGeneratorComponent idGeneratorComponent;
    private final FspSummaryServiceImp fspSummaryService;
    private final ProjectConceptClientService projectConceptService;

    @Override
    public void saveNewMovement(ProjectMovementStageRequest projectMovementStageRequest) {
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        Long id = Long.parseLong(accessTokenDetail.getId());

        ProjectMovementStage projectMovementStage = new ProjectMovementStage();
        BeanUtils.copyProperties(projectMovementStageRequest,projectMovementStage);
        MovementStageEnum movementStageEnum =  MovementStageEnum.valueOf(projectMovementStageRequest.getCurrentStage());
        projectMovementStage.setCurrentStage(movementStageEnum);
        projectMovementStage.setUuid(idGeneratorComponent.generateUUID());
        projectMovementStage.setIsDeleted(false);
        LocalDateTime localDateTime = LocalDateTime.now();
        projectMovementStage.setCreatedOn(localDateTime.toLocalDate());
        projectMovementStage.setMovementTime(localDateTime);
        projectMovementStage.setUserId(id);
        try{
            projectMovementRepository.save(projectMovementStage);
            FspSummaryDTO fspSummaryDTO = fspSummaryService.getById(projectMovementStageRequest.getFsProposalMasterId());
            IdHolderRequestBodyDTO request = new IdHolderRequestBodyDTO();
            request.setId(fspSummaryDTO.getProjectConceptMasterId());
            projectConceptService.updateMovementTimeByPcId(request);
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
        List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByFsProposalMasterIdOrderByMovementTimeDesc(pcMasterId);
        if(!projectMovementStageList.isEmpty()){
            return projectMovementStageList.get(0);
        }
        else
            return null;
    }

    @Override
    public ProjectMovementStage getCurrentStageInFsProposal(Long fsMasterId) {
        List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByFsProposalMasterIdOrderByMovementTimeDesc(fsMasterId);
        if(!projectMovementStageList.isEmpty()){
            return projectMovementStageList.get(0);
        }
        else
            return null;
    }
}
