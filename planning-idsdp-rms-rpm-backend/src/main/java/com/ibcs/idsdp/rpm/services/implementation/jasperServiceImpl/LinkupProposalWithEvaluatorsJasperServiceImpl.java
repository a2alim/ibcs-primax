package com.ibcs.idsdp.rpm.services.implementation.jasperServiceImpl;

import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.response.ExpertEvaluatorResponseDto;
import com.ibcs.idsdp.rpm.jasperConfig.CoreJasperService;
import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.jasperConfig.JasperExportFormat;
import com.ibcs.idsdp.rpm.services.ResearcherProposalService;
import com.ibcs.idsdp.rpm.services.jasperService.LinkupProposalWithEvaluatorsHelperService;
import com.ibcs.idsdp.rpm.services.jasperService.LinkupProposalWithEvaluatorsJasperService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.LinkupProposalWithEvaluatorsResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
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
import java.util.stream.Collectors;

/**
 * Created by : rakibul.hasan on 12/13/2021 12:19 PM
 * github : https://github.com/rhmtechno
 */
@Service
@AllArgsConstructor
public class LinkupProposalWithEvaluatorsJasperServiceImpl implements LinkupProposalWithEvaluatorsJasperService, CommonFunctions {

    private final CoreJasperService coreJasperService;
    private final JasperCommonUtils commonUtils;
    private final ResearcherProposalService proposalService;
    private final LinkupProposalWithEvaluatorsHelperService linkupProposalWithEvaluatorsHelperService;

    @Override
    public CusJasperReportDef getLinkupProposalWithEvaluatorsPdf(String lang, ResearcherProposalRequestDto researcherProposalRequestDto) throws ExecutionException, InterruptedException {
        Map<String, Object> parameterMap = new HashMap<String, Object>();
        CusJasperReportDef report = new CusJasperReportDef();
        
        Response<ResearcherProposalResponseDto> allByStFiscalYearId = proposalService.findAllByStFiscalYearId(researcherProposalRequestDto);


        if (allByStFiscalYearId.isSuccess()) {
            List<LinkupProposalWithEvaluatorsResponseDto> linkWithEvaluators = linkupProposalWithEvaluatorsHelperService.getLinkWithEvaluators();

            List<ExpertEvaluatorResponseDto> expertEvaluators = linkupProposalWithEvaluatorsHelperService.getExpertEvaluators(
                    new IdSetRequestBodyDTO() {{
                        setIds(linkWithEvaluators.stream().map(LinkupProposalWithEvaluatorsResponseDto::getStProfileOfExpertEvaluatorsId).collect(Collectors.toSet()));
                    }});
            
            
            List<ExpertEvaluatorResponseDto> expertEvaluatorsForProMarks = linkupProposalWithEvaluatorsHelperService.getExpertEvaluators(
                    new IdSetRequestBodyDTO() {{
                        setIds(linkWithEvaluators.stream().map(LinkupProposalWithEvaluatorsResponseDto::getStProfileOfExpertEvaluatorsIdForProMarks).collect(Collectors.toSet()));
                    }});
            

            for (ResearcherProposalResponseDto item : allByStFiscalYearId.getItems()) {
            	
                String data = linkupProposalWithEvaluatorsHelperService.getStProfileOfExpertEvaluatorForProMarks(linkWithEvaluators, expertEvaluatorsForProMarks, item.getId());
                item.setStProfileOfExpertEvaluatorForProMarks(data);
                
                String dataOne = linkupProposalWithEvaluatorsHelperService.getStProfileOfExpertEvaluator(linkWithEvaluators, expertEvaluators, item.getId());
                item.setStProfileOfExpertEvaluator(dataOne);
            }
        }



        String jsonData = objectToJson(allByStFiscalYearId.getItems());
        ByteArrayInputStream jsonDataStream = new ByteArrayInputStream(jsonData.getBytes());
        parameterMap.put("SUBREPORT_DIR", commonUtils.getResoucePath("report/rmsLinkupWithEvaluators"));
        report.setReportDir(commonUtils.getResoucePath("report/rmsLinkupWithEvaluators"));

        if (lang.equalsIgnoreCase("en")) {
            report.setReportName("rms_linkup_with_evaluators");
            report.setOutputFilename("rms_linkup_with_evaluators");
        }
        if (lang.equalsIgnoreCase("bn")) {
            report.setReportName("rms_linkup_with_evaluators_bn");
            report.setOutputFilename("rms_linkup_with_evaluators_bn");
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
