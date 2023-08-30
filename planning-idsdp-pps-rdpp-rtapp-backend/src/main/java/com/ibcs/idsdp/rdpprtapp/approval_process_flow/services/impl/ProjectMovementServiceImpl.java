package com.ibcs.idsdp.rdpprtapp.approval_process_flow.services.impl;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.services.AttachmentUploadService;
import com.ibcs.idsdp.common.web.dto.request.IdHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.domain.MovementStageEnum;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.domain.ProjectMovementAttachment;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.repositories.ProjectMovementAttachmentRepository;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.repositories.ProjectMovementRepository;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.services.ProjectMovementService;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.web.dto.request.ProjectMovementStageRequest;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.web.dto.response.ProjectMovementStageResponse;
import com.ibcs.idsdp.rdpprtapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.rdpprtapp.services.DppObjectiveCostService;
import com.ibcs.idsdp.rdpprtapp.services.DppObjectiveCostServiceImp;
import com.ibcs.idsdp.rdpprtapp.services.TappObjectiveCostServiceImp;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppObjectiveCostDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.TappObjectiveCostDTO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@AllArgsConstructor
@Service
public class ProjectMovementServiceImpl implements ProjectMovementService {


    ProjectMovementRepository projectMovementRepository;
    private IdGeneratorComponent idGeneratorComponent;
    private final AttachmentUploadService attachmentUploadService;
    private final ProjectMovementAttachmentRepository projectMovementAttachmentRepository;
    private final ProjectConceptClientService projectConceptService;
    private final DppObjectiveCostServiceImp dppObjectiveCostService;
    private final TappObjectiveCostServiceImp tappObjectiveCostService;

    @Override
    public ProjectMovementStage saveNewMovement(ProjectMovementStageRequest projectMovementStageRequest) {
        ProjectMovementStage projectMovementStage = new ProjectMovementStage();
        BeanUtils.copyProperties(projectMovementStageRequest, projectMovementStage);
        MovementStageEnum movementStageEnum = MovementStageEnum.valueOf(projectMovementStageRequest.getCurrentStage());
        projectMovementStage.setCurrentStage(movementStageEnum);
        projectMovementStage.setUuid(idGeneratorComponent.generateUUID());
        projectMovementStage.setIsDeleted(false);
        LocalDateTime localDateTime = LocalDateTime.now();
        projectMovementStage.setCreatedOn(localDateTime.toLocalDate());
        projectMovementStage.setMovementTime(localDateTime);
        try {
            projectMovementStage = projectMovementRepository.save(projectMovementStage);
            Long projectConceptMasterId = 0L;
            if (projectMovementStageRequest.getRdppMasterId() != null) {
                DppObjectiveCostDTO rdpp = dppObjectiveCostService.getById(projectMovementStageRequest.getRdppMasterId());
                projectConceptMasterId = rdpp.getProjectConceptMasterId();
            } else if (projectMovementStageRequest.getRtappMasterId() != null) {
                TappObjectiveCostDTO rtapp = tappObjectiveCostService.getById(projectMovementStageRequest.getRtappMasterId());
                projectConceptMasterId = rtapp.getProjectConceptMasterId();
            }
            IdHolderRequestBodyDTO request = new IdHolderRequestBodyDTO();
            request.setId(projectConceptMasterId);
            projectConceptService.updateMovementTimeByPcId(request);
            log.info("saved projectMovementStage");
        } catch (Exception ex) {
            log.info("failed projectMovementStage");
        }
        return projectMovementStage;

    }

    @Override
    public ProjectMovementStage getCurrentStageInDpp(Long rdppMasterId) {
        List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByRdppMasterIdOrderByMovementTimeDesc(rdppMasterId);
        if (!projectMovementStageList.isEmpty()) {
            return projectMovementStageList.get(0);
        } else
            return null;
    }

    @Override
    public ProjectMovementStage getCurrentStageInTapp(Long rtappMasterId) {
        List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByRtappMasterIdOrderByMovementTimeDesc(rtappMasterId);
        if (!projectMovementStageList.isEmpty()) {
            return projectMovementStageList.get(0);
        } else
            return null;
    }

    @Override
    public ProjectMovementStage getCurrentStageInProjectConcept(Long pcMasterId) {
        List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByProjectConceptMasterIdOrderByMovementTimeDesc(pcMasterId);
        if (!projectMovementStageList.isEmpty()) {
            return projectMovementStageList.get(0);
        } else
            return null;
    }

    @Override
    public List<ProjectMovementStage> getAllStageByUserId(Long userId) {
        List<ProjectMovementStage> projectMovementStages = projectMovementRepository.findByUserId(userId);
        return projectMovementStages.isEmpty() ? new ArrayList<>() : projectMovementStages;
    }

    @Override
    public List<ProjectMovementStageResponse> getAllStageByMasterId(String source, Long masterId) {
        List<ProjectMovementStage> projectMovementStageList = null;
        if (source.equalsIgnoreCase("rdpp")) {
            projectMovementStageList = projectMovementRepository.findByRdppMasterIdOrderByMovementTimeDesc(masterId);
        } else if (source.equalsIgnoreCase("rtapp")) {
            projectMovementStageList = projectMovementRepository.findByRtappMasterIdOrderByMovementTimeDesc(masterId);
        } else if (source.equalsIgnoreCase("pc")) {
            projectMovementStageList = projectMovementRepository.findByProjectConceptMasterIdOrderByMovementTimeDesc(masterId);
        } else if (source.equalsIgnoreCase("fs")) {
            projectMovementStageList = projectMovementRepository.findByFsProposalMasterIdOrderByMovementTimeDesc(masterId);
        }
        if (projectMovementStageList != null) {
            return projectMovementStageList.stream().map(e -> new ProjectMovementStageResponse() {{
                setCurrentStage(e.getCurrentStage());
                setMovementDate(e.getMovementTime().toLocalDate());
                setMovementTime(e.getMovementTime().toLocalTime());
            }}).collect(Collectors.toList());
        } else
            return null;
    }

    @Override
    public ProjectMovementStage getProjectMovementStage(Long id) {
        Optional<ProjectMovementStage> optProjectMovementStage = projectMovementRepository.findById(id);
        if (optProjectMovementStage.isPresent())
            return optProjectMovementStage.get();
        else
            return null;
    }


    @Override
    public ResponseWithResults saveProjectMovementAttachment(MultipartFile multipartFile, ProjectMovementStage projectMovementStage) {
        Attachment attachment = null;
        if (multipartFile != null) {
            attachment = attachmentUploadService.upload(multipartFile);
        }
        ProjectMovementAttachment projectMovementAttachment = new ProjectMovementAttachment();
        projectMovementAttachment.setProjectMovementStage(projectMovementStage);
        if (attachment != null) {
            projectMovementAttachment.setAttachment(attachment);
        }
        projectMovementAttachment.setUuid(idGeneratorComponent.generateUUID());
        projectMovementAttachment.setIsDeleted(false);
        projectMovementAttachment.setCreatedOn(LocalDate.now());
        projectMovementAttachmentRepository.save(projectMovementAttachment);

        return new ResponseWithResults(200, "Successfully Save Data", projectMovementAttachment);
    }

    @Override
    public List<ProjectMovementStage> getMinistryApprovedProjectConceptList() {
        return projectMovementRepository.findByCurrentStageAndProjectConceptMasterIdIsNotNull(MovementStageEnum.APPROVED_BY_MINISTRY);
    }
}
