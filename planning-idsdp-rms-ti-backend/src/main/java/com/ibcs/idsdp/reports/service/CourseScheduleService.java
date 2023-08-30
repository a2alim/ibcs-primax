package com.ibcs.idsdp.reports.service;

import com.ibcs.idsdp.reports.jasperConfig.CusJasperReportDef;

import java.util.concurrent.ExecutionException;

/**
 * Created by : rakibul.hasan on 1/3/2022 4:50 PM
 * github : https://github.com/rhmtechno
 */
public interface CourseScheduleService {
    CusJasperReportDef getCourseSchedulePdf(Long id,String lang) throws ExecutionException, InterruptedException;
}
