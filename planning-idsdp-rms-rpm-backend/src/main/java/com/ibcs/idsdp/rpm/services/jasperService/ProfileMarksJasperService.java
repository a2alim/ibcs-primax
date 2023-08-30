package com.ibcs.idsdp.rpm.services.jasperService;

import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;

import java.util.concurrent.ExecutionException;

/**
 * Created by : rakibul.hasan on 12/13/2021 12:07 PM
 * github : https://github.com/rhmtechno
 */
public interface ProfileMarksJasperService {
    CusJasperReportDef getProfileMarksJasperServicePdf(String uuid, String lang, String category) throws ExecutionException, InterruptedException;
}
