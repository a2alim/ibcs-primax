package com.ibcs.idsdp.common.web.controller;


import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.DashboardAttachment;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.DashboardAttachmentService;
import com.ibcs.idsdp.common.web.dto.response.DashboardAttachmentResponse;
import com.ibcs.idsdp.config.annotations.RestApiController;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestApiController
@RequestMapping("dashboardAttachment")
public class DashboardAttachmentController extends BaseController<DashboardAttachment, DashboardAttachmentResponse> {
    private final DashboardAttachmentService dashboardAttachmentService;

    DashboardAttachmentController(DashboardAttachmentService dashboardAttachmentService, BaseService<DashboardAttachment, DashboardAttachmentResponse> service) {
        super(service);
        this.dashboardAttachmentService = dashboardAttachmentService;
    }

    @PostMapping("/createDashBoardAttachment")
    ResponseEntity<String> createDashBoardAttachment(@RequestParam MultipartFile attachmentFile, String title, Long projectSummaryId, String projectType) {
        dashboardAttachmentService.create(attachmentFile, title, projectSummaryId, projectType);
        return new ResponseEntity<String>(HttpStatus.CREATED);
    }

    @PutMapping("/updateDashBoardAttachment/{uuid}")
    ResponseEntity<String> updateDashBoardAttachment(@RequestParam(value = "attachmentFile", required = false) MultipartFile attachmentFile, @RequestParam Long projectSummaryId, @RequestParam String title, @RequestParam String projectType, @PathVariable String uuid) {
        dashboardAttachmentService.updateDashBoardAttachment(attachmentFile, title, uuid, projectSummaryId, projectType);
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @GetMapping("/getPageableList/{id}/{projectType}")
    Page<DashboardAttachment> getPageableList(@PathVariable Long id, @PathVariable String projectType, @RequestParam(name = "page", defaultValue = "0") int page,
                                              @RequestParam(name = "size", defaultValue = "10") int size) {
        return (Page<DashboardAttachment>) dashboardAttachmentService.getPageableList(page, size, id, projectType);
    }

    @GetMapping("/getByPcIdAndProjectType/{id}/{projectType}")
    List<Attachment> getByPcIdAndProjectType(@PathVariable Long id, @PathVariable String projectType) {
        return dashboardAttachmentService.getByPcIdAndProjectType(id, projectType);
    }

    @PostMapping("/createRdppRtappDashBoardAttachment")
    ResponseEntity<String> createRdppRtappDashBoardAttachment(@RequestParam MultipartFile attachmentFile, String title, Long rdppRtappMasterId, String projectType) {
        dashboardAttachmentService.createRdppRtappDashBoardAttachment(attachmentFile, title, rdppRtappMasterId, projectType);
        return new ResponseEntity<String>(HttpStatus.CREATED);
    }

    @PutMapping("/updateRdppRtappDashBoardAttachment/{uuid}")
    ResponseEntity<String> updateRdppRtappDashBoardAttachment(@RequestParam(value = "attachmentFile", required = false) MultipartFile attachmentFile, @RequestParam Long rdppRtappMasterId, @RequestParam String title, @RequestParam String projectType, @PathVariable String uuid) {
        dashboardAttachmentService.updateRdppRtappDashBoardAttachment(attachmentFile, title, uuid, rdppRtappMasterId, projectType);
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @GetMapping("/getRdppRtappPageableList/{rdppRtappMasterId}/{projectType}")
    Page<DashboardAttachment> getRdppRtappPageableList(@PathVariable Long rdppRtappMasterId, @PathVariable String projectType, @RequestParam(name = "page", defaultValue = "0") int page,
                                                       @RequestParam(name = "size", defaultValue = "10") int size) {
        return (Page<DashboardAttachment>) dashboardAttachmentService.getRdppRtappPageableList(rdppRtappMasterId, projectType, page, size);
    }
}
