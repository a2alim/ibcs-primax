package com.ibcs.idsdp.dpptapp.approval_process_flow.services.impl;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.ProjectMovementAttachment;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.repositories.ProjectMovementAttachmentRepository;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.repositories.ProjectMovementRepository;
import com.ibcs.idsdp.dpptapp.approval_process_flow.services.ProjectMovementAttachmentService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.beans.support.PagedListHolder.DEFAULT_PAGE_SIZE;

@AllArgsConstructor
@Service
public class ProjectMovementAttachmentServiceImpl implements ProjectMovementAttachmentService {

    ProjectMovementAttachmentRepository projectMovementAttachmentRepository;
    ProjectMovementRepository projectMovementRepository;

    @Override
    public ProjectMovementAttachment getProjectMovementAttachmentByProjectMovementId(Long projectMovementId) {
        ProjectMovementAttachment projectMovementAttachment = projectMovementAttachmentRepository.findByProjectMovementStageIdAndPaperTypeIsNull(projectMovementId);
        return projectMovementAttachment;
    }

    public Pageable getPageable(PageableRequestBodyDTO requestDTO) {
        PageableRequestBodyDTO pageSettings = new PageableRequestBodyDTO() {{
            setPage(0);
            setSize(DEFAULT_PAGE_SIZE);
        }};
        if (requestDTO != null && requestDTO.getPage() != null && requestDTO.getSize() != null) {
            pageSettings = requestDTO;
        }
        return PageRequest.of(pageSettings.getPage(), pageSettings.getSize());
    }

    private List<Long> getProjectMovementStageIds(Long projectMovementId) {
        Optional<ProjectMovementStage> optProjectMovementStage = projectMovementRepository.findById(projectMovementId);
        List<Long> projectMovementStageIds = null;
        if (optProjectMovementStage.isPresent()) {
            ProjectMovementStage projectMovementStage = optProjectMovementStage.get();
            if (projectMovementStage.getDppMasterId() != null) {
                List<ProjectMovementStage> byDppMasterIdOrderByMovementTimeDesc = projectMovementRepository.findByDppMasterIdOrderByMovementTimeDesc(projectMovementStage.getDppMasterId());
                projectMovementStageIds = byDppMasterIdOrderByMovementTimeDesc.stream().map(ProjectMovementStage::getId).collect(Collectors.toList());
            } else if (projectMovementStage.getTappMasterId() != null) {
                List<ProjectMovementStage> byDppMasterIdOrderByMovementTimeDesc = projectMovementRepository.findByTappMasterIdOrderByMovementTimeDesc(projectMovementStage.getTappMasterId());
                projectMovementStageIds = byDppMasterIdOrderByMovementTimeDesc.stream().map(ProjectMovementStage::getId).collect(Collectors.toList());
            } else if (projectMovementStage.getRdppMasterId() != null) {
                List<ProjectMovementStage> byDppMasterIdOrderByMovementTimeDesc = projectMovementRepository.findByRdppMasterIdOrderByMovementTimeDesc(projectMovementStage.getRdppMasterId());
                projectMovementStageIds = byDppMasterIdOrderByMovementTimeDesc.stream().map(ProjectMovementStage::getId).collect(Collectors.toList());
            } else if (projectMovementStage.getRtappMasterId() != null) {
                List<ProjectMovementStage> byDppMasterIdOrderByMovementTimeDesc = projectMovementRepository.findByRtappMasterIdOrderByMovementTimeDesc(projectMovementStage.getRtappMasterId());
                projectMovementStageIds = byDppMasterIdOrderByMovementTimeDesc.stream().map(ProjectMovementStage::getId).collect(Collectors.toList());
            } else if (projectMovementStage.getProjectConceptMasterId() != null) {
                List<ProjectMovementStage> byDppMasterIdOrderByMovementTimeDesc = projectMovementRepository.findByProjectConceptMasterIdOrderByMovementTimeDesc(projectMovementStage.getProjectConceptMasterId());
                projectMovementStageIds = byDppMasterIdOrderByMovementTimeDesc.stream().map(ProjectMovementStage::getId).collect(Collectors.toList());
            }
        }
        return projectMovementStageIds;
    }

    @Override
    public Page<Attachment> getAttachmentById(Long projectMovementId, PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = getPageable(requestBodyDTO);
        List<Long> projectMovementStageIds = getProjectMovementStageIds(projectMovementId);
        Page<ProjectMovementAttachment> list = projectMovementAttachmentRepository.findByProjectMovementStageIdInOrderByIdDesc(projectMovementStageIds, pageable);
        return new PageImpl<>(list.getContent().stream().map(ProjectMovementAttachment::getAttachment).collect(Collectors.toList()), pageable, list.getTotalElements());
    }

    @Override
    public List<ProjectMovementAttachment> getAllProjectMovementAttachmentById(Long projectMovementId) {
        List<Long> projectMovementStageIds = getProjectMovementStageIds(projectMovementId);
        List<ProjectMovementAttachment> list = projectMovementAttachmentRepository.findAllByProjectMovementStageIdInOrderByIdDesc(projectMovementStageIds);
        return list;
    }

    @Override
    public Page<ProjectMovementAttachment> getProjectMovementAttachmentById(Long projectMovementId, PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = getPageable(requestBodyDTO);
        List<Long> projectMovementStageIds = getProjectMovementStageIds(projectMovementId);
        Page<ProjectMovementAttachment> list = projectMovementAttachmentRepository.findByProjectMovementStageIdInOrderByIdDesc(projectMovementStageIds, pageable);
        return list;
    }
}
