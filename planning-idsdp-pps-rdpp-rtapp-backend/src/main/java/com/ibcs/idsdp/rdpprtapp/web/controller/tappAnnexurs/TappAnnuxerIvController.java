package com.ibcs.idsdp.rdpprtapp.web.controller.tappAnnexurs;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.services.AttachmentUploadService;
import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.rdpprtapp.model.domain.tappAnnexurs.TappAnnexureFour;
import com.ibcs.idsdp.rdpprtapp.model.repositories.tappAnnexurs.TappAnnexureFourRepository;
import com.ibcs.idsdp.rdpprtapp.services.DppAnnexVVIService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.tappAnnexurs.TappAnnexureFourRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@RestApiController
@RequestMapping("/tapp-annexure-iv")

public class TappAnnuxerIvController {

    private final AttachmentUploadService attachmentUploadService;
    private DppAnnexVVIService dppAnnexVVIService;
    private final TappAnnexureFourRepository tappAnnexureFourRepository;
    private AttachmentRepository attachmentRepository;
    private ProjectConceptClientService projectConceptClientService;

    /**
     * @param attachmentFile
     * @param projectConceptUuid
     * @return
     * @throws JsonProcessingException
     */
    @PostMapping("/create")
    public ResponseEntity<?> createAnnexVVI(@RequestParam(value = "attachmentFile", required = false) MultipartFile attachmentFile,@RequestParam("projectConceptUuid") String projectConceptUuid ) throws JsonProcessingException {

        boolean success = false;

        ObjectMapper objectMapper = new ObjectMapper();
        TappAnnexureFourRequest tappAnnexureFourRequest = objectMapper.readValue(projectConceptUuid, TappAnnexureFourRequest.class);

        ProjectConceptResponse projectConceptResponse = projectConceptClientService.getProjectConceptByUuid(tappAnnexureFourRequest.getProjectConceptUuid());
        if(projectConceptResponse.getId() < 1)
        {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        Attachment attachment = null;
        if (attachmentFile != null) {
            attachment = attachmentUploadService.upload(attachmentFile);

            if(attachment != null)
            {
                /*-----For create tapp annexure iv records */
                TappAnnexureFour annexureFour = new TappAnnexureFour();
                annexureFour.setAttachment(attachment); // Get attachment id
                annexureFour.setProjectConceptUuid(tappAnnexureFourRequest.getProjectConceptUuid());
                annexureFour.setProjectConceptMasterId(projectConceptResponse.getId());
                annexureFour.setCreatedBy("admin");
                annexureFour.setCreatedOn(LocalDate.now());
                annexureFour.setIsDeleted(false);
                annexureFour.setUuid(UUID.randomUUID().toString());
                tappAnnexureFourRepository.save(annexureFour);
                success=true;
            }
            else
            {
                success=false;
            }
        }

        if(success)
            return new ResponseEntity<>(HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * For get tapp annexure iv records
     * @return
     */
    @GetMapping("get-file")
    public TappAnnexureFour getAttachmentFile(){
        Optional<TappAnnexureFour> tappAnnexureFour = tappAnnexureFourRepository.findAll().stream().findFirst();
        if(tappAnnexureFour.isEmpty()) {
            return new TappAnnexureFour();
        }
        else{
            return tappAnnexureFour.get();
        }
    }

    /**
     * For delete tapp annexure iv records
     * @param id
     * @return
     */
    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<Long> deletePost(@PathVariable Long id) {

        Attachment attachment = attachmentRepository.findById(id).get();
        TappAnnexureFour tappAnnexureFour  = tappAnnexureFourRepository.findByAttachment(attachment).get();

        tappAnnexureFourRepository.delete(tappAnnexureFour);
         attachmentRepository.delete(attachment);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }
}
