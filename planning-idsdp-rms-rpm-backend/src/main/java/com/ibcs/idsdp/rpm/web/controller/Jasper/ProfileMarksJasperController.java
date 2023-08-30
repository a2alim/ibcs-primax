package com.ibcs.idsdp.rpm.web.controller.Jasper;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.services.jasperService.ProfileMarksJasperService;
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
@RequestMapping("profile-marks-institutional")
public class ProfileMarksJasperController {
    private final ProfileMarksJasperService profileMarksinstitutionalJasperService ;
    private final JasperCommonUtils jasperCommonUtils;


    @GetMapping(path = "pdf-gen/{uuid}/{lang}/{category}", produces = "application/json")
    public ResponseEntity<byte[]> getProfileMarksReport(@PathVariable String uuid,@PathVariable String lang,@PathVariable String category) throws IOException, ExecutionException, InterruptedException {
        CusJasperReportDef report = profileMarksinstitutionalJasperService.getProfileMarksJasperServicePdf(uuid,lang,category);
        return jasperCommonUtils.respondReportOutputWithoutHeader(report, false);
    }


}
