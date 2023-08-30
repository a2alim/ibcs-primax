package com.ibcs.idsdp.rpm.services.implementation.jasperServiceImpl;

import com.ibcs.idsdp.rpm.jasperConfig.CoreJasperService;
import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.jasperConfig.JasperExportFormat;
import com.ibcs.idsdp.rpm.services.CreateSeminarService;
import com.ibcs.idsdp.rpm.services.jasperService.SeminarJasperService;
import com.ibcs.idsdp.util.CommonFunctions;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import net.sf.jasperreports.engine.data.JsonDataSource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

/**
 * Created by : rakibul.hasan on 12/13/2021 12:19 PM
 * github : https://github.com/rhmtechno
 */
@Service
@AllArgsConstructor
public class SeminarJasperServiceImpl implements SeminarJasperService, CommonFunctions {

    private final CoreJasperService coreJasperService;
    private final JasperCommonUtils commonUtils;
    private final CreateSeminarService createSeminarService;

    @Override
    public CusJasperReportDef getSeminarPdf(Long id, String lang, Long viewNumber) throws ExecutionException, InterruptedException {
        Map<String, Object> parameterMap = new HashMap<String, Object>();
        CusJasperReportDef report = new CusJasperReportDef();
       // Response<Map<String, Object>> seminarView = createSeminarService.getSeminarView(id);
        Response<Map<String, Object>> seminarView = createSeminarService.seminarDetailsFindBySeminarId(id);
        
        String jsonData = objectToJson(seminarView);
        ByteArrayInputStream jsonDataStream = new ByteArrayInputStream(jsonData.getBytes());
        
        
        if(viewNumber==1) {
        	parameterMap.put("SUBREPORT_DIR", commonUtils.getResoucePath("report/rmsSeminarView"));
            report.setReportDir(commonUtils.getResoucePath("report/rmsSeminarView"));

            if (lang.equalsIgnoreCase("en")) {
                report.setReportName("rms_seminar_view_one_en");
                report.setOutputFilename("rms_seminar_view_one_en");
            }
            if (lang.equalsIgnoreCase("bn")) {
                report.setReportName("rms_seminar_view_one_bn");
                report.setOutputFilename("rms_seminar_view_one_bn");

            }	
        }
        
        if(viewNumber == 2) {
        	parameterMap.put("SUBREPORT_DIR", commonUtils.getResoucePath("report/rmsSeminarView"));
            report.setReportDir(commonUtils.getResoucePath("report/rmsSeminarView"));

            if (lang.equalsIgnoreCase("en")) {
                report.setReportName("rms_seminar_view_two_en");
                report.setOutputFilename("rms_seminar_view_two_en");
            }
            if (lang.equalsIgnoreCase("bn")) {
                report.setReportName("rms_seminar_view_two_bn");
                report.setOutputFilename("rms_seminar_view_two_bn");

            }	
        }
        
        if(viewNumber==3) {
        	parameterMap.put("SUBREPORT_DIR", commonUtils.getResoucePath("report/rmsSeminarView"));
            report.setReportDir(commonUtils.getResoucePath("report/rmsSeminarView"));

            if (lang.equalsIgnoreCase("en")) {
                report.setReportName("rms_seminar_view_three_en");
                report.setOutputFilename("rms_seminar_view_three_en");
            }
            if (lang.equalsIgnoreCase("bn")) {
                report.setReportName("rms_seminar_view_three_bn");
                report.setOutputFilename("rms_seminar_view_three_bn");

            }	
        }
        
        if(viewNumber == 4) {
        	parameterMap.put("SUBREPORT_DIR", commonUtils.getResoucePath("report/rmsSeminarView"));
            report.setReportDir(commonUtils.getResoucePath("report/rmsSeminarView"));

            if (lang.equalsIgnoreCase("en")) {
                report.setReportName("rms_seminar_view_four_en");
                report.setOutputFilename("rms_seminar_view_four_en");
            }
            if (lang.equalsIgnoreCase("bn")) {
                report.setReportName("rms_seminar_view_four_bn");
                report.setOutputFilename("rms_seminar_view_four_bn");

            }	
        }
        


        report.setReportFormat(JasperExportFormat.PDF_FORMAT);
        report.setParameters(parameterMap);
        ByteArrayOutputStream baos = null;


        try {
            JsonDataSource jsonDataSource = new JsonDataSource(jsonDataStream);
            report.setDataSource(jsonDataSource);
            baos = coreJasperService.generateReport(report);
        } catch (Exception e1) {
            e1.printStackTrace();
        }
        report.setContent(baos.toByteArray());
        return report;
    }
}
