package com.ibcs.idsdp.rpm.services.jasperService;

import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalRequestDto;

import java.util.concurrent.ExecutionException;

/**
 * Created by : rakibul.hasan on 12/13/2021 12:07 PM
 * github : https://github.com/rhmtechno
 */
public interface LinkupProposalWithEvaluatorsJasperService {
    CusJasperReportDef getLinkupProposalWithEvaluatorsPdf(String lang, ResearcherProposalRequestDto researcherProposalRequestDto) throws ExecutionException, InterruptedException;
}
