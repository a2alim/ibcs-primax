package com.ibcs.idsdp.dpptapp.web.controller.tappAnnexurs;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.services.AttachmentUploadService;
import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.model.domain.tappAnnexurs.TappAnnexureFour;
import com.ibcs.idsdp.dpptapp.model.repositories.tappAnnexurs.TappAnnexureFourRepository;
import com.ibcs.idsdp.dpptapp.services.DppAnnexVVIService;
import com.ibcs.idsdp.dpptapp.web.dto.request.tappAnnexurs.TappAnnexureFourRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
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

        ProjectConceptResponse projectConceptResponse = projectConceptClientService.getProjectConceptMasterId(tappAnnexureFourRequest.getProjectConceptUuid());
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

    @PostMapping("/save")
    public TappAnnexureFour saveAnnexureIV(@RequestParam(value = "attachment") MultipartFile attachment, @RequestParam("pcId") String pcId, @RequestParam("pcUuid") String pcUuid) throws JsonProcessingException {
        TappAnnexureFour annexureFour = new TappAnnexureFour();
        if (attachment != null) {
            Attachment attachmentFile = attachmentUploadService.upload(attachment);
            if(attachmentFile != null) {
                List<TappAnnexureFour> annexureIV = tappAnnexureFourRepository.findAllByProjectConceptMasterIdAndProjectConceptUuidAndIsDeleted(Long.valueOf(pcId), pcUuid, false);
                if (annexureIV.size()>0) {
                    Long preAttachmentId = annexureIV.get(0).getAttachment().getId();
                    annexureFour = annexureIV.get(0);
                    annexureFour.setAttachment(attachmentFile);
                    annexureFour.setUpdatedBy("admin");
                    annexureFour.setUpdatedOn(LocalDate.now());
                    TappAnnexureFour newTapp = tappAnnexureFourRepository.save(annexureFour);
                    if (newTapp != null) {
                        Attachment preAttachment = attachmentRepository.findById(preAttachmentId).get();
                        attachmentRepository.delete(preAttachment);
                    }
                } else {
                    annexureFour.setAttachment(attachmentFile);
                    annexureFour.setProjectConceptUuid(pcUuid);
                    annexureFour.setProjectConceptMasterId(Long.valueOf(pcId));
                    annexureFour.setCreatedBy("admin");
                    annexureFour.setCreatedOn(LocalDate.now());
                    annexureFour.setIsDeleted(false);
                    annexureFour.setUuid(UUID.randomUUID().toString());
                    tappAnnexureFourRepository.save(annexureFour);
                }
            }
        }
        return annexureFour;
    }

    @GetMapping("get-AnnexureIV-file/{pcUuid}")
    public TappAnnexureFour getAnnexureIVAttachmentFile(@PathVariable String pcUuid){
        List<TappAnnexureFour> tappAnnexureFour = tappAnnexureFourRepository.findAllByProjectConceptUuidAndIsDeleted(pcUuid, false);
        if(tappAnnexureFour.isEmpty()) {
            return new TappAnnexureFour();
        } else {
            return tappAnnexureFour.get(0);
        }
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
        Optional<TappAnnexureFour> tappAnnexureFour = tappAnnexureFourRepository.findByAttachment(attachment);
        if (tappAnnexureFour.isPresent()) {
            tappAnnexureFourRepository.delete(tappAnnexureFour.get());
            attachmentRepository.delete(attachment);
        }

        return new ResponseEntity<>(id, HttpStatus.OK);
    }
}
