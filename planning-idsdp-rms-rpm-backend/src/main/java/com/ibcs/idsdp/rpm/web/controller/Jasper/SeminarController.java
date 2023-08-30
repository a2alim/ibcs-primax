package com.ibcs.idsdp.rpm.web.controller.Jasper;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.model.domain.ViewResearcherList;
import com.ibcs.idsdp.rpm.services.jasperService.ProposalMarksJasperService;
import com.ibcs.idsdp.rpm.services.jasperService.SeminarJasperService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

/**
 * Created by : rakibul.hasan on 12/12/2021 8:52 PM
 * github : https://github.com/rhmtechno
 */
@RestApiController
@AllArgsConstructor
@RequestMapping("seminar-view")
public class SeminarController {

    private final SeminarJasperService seminarJasperService ;
    private final JasperCommonUtils jasperCommonUtils;


    @GetMapping(path = "pdf-gen/{id}/{lang}/{viewNumber}", produces = "application/json")
    public ResponseEntity<byte[]> getSeminarReport(@PathVariable Long id,@PathVariable String lang, @PathVariable Long viewNumber) throws IOException, ExecutionException, InterruptedException {
        CusJasperReportDef report = seminarJasperService.getSeminarPdf(id,lang,viewNumber);
        return jasperCommonUtils.respondReportOutputWithoutHeader(report, false);
    }


}
