package com.ibcs.idsdp.rdpprtapp.web.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.services.AttachmentUploadService;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.model.domain.RtappAnnexureTwoEntity;
import com.ibcs.idsdp.rdpprtapp.model.repositories.RtappAnnexureTwoNewRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.RtappAnnexureTwoRepository;
import com.ibcs.idsdp.rdpprtapp.services.RtappAnnexureTwoService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.RtappAnnexureTwoDto;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/work-plan")
public class RtappAnnexureTwoController {

    @Autowired
    private RtappAnnexureTwoService rtappAnnexureTwoService;
    @Autowired
    private final AttachmentUploadService attachmentUploadService;
    @Autowired
    private RtappAnnexureTwoNewRepository rtappAnnexureTwoRepository;
    @Autowired
    private AttachmentRepository attachmentRepository;

    /**
     *
     * @param request
     * @return
     */
    @PostMapping(path = "/save-work-plan", produces = "application/json")
    public ResponseWithResults saveWorkPlanList(@RequestBody List<RtappAnnexureTwoDto> request) {
            return rtappAnnexureTwoService.saveWorkPlanList(request);
    }

    /**
     *
     * @param rtappMasterId
     * @return
     */
    @GetMapping(path = "/get-work-plan-list" + "/{rtappMasterId}", produces = "application/json")
    public ResponseWithResults getAllWorkPlan(@PathVariable Long rtappMasterId) {
        return rtappAnnexureTwoService.getAllWorkPlan(rtappMasterId);
    }

    /**
     *
     * @param id
     * @return
     */
    @DeleteMapping("/delete-by-id/{id}")
    public ResponseWithResults deleteWorkPlan(@PathVariable Long id) {
        return rtappAnnexureTwoService.deleteWorkPlan(id);
    }

    @PostMapping("/save")
    public RtappAnnexureTwoEntity saveAnnexureIV(@RequestParam(value = "attachment") MultipartFile attachment, @RequestParam("rtappId") String rtappId, @RequestParam("rtappUuid") String rtappUuid) throws JsonProcessingException {
        RtappAnnexureTwoEntity rtappAnnexureTwo = new RtappAnnexureTwoEntity();
        if (attachment != null) {
            Attachment attachmentFile = attachmentUploadService.upload(attachment);
            if(attachmentFile != null) {
                List<RtappAnnexureTwoEntity> annexureII = rtappAnnexureTwoRepository.findAllByRtappIdAndRtappUuidAndIsDeleted(Long.valueOf(rtappId), rtappUuid, false);
                if (annexureII.size()>0) {
                    Long preAttachmentId = annexureII.get(0).getAttachment().getId();
                    rtappAnnexureTwo = annexureII.get(0);
                    rtappAnnexureTwo.setAttachment(attachmentFile);
                    rtappAnnexureTwo.setUpdatedBy("admin");
                    rtappAnnexureTwo.setUpdatedOn(LocalDate.now());
                    RtappAnnexureTwoEntity newTapp = rtappAnnexureTwoRepository.save(rtappAnnexureTwo);
                    if (newTapp != null) {
                        Attachment preAttachment = attachmentRepository.findById(preAttachmentId).get();
                        attachmentRepository.delete(preAttachment);
                    }
                } else {
                    rtappAnnexureTwo.setAttachment(attachmentFile);
                    rtappAnnexureTwo.setRtappUuid(rtappUuid);
                    rtappAnnexureTwo.setRtappId(Long.valueOf(rtappId));
                    rtappAnnexureTwo.setCreatedBy("admin");
                    rtappAnnexureTwo.setCreatedOn(LocalDate.now());
                    rtappAnnexureTwo.setIsDeleted(false);
                    rtappAnnexureTwo.setUuid(UUID.randomUUID().toString());
                    rtappAnnexureTwoRepository.save(rtappAnnexureTwo);
                }
            }
        }
        return rtappAnnexureTwo;
    }

    @GetMapping("get-annexure-two-file/{rtappUuid}")
    public RtappAnnexureTwoEntity getAnnexureIVAttachmentFile(@PathVariable String rtappUuid){
        List<RtappAnnexureTwoEntity> tappAnnexureFour = rtappAnnexureTwoRepository.findAllByRtappUuidAndIsDeleted(rtappUuid, false);
        if(tappAnnexureFour.isEmpty()) {
            return new RtappAnnexureTwoEntity();
        } else {
            return tappAnnexureFour.get(0);
        }
    }

    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<Long> deletePost(@PathVariable Long id) {

        Attachment attachment = attachmentRepository.findById(id).get();
        Optional<RtappAnnexureTwoEntity> rtappAnnexureTwo = rtappAnnexureTwoRepository.findByAttachment(attachment);
        if (rtappAnnexureTwo.isPresent()) {
            rtappAnnexureTwoRepository.delete(rtappAnnexureTwo.get());
            attachmentRepository.delete(attachment);
        }

        return new ResponseEntity<>(id, HttpStatus.OK);
    }


}

