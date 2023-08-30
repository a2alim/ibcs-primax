package com.ibcs.idsdp.rpm.web.controller.Jasper;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.model.domain.ViewResearcherList;
import com.ibcs.idsdp.rpm.services.jasperService.ProposalMarksJasperService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

/**
 * Created by : rakibul.hasan on 12/12/2021 8:52 PM
 * github : https://github.com/rhmtechno
 */
@RestApiController
@AllArgsConstructor
@RequestMapping("proposal-marks")
public class ProposalMarksController {

    private final ProposalMarksJasperService proposalMarksJasperService;
    private final JasperCommonUtils jasperCommonUtils;


    @PostMapping(path = "pdf-gen/{lang}", produces = "application/json")
    public ResponseEntity<byte[]> getAgreementReport(@RequestBody ViewResearcherList viewResearcherList, @PathVariable String lang) throws IOException, ExecutionException, InterruptedException {
        CusJasperReportDef report = proposalMarksJasperService.getProposalMarksPdf(viewResearcherList,lang);
        return jasperCommonUtils.respondReportOutputWithoutHeader(report, false);
    }


}
