package com.ibcs.idsdp.rdpprtapp.web.controller;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.services.AttachmentUploadService;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.model.domain.EffectImpact;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.EffectImpactRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@RestApiController
@RequestMapping("/project-details-partb")
public class EffectImpactController {
    private com.ibcs.idsdp.rdpprtapp.services.EffectImpactService effectImpactService;
    private AttachmentUploadService attachmentUploadService;

    @PostMapping("/create-effect-impact")
    public ResponseEntity<?> createEffectImpact(@RequestBody EffectImpactRequest effectImpactRequest) {
        EffectImpact effectImpact = effectImpactService.saveEffectImpact(effectImpactRequest);
        if (effectImpact != null)
            return new ResponseEntity<>(effectImpact, HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/add-effect-impact-attachment")
    public ResponseEntity<?> addEffectImpactAttachment(@RequestParam(value = "envClearenceAttachment", required = false) MultipartFile envClearenceAttachmentFile, @RequestParam("effectImpactId") Long effectImpactId) {
        EffectImpact effectImpact = effectImpactService.getEffectImpact(effectImpactId);
        Attachment attachment = null;
        if (envClearenceAttachmentFile != null) {
            attachment = attachmentUploadService.upload(envClearenceAttachmentFile);
        }
        effectImpact.setEnvClearenceAttachmentId(attachment);
        Boolean success = effectImpactService.updateEffectImpact(effectImpact);
        if (success)
            return new ResponseEntity<>(HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("/getEffectImpact/{projectId}")
    public EffectImpact getEffectImpactByProjectId(@PathVariable("projectId") String uuid) {
        return effectImpactService.getEffectImpact(uuid);

    }

    @PutMapping("/update-effect-impact/{id}")
    public EffectImpact updateProjectDetails(@RequestBody EffectImpactRequest effectImpactRequest, @PathVariable String id) {
       return effectImpactService.updateEffectImpact(effectImpactRequest, id);
    }
}
