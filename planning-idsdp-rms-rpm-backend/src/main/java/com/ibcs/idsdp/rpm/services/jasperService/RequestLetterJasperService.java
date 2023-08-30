package com.ibcs.idsdp.rpm.services.jasperService;

import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;

import java.util.concurrent.ExecutionException;

/**
 * Created by : rakibul.hasan on 12/13/2021 12:07 PM
 * github : https://github.com/rhmtechno
 */
public interface RequestLetterJasperService {
    CusJasperReportDef getRequestLetterPdf(Long id, String type, String lang) throws ExecutionException, InterruptedException;

    ;
}
