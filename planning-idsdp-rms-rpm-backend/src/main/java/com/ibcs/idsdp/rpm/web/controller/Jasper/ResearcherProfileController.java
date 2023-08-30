package com.ibcs.idsdp.rpm.web.controller.Jasper;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.services.jasperService.ResearcherProfileService;
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
@RequestMapping("researcher-profile")
public class ResearcherProfileController {

    private final ResearcherProfileService profileService;
    private final JasperCommonUtils jasperCommonUtils;


    @GetMapping(path = "pdf-gen/{uuid}/{lang}", produces = "application/json")
    public ResponseEntity<byte[]> getProfileReport(@PathVariable() String uuid,@PathVariable String lang) throws IOException, ExecutionException, InterruptedException {
        CusJasperReportDef report = profileService.getProfilePdf(uuid,lang);
        return jasperCommonUtils.respondReportOutputWithoutHeader(report, false);
    }


}
