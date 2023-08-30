package com.ibcs.idsdp.common.web.controller;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.services.AttachmentStorageService;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.services.DashboardService;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;


@RestApiController
public class ZipDownloadController {

    private final AttachmentStorageService attachmentStorageService;
    private final DashboardService dashboardService;
    private final AttachmentRepository attachmentRepository;

    public ZipDownloadController(AttachmentStorageService attachmentStorageService, DashboardService dashboardService, AttachmentRepository attachmentRepository) {
        this.attachmentStorageService = attachmentStorageService;
        this.dashboardService = dashboardService;
        this.attachmentRepository = attachmentRepository;
    }

    @GetMapping(value = "/zip-download/{pc_id}", produces="application/zip")
    public void zipDownload(@PathVariable("pc_id") Long pcId, HttpServletResponse response) throws IOException {
        List<String> names = new ArrayList<>();
        List<Attachment> allPartAAttachment = dashboardService.getAllPartAAttachment(pcId);
        List<Long> allPartBAttachmentId = dashboardService.getAllPartBAttachmentId(pcId);
        List<Attachment> partBAttachments = attachmentRepository.findAllByIdIn(allPartBAttachmentId);
        Attachment annexxureIIAttachment = dashboardService.getAllAnnexxureIIAttachmentId(pcId);
        //List<String> names = Arrays.asList("1622096664104_High Medium low.pdf","1635074076253_1633528518733_testForE---Nothhe2Test.pdf");
        names.addAll(partBAttachments.stream().map(partBAttachment->{return partBAttachment.getFileName(); }).collect(Collectors.toList()));
        if(annexxureIIAttachment!=null)
            names.add(annexxureIIAttachment.getFileName());
        ZipOutputStream zipOut = new ZipOutputStream(response.getOutputStream());
        for (String fileName : names) {
            Resource resource = attachmentStorageService.loadFileAsResource(fileName);
            //FileSystemResource resource = new FileSystemResource("src/main/resources/static/files/" + fileName);
            ZipEntry zipEntry = new ZipEntry(resource.getFilename());
            //zipEntry.setSize(resource.contentLength());
            zipOut.putNextEntry(zipEntry);
            StreamUtils.copy(resource.getInputStream(), zipOut);
            zipOut.closeEntry();
        }
        zipOut.finish();
        zipOut.close();
        response.setStatus(HttpServletResponse.SC_OK);
        String zipFileName = "response.zip";
        response.addHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + zipFileName + "\"");
    }
}
