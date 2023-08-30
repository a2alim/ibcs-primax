package com.ibcs.idsdp.common.web.controller;


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

@RestApiController
@RequestMapping("dashboardAttachment")
public class DashboardAttachmentController extends BaseController<DashboardAttachment, DashboardAttachmentResponse,DashboardAttachmentResponse> {
    private final DashboardAttachmentService dashboardAttachmentService;

    DashboardAttachmentController(DashboardAttachmentService dashboardAttachmentService, BaseService<DashboardAttachment, DashboardAttachmentResponse,DashboardAttachmentResponse> service) {
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

}
