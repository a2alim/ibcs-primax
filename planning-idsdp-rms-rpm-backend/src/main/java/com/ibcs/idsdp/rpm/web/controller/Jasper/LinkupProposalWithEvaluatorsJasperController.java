package com.ibcs.idsdp.rpm.web.controller.Jasper;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.services.jasperService.LinkupProposalWithEvaluatorsJasperService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalRequestDto;
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
@RequestMapping("linkup-proposal-with-evaluators")
public class LinkupProposalWithEvaluatorsJasperController {

    private final LinkupProposalWithEvaluatorsJasperService linkupProposalWithEvaluatorsJasperService;
    private final JasperCommonUtils jasperCommonUtils;


    @PostMapping(path = "pdf-gen/{lang}", produces = "application/json")
    public ResponseEntity<byte[]> getLinkupProposalWithEvaluators(@PathVariable String lang, @RequestBody ResearcherProposalRequestDto researcherProposalRequestDto) throws IOException, ExecutionException, InterruptedException {
        CusJasperReportDef report = linkupProposalWithEvaluatorsJasperService.getLinkupProposalWithEvaluatorsPdf(lang, researcherProposalRequestDto);
        return jasperCommonUtils.respondReportOutputWithoutHeader(report, false);
    }


}
