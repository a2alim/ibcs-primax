package com.ibcs.idsdp.rpm.web.controller.Jasper;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.services.jasperService.RequestLetterJasperService;
import com.ibcs.idsdp.rpm.services.jasperService.SeminarJasperService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

/**
 * Created by : rakibul.hasan on 12/12/2021 8:52 PM
 * github : https://github.com/rhmtechno
 */
@RestApiController
@AllArgsConstructor
@RequestMapping("request-letter")
public class RequestLetterController {

    private final RequestLetterJasperService letterJasperService;
    private final JasperCommonUtils jasperCommonUtils;


    @GetMapping(path = "pdf-gen/{id}/{type}/{lang}", produces = "application/json")
    public ResponseEntity<byte[]> getRequestLetterReport(@PathVariable Long id,@PathVariable String type,@PathVariable String lang) throws IOException, ExecutionException, InterruptedException {
        CusJasperReportDef report = letterJasperService.getRequestLetterPdf(id,type,lang);
        return jasperCommonUtils.respondReportOutputWithoutHeader(report, false);
    }


}
