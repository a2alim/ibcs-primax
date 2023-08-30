package com.ibcs.idsdp.common.services;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.DashboardAttachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.model.repositories.DashboardAttachmentRepository;
import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.common.web.dto.response.DashboardAttachmentResponse;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@Service
public class DashboardAttachmentService extends BaseService<DashboardAttachment, DashboardAttachmentResponse> {
    private final DashboardAttachmentRepository repository;
    private final AttachmentUploadService attachmentUploadService;
    private final IdGeneratorComponent idGeneratorComponent;
    private final AttachmentRepository attachmentRepository;

    DashboardAttachmentService(DashboardAttachmentRepository repository, AttachmentUploadService attachmentUploadService, IdGeneratorComponent idGeneratorComponent, AttachmentRepository attachmentRepository) {
        super(repository);
        this.repository = repository;
        this.attachmentUploadService = attachmentUploadService;
        this.idGeneratorComponent = idGeneratorComponent;
        this.attachmentRepository = attachmentRepository;
    }

    public String create(MultipartFile attachmentFile, String title, Long projectSummaryId, String projectType) {
        DashboardAttachment dashboardAttachment = createAttachment(attachmentFile, title, projectType);
        dashboardAttachment.setProjectSummaryId(projectSummaryId);
        repository.save(dashboardAttachment);
        return null;
    }

    public String updateDashBoardAttachment(MultipartFile attachmentFile, String title, String uuid, Long projectSummaryId, String projectType) {
        try {
            DashboardAttachment dashboardAttachment = updateAttachment(attachmentFile, title, uuid, projectType);
            dashboardAttachment.setProjectSummaryId(projectSummaryId);
            repository.save(dashboardAttachment);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private DashboardAttachment createAttachment(MultipartFile attachmentFile, String title, String projectType) {
        Attachment attachment = this.attachmentUploadService.upload(attachmentFile);
        String uuid = idGeneratorComponent.generateUUID();
        DashboardAttachment dashboardAttachment = new DashboardAttachment();
        dashboardAttachment.setIsDeleted(false);
        dashboardAttachment.setCreatedOn(LocalDate.now());
        dashboardAttachment.setUuid(uuid);
        dashboardAttachment.setTitle(title);
        dashboardAttachment.setProjectType(projectType);
        dashboardAttachment.setAttachment(attachment);
        return dashboardAttachment;
    }

    public DashboardAttachment updateAttachment(MultipartFile attachmentFile, String title, String uuid, String projectType) {
        try {
            Attachment attachment = null;
            if (attachmentFile != null) {
                attachment = this.attachmentUploadService.upload(attachmentFile);
            }
            Optional<DashboardAttachment> dashboardAttachmentOptional = repository.findByUuidAndIsDeleted(uuid, false);
            DashboardAttachment dashboardAttachment = dashboardAttachmentOptional.get();
            dashboardAttachment.setCreatedOn(LocalDate.now());
            dashboardAttachment.setTitle(title);
            dashboardAttachment.setProjectType(projectType);
            if (attachment != null) {
                dashboardAttachment.setAttachment(attachment);
            }
            return dashboardAttachment;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String createRdppRtappDashBoardAttachment(MultipartFile attachmentFile, String title, Long rdppRtappMasterId, String projectType) {
        DashboardAttachment dashboardAttachment = createAttachment(attachmentFile, title, projectType);
        dashboardAttachment.setRdppRtappMasterId(rdppRtappMasterId);
        repository.save(dashboardAttachment);
        return null;
    }

    public String updateRdppRtappDashBoardAttachment(MultipartFile attachmentFile, String title, String uuid, Long rdppRtappMasterId, String projectType) {
        try {
            DashboardAttachment dashboardAttachment = updateAttachment(attachmentFile, title, uuid, projectType);
            dashboardAttachment.setRdppRtappMasterId(rdppRtappMasterId);
            repository.save(dashboardAttachment);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public Page<DashboardAttachment> getRdppRtappPageableList(Long RdppRtappMasterId, String projectType, int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<DashboardAttachment> pageResult = repository.findAllByRdppRtappMasterIdAndProjectTypeAndIsDeletedOrderByIdDesc(RdppRtappMasterId, projectType, false, pageRequest);
            List<DashboardAttachment> dashboardAttachmentList = pageResult.stream().collect(toList());
            return new PageImpl<>(dashboardAttachmentList, pageRequest, pageResult.getTotalElements());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public Page<DashboardAttachment> getPageableList(int page, int size, Long id, String projectType) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<DashboardAttachment> pageResult = repository.findAllByIsDeletedAndProjectSummaryIdAndProjectTypeOrderByIdDesc(false, id, projectType, pageRequest);
            List<DashboardAttachment> dashboardAttachmentList = pageResult.stream().collect(toList());
            return new PageImpl<>(dashboardAttachmentList, pageRequest, pageResult.getTotalElements());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Attachment> getByPcIdAndProjectType(Long id, String projectType) {
        List<DashboardAttachment> list = repository.findAllByIsDeletedAndProjectSummaryIdAndProjectType(false, id, projectType);
        if(!list.isEmpty()) {
            return list.stream().map(DashboardAttachment::getAttachment).collect(toList());
        }
        else
            return null;
    }

    @Override
    public BooleanValueHolderDTO delete(@NonNull String oid) {
        if (oid == null)
            throw new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException("No Id Provided for DashboardAttachment");
        DashboardAttachment e = getByUuidForRead(oid);
        e.setIsDeleted(true);
        e.setUpdatedOn(LocalDate.now());
        repository.save(e);
        return new BooleanValueHolderDTO() {{ setValue(true); }};
    }
}

