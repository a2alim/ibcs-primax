package com.ibcs.idsdp.common.web.controller;

import com.ibcs.idsdp.common.exceptions.exception.ResourceNotFoundException;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.services.AttachmentStorageService;
import com.ibcs.idsdp.common.services.AttachmentUploadService;
import com.ibcs.idsdp.common.web.dto.response.AttachmentResponse;
import com.ibcs.idsdp.common.web.dto.response.AttachmentSuccessResponse;
import com.ibcs.idsdp.config.annotations.RestApiController;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;


@RestApiController
@AllArgsConstructor
@RequestMapping("attachment")
public class AttachmentController {

    private final AttachmentStorageService attachmentStorageService;

    private final AttachmentUploadService attachmentUploadService;

    @PostMapping("/create")
    public ResponseEntity<?> uploadAttachment(@RequestParam(value = "attachmentFile", required = false) MultipartFile attachmentFile) {
            Attachment attachment = null;
            if (attachmentFile != null) {
                attachment = attachmentUploadService.upload(attachmentFile);
            }
            AttachmentResponse attachmentResponse = new AttachmentResponse();
            attachmentResponse.setId(attachment.getId());
            attachmentResponse.setPathUrl(attachment.getUrlPath());
            attachmentResponse.setFileName(attachment.getFileName());
            attachmentResponse.setFileType(attachment.getFileType());
            return new ResponseEntity<>(attachmentResponse, HttpStatus.OK);
    }


    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = attachmentStorageService.loadFileAsResource(fileName);
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            throw new ResourceNotFoundException("File Not Found");
        }
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/get-by-id/{id}")
    public AttachmentResponse getById(@PathVariable Long id) {
       AttachmentResponse attachmentResponse = attachmentUploadService.getById(id);
        return attachmentResponse;
    }

    @DeleteMapping("/delete/{id}")
    public AttachmentSuccessResponse deleteById(@PathVariable Long id) {
        AttachmentSuccessResponse attachmentResponse = attachmentUploadService.deleteById(id);
        return attachmentResponse;
    }




}
