package com.ibcs.idsdp.rpm.services.implementation.jasperServiceImpl;

import com.ibcs.idsdp.rpm.jasperConfig.CoreJasperService;
import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.jasperConfig.JasperExportFormat;
import com.ibcs.idsdp.rpm.services.RmsEvaluatorsGrantAmountLetterService;
import com.ibcs.idsdp.rpm.services.jasperService.EvaluatorGrantAmountJasperService;
import com.ibcs.idsdp.rpm.web.dto.response.RmsEvaluatorsGrantAmountLetterResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.RmsEvaluatorsGrantAmountResponseDto;
import com.ibcs.idsdp.util.CommonFunctions;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import net.sf.jasperreports.engine.data.JsonDataSource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

/**
 * Created by : rakibul.hasan on 12/13/2021 12:19 PM
 * github : https://github.com/rhmtechno
 */
@Service
@AllArgsConstructor
public class EvaluatorGrantAmountJasperServiceImpl implements EvaluatorGrantAmountJasperService, CommonFunctions {


    private final RmsEvaluatorsGrantAmountLetterService rmsEvaluatorsGrantAmountLetterService;
    private final CoreJasperService coreJasperService;
    private final JasperCommonUtils commonUtils;


    @Override
    public CusJasperReportDef getEvaluatorGrantAmountJasperPdf(String uuid, String lang) throws
            ExecutionException, InterruptedException {

        Map<String, Object> parameterMap = new HashMap<String, Object>();
        CusJasperReportDef report = new CusJasperReportDef();

        Response<RmsEvaluatorsGrantAmountLetterResponseDto> byUuidWithADetails = rmsEvaluatorsGrantAmountLetterService.getByUuidWithADetails(uuid);

        /*
        * Remove last total amount
        * */
        byUuidWithADetails.getObj().getDetails().removeIf(item -> item.getId() == null);



        String jsonData = objectToJson(byUuidWithADetails);
        ByteArrayInputStream jsonDataStream = new ByteArrayInputStream(jsonData.getBytes());
        report.setReportDir(commonUtils.getResoucePath("report/rmsEvaluatorGrantAmount"));
        parameterMap.put("SUBREPORT_DIR", commonUtils.getResoucePath("rmsEvaluatorGrantAmount"));

        if (lang.equalsIgnoreCase("en")) {
            report.setReportName("rms_evaluator_grant_amount");
            report.setOutputFilename("rms_evaluator_grant_amount");

        }
        if (lang.equalsIgnoreCase("bn")) {
            report.setReportName("rms_evaluator_grant_amount_bn");
            report.setOutputFilename("rms_evaluator_grant_amount_bn");

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
