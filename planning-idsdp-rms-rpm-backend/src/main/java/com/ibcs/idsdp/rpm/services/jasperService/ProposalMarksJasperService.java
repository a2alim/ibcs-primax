package com.ibcs.idsdp.rpm.services.jasperService;

import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.model.domain.ViewResearcherList;

import java.util.concurrent.ExecutionException;

/**
 * Created by : rakibul.hasan on 12/13/2021 12:07 PM
 * github : https://github.com/rhmtechno
 */
public interface ProposalMarksJasperService {
    CusJasperReportDef getProposalMarksPdf(ViewResearcherList viewResearcherList,String lang) throws ExecutionException, InterruptedException;
}
