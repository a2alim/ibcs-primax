package com.ibcs.idsdp.reports.service.impl;

import com.ibcs.idsdp.reports.jasperConfig.CoreJasperService;
import com.ibcs.idsdp.reports.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.reports.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.reports.jasperConfig.JasperExportFormat;
import com.ibcs.idsdp.reports.service.ParticipantListService;
import com.ibcs.idsdp.reports.service.RmsTrainresViewService;
import com.ibcs.idsdp.trainninginstitute.services.ParticipantService;
import com.ibcs.idsdp.trainninginstitute.services.TrainersService;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ParticipantView;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TrainersListView;
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
public class ParticipantListServiceImpl implements ParticipantListService, CommonFunctions {
    private final CoreJasperService coreJasperService;
    private final JasperCommonUtils commonUtils;

    private final ParticipantService participantService;

    @Override
    public CusJasperReportDef getParticipantListPdf(Long id, String lang) throws ExecutionException, InterruptedException {
        Map<String, Object> parameterMap = new HashMap<String, Object>();
        CusJasperReportDef report = new CusJasperReportDef();
        ParticipantView participantView = participantService.getParticipantView(id);
        String jsonData = objectToJson(participantView);
        ByteArrayInputStream jsonDataStream = new ByteArrayInputStream(jsonData.getBytes());
        parameterMap.put("SUBREPORT_DIR", commonUtils.getResoucePath("report/rmsParticipientList"));
        report.setReportDir(commonUtils.getResoucePath("report/rmsParticipientList"));

        if (lang.equalsIgnoreCase("en")) {
            report.setReportName("rms_participient_list");
            report.setOutputFilename("rms_participient_list");
        }
        if (lang.equalsIgnoreCase("bn")) {
            report.setReportName("rms_participient_list_bn");
            report.setOutputFilename("rms_participient_list_bn");
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
