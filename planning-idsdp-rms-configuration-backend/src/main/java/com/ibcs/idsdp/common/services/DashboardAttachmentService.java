package com.ibcs.idsdp.common.services;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.DashboardAttachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.model.repositories.DashboardAttachmentRepository;
import com.ibcs.idsdp.common.web.dto.response.DashboardAttachmentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@Service
@Transactional
public class DashboardAttachmentService extends BaseService<DashboardAttachment, DashboardAttachmentResponse,DashboardAttachmentResponse> {
    private final DashboardAttachmentRepository dashboardAttachmentRepository;
    private final AttachmentUploadService attachmentUploadService;
    private final IdGeneratorComponent idGeneratorComponent;
    private final AttachmentRepository attachmentRepository;

    DashboardAttachmentService(DashboardAttachmentRepository dashboardAttachmentRepository, AttachmentUploadService attachmentUploadService, IdGeneratorComponent idGeneratorComponent, AttachmentRepository attachmentRepository) {
        super(dashboardAttachmentRepository);
        this.dashboardAttachmentRepository = dashboardAttachmentRepository;
        this.attachmentUploadService = attachmentUploadService;
        this.idGeneratorComponent = idGeneratorComponent;
        this.attachmentRepository = attachmentRepository;
    }

    public String create(MultipartFile attachmentFile, String title, Long projectSummaryId, String projectType) {
        Attachment attachment = this.attachmentUploadService.upload(attachmentFile);
        String uuid = idGeneratorComponent.generateUUID();
        DashboardAttachment dashboardAttachment = new DashboardAttachment();
        dashboardAttachment.setCreatedBy("user");
        dashboardAttachment.setIsDeleted(false);
        dashboardAttachment.setCreatedOn(LocalDate.now());
        dashboardAttachment.setUuid(uuid);
        dashboardAttachment.setTitle(title);
        dashboardAttachment.setProjectSummaryId(projectSummaryId);
        dashboardAttachment.setProjectType(projectType);
        dashboardAttachment.setAttachment(attachment);
        dashboardAttachmentRepository.save(dashboardAttachment);
        return null;
    }

    public String updateDashBoardAttachment(MultipartFile attachmentFile, String title, String uuid, Long projectSummaryId, String projectType) {

        try {
            Attachment attachment = null;
            if (attachmentFile != null) {
                attachment = this.attachmentUploadService.upload(attachmentFile);
            }
            Optional<DashboardAttachment> dashboardAttachmentOptional = dashboardAttachmentRepository.findByUuidAndIsDeleted(uuid, false);
            DashboardAttachment dashboardAttachment = dashboardAttachmentOptional.get();
            dashboardAttachment.setCreatedBy("user");
            dashboardAttachment.setCreatedOn(LocalDate.now());
            dashboardAttachment.setTitle(title);
            dashboardAttachment.setProjectType(projectType);
            dashboardAttachment.setProjectSummaryId(projectSummaryId);
            if (attachment != null) {
                dashboardAttachment.setAttachment(attachment);
            }
            dashboardAttachmentRepository.save(dashboardAttachment);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public Page<DashboardAttachment> getPageableList(int page, int size, Long id, String projectType) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<DashboardAttachment> pageResult = dashboardAttachmentRepository.findAllByIsDeletedAndProjectSummaryIdAndProjectType(false, id, projectType, pageRequest);
            List<DashboardAttachment> dashboardAttachmentList = pageResult
                    .stream()
                    .collect(toList());
            return new PageImpl<>(dashboardAttachmentList, pageRequest, pageResult.getTotalElements());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}

