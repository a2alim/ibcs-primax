package com.ibcs.idsdp.reports.service.impl;

import com.ibcs.idsdp.reports.jasperConfig.CoreJasperService;
import com.ibcs.idsdp.reports.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.reports.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.reports.jasperConfig.JasperExportFormat;
import com.ibcs.idsdp.reports.service.ProposalReportService;
import com.ibcs.idsdp.trainninginstitute.services.ProposalService;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ProposalListView;
import com.ibcs.idsdp.util.CommonFunctions;
import lombok.AllArgsConstructor;
import net.sf.jasperreports.engine.data.JsonDataSource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

/**
 * Created by : rakibul.hasan on 1/3/2022 4:51 PM
 * github : https://github.com/rhmtechno
 */
@AllArgsConstructor
@Service
public class ProposalReportServiceImpl implements ProposalReportService, CommonFunctions {
    private final CoreJasperService coreJasperService;
    private final JasperCommonUtils commonUtils;
    private final ProposalService proposalService;

    @Override
    public CusJasperReportDef getProposalServicePdf(String uuid,String lang) throws ExecutionException, InterruptedException {
        Map<String, Object> parameterMap = new HashMap<String, Object>();
        CusJasperReportDef report = new CusJasperReportDef();
        ProposalListView allProposalByUuid = proposalService.getAllProposalByUuid(uuid);
        String jsonData = objectToJson(allProposalByUuid);
        ByteArrayInputStream jsonDataStream = new ByteArrayInputStream(jsonData.getBytes());
        parameterMap.put("SUBREPORT_DIR", commonUtils.getResoucePath("report/rmsTrainingView"));
        report.setReportDir(commonUtils.getResoucePath("report/rmsTrainingView"));

        if (lang.equalsIgnoreCase("en")) {
            report.setReportName("rms_training_list_en");
            report.setOutputFilename("rms_training_list_en");
        }
        if (lang.equalsIgnoreCase("bn")) {
            report.setReportName("rms_training_list_bn");
            report.setOutputFilename("rms_training_list_bn");
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
