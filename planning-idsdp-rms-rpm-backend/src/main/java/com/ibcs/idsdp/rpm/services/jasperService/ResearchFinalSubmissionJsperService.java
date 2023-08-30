package com.ibcs.idsdp.rpm.services.jasperService;

import java.util.concurrent.ExecutionException;

import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;

public interface ResearchFinalSubmissionJsperService {
	 CusJasperReportDef researchFinalSubmissionReport( Long proposalId,  String proposalUuid,  String lang) throws ExecutionException, InterruptedException;
}
