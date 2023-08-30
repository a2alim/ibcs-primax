package com.ibcs.idsdp.rpm.services.implementation.jasperServiceImpl;

import com.ibcs.idsdp.rpm.jasperConfig.CoreJasperService;
import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.jasperConfig.JasperExportFormat;
import com.ibcs.idsdp.rpm.services.InstallmentProcessService;
import com.ibcs.idsdp.rpm.services.PresentationEvaluatorsFeedbackService;
import com.ibcs.idsdp.rpm.services.jasperService.InstallmentProcessJasperJasperService;
import com.ibcs.idsdp.rpm.services.jasperService.ProposalFeedbackJasperService;
import com.ibcs.idsdp.rpm.web.dto.response.PresentationEvaluatorsFeedbackResponseDto;
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
public class InstallmentProcessJasperJasperServiceImpl implements InstallmentProcessJasperJasperService, CommonFunctions {

    private final CoreJasperService coreJasperService;
    private final JasperCommonUtils commonUtils;
    private final InstallmentProcessService installmentProcessService;

    @Override
    public CusJasperReportDef getInstallmentProcessPdf(String uuid,String lang) throws ExecutionException, InterruptedException {
        Map<String, Object> parameterMap = new HashMap<String, Object>();
        CusJasperReportDef report = new CusJasperReportDef();
        Response response = installmentProcessService.viewInstallments(uuid);
        String jsonData = objectToJson(response);
        ByteArrayInputStream jsonDataStream = new ByteArrayInputStream(jsonData.getBytes());
        parameterMap.put("SUBREPORT_DIR", commonUtils.getResoucePath("report/rmsInstallmentProcessReport"));
        report.setReportDir(commonUtils.getResoucePath("report/rmsInstallmentProcessReport"));

        if (lang.equalsIgnoreCase("en")) {
            report.setReportName("rms_installment_process");
            report.setOutputFilename("rms_installment_process");
        }
        if (lang.equalsIgnoreCase("bn")) {
            report.setReportName("rms_installment_process_bn");
            report.setOutputFilename("rms_installment_process_bn");
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
