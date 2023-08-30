package com.ibcs.idsdp.reports.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.reports.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.reports.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.reports.service.CourseScheduleService;
import com.ibcs.idsdp.reports.service.RmsTrainresViewService;
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
@RequestMapping("course-schedule")
public class CourseScheduleController {

    private final CourseScheduleService courseScheduleService;
    private final JasperCommonUtils jasperCommonUtils;


    @GetMapping(path = "pdf-gen/{id}/{lang}", produces = "application/json")
    public ResponseEntity<byte[]> getSeminarReport(@PathVariable Long id,@PathVariable String lang) throws IOException, ExecutionException, InterruptedException {
        CusJasperReportDef report = courseScheduleService.getCourseSchedulePdf(id,lang);
        return jasperCommonUtils.respondReportOutputWithoutHeader(report, false);
    }


}
