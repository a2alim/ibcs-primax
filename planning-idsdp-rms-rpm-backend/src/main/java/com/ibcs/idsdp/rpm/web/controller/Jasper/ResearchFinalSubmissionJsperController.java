package com.ibcs.idsdp.rpm.web.controller.Jasper;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.services.jasperService.ResearchFinalSubmissionJsperService;
import com.ibcs.idsdp.rpm.services.jasperService.SeminarJasperService;

import lombok.AllArgsConstructor;

@RestApiController
@AllArgsConstructor
@RequestMapping("research-final-submission-report")
public class ResearchFinalSubmissionJsperController {
	
	private final ResearchFinalSubmissionJsperService researchFinalSubmissionJsperService;
	private final JasperCommonUtils jasperCommonUtils;

    @GetMapping(path = "pdf-gen/{proposalId}/{proposalUuid}/{lang}", produces = "application/json")
    public ResponseEntity<byte[]> researchFinalSubmissionReport(@PathVariable Long proposalId, @PathVariable String proposalUuid, @PathVariable String lang) throws IOException, ExecutionException, InterruptedException {
        CusJasperReportDef report = researchFinalSubmissionJsperService.researchFinalSubmissionReport(proposalId,proposalUuid,lang);
        return jasperCommonUtils.respondReportOutputWithoutHeader(report, false);
    }

}
