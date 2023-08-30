package com.ibcs.idsdp.dpptapp.web.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.services.AttachmentUploadService;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.model.domain.DppAnnexVVI;
import com.ibcs.idsdp.dpptapp.services.DppAnnexVVIService;
import com.ibcs.idsdp.dpptapp.web.dto.request.DppAnnexVVIRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@RestApiController
@RequestMapping("/project-details-partb")
public class DppAnnexVVIController {

    private final AttachmentUploadService attachmentUploadService;
    private DppAnnexVVIService dppAnnexVVIService;

    @PostMapping("/create-annex-vvi")
    public ResponseStatus createAnnexVVI(@RequestParam(value = "attachmentFile", required = false) MultipartFile attachmentFile,@RequestParam("annex-vvi") String annex) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        DppAnnexVVIRequest dppAnnexVVIRequest = objectMapper.readValue(annex, DppAnnexVVIRequest.class);
        DppAnnexVVI dppAnnexVVI = dppAnnexVVIService.saveAnnexVVI(dppAnnexVVIRequest);
        Attachment attachment = null;
        if (attachmentFile != null) {
            attachment = attachmentUploadService.upload(attachmentFile);
            dppAnnexVVI.setAttachmentId(attachment);
        }
        Boolean success = dppAnnexVVIService.update(dppAnnexVVI);

        if (success) {
            return new ResponseStatus(201, "Succesfully Save Data");
        } else {
            return new ResponseStatus(500, "Internal Server Error");
        }
    }

    @GetMapping("/get-annex-v-vi/{projectId}")
    public DppAnnexVVI getAnnexV_VI(@PathVariable("projectId") String uuid){
        System.out.println("controller hitted..................................");
        return dppAnnexVVIService.getAnnexV_VIByProjectId(uuid);

    }

    // For update Other Details by Object and project id
    @PutMapping("/updateAnnex/{id}")
//    public void updateAnnexVVI(@RequestBody DppAnnexVVIRequest request,@PathVariable String id) {
//        System.out.println("controller...............");
//        dppAnnexVVIService.updateAnnexV_VI(request,id);
//    }

    public ResponseStatus updateAnexVI(@RequestParam(value = "attachmentFile", required = false) MultipartFile attachmentFile,@RequestParam("annex-vvi") String annex, @PathVariable String id) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        DppAnnexVVIRequest dppAnnexVVIRequest = objectMapper.readValue(annex, DppAnnexVVIRequest.class);
        DppAnnexVVI dppAnnexVVI = dppAnnexVVIService.updateAnnexV_VI(dppAnnexVVIRequest, id);
        Attachment attachment = null;
        if (attachmentFile != null) {
            attachment = attachmentUploadService.upload(attachmentFile);
        }
        dppAnnexVVI.setAttachmentId(attachment);
        Boolean success = dppAnnexVVIService.update(dppAnnexVVI);
        if (success) {
            return new ResponseStatus(200, "Succesfully Save Data");
        } else {
            return new ResponseStatus(500, "Internal Server Error");
        }
    }
}
