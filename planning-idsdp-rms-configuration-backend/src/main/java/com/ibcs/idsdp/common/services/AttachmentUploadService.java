package com.ibcs.idsdp.common.services;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.web.dto.response.AttachmentResponse;
import com.ibcs.idsdp.common.web.dto.response.AttachmentSuccessResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDate;

@Service
@AllArgsConstructor
public class AttachmentUploadService {

    AttachmentStorageService attachmentStorageService;
    AttachmentRepository attachmentRepository;
    private IdGeneratorComponent idGeneratorComponent;

    public Attachment upload(MultipartFile file) {
        String fileName = null;
        String fileDownloadUri = null;

        if (!file.isEmpty()) {
            fileName = attachmentStorageService.storeFile(file, file.getOriginalFilename());
            fileDownloadUri = "attachment/view/" + fileName;
        } else {
            System.err.println("File Not found");
        }

        try {
            String uuid = idGeneratorComponent.generateUUID();
            Attachment attachment = new Attachment();
            attachment.setCreatedBy("user");
            attachment.setIsDeleted(false);
            attachment.setCreatedOn(LocalDate.now());
            attachment.setUuid(uuid);
            attachment.setFileName(fileName);
            attachment.setName(file.getOriginalFilename());
            attachment.setFileType(file.getContentType());
            attachment.setUrlPath(fileDownloadUri);
            attachmentRepository.save(attachment);
            return attachment;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public AttachmentResponse getById(Long id) {
        try {
            Attachment attachment = attachmentRepository.findById(id).get();
            AttachmentResponse attachmentResponse = new AttachmentResponse();
            attachmentResponse.setId(attachment.getId());
            attachmentResponse.setFileType(attachment.getFileType());
            attachmentResponse.setFileName(attachment.getFileName());
            attachmentResponse.setName(attachment.getName());
            attachmentResponse.setPathUrl(attachment.getUrlPath());
            return attachmentResponse;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public AttachmentSuccessResponse deleteById(Long id) {
        try {
            Attachment attachment = attachmentRepository.findById(id).get();
            attachmentRepository.delete(attachment);
            AttachmentSuccessResponse attachmentResponse = new AttachmentSuccessResponse();
            attachmentResponse.setSuccess("SuccessFully Deleted Attachment");
            return attachmentResponse;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}
