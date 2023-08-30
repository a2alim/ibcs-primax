package com.ibcs.idsdp.rpm.services.implementation.jasperServiceImpl;

import com.google.gson.Gson;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.response.CommonTypesResponseDto;
import com.ibcs.idsdp.rpm.jasperConfig.CoreJasperService;
import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.jasperConfig.JasperExportFormat;
import com.ibcs.idsdp.rpm.services.ResearcherProposalService;
import com.ibcs.idsdp.rpm.services.jasperService.ProposalHelperService;
import com.ibcs.idsdp.rpm.services.jasperService.ResearcherProposalJasperService;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalDetailsResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalUploadDocResponseDto;
import com.ibcs.idsdp.util.CommonFunctions;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import net.sf.jasperreports.engine.data.JsonDataSource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

/**
 * Created by : rakibul.hasan on 12/13/2021 12:19 PM
 * github : https://github.com/rhmtechno
 */
@Service
@AllArgsConstructor
public class ResearcherProposalJasperServiceImpl implements ResearcherProposalJasperService, CommonFunctions {

    private final CoreJasperService coreJasperService;
    private final JasperCommonUtils commonUtils;
    private final ResearcherProposalService proposalService;
    private final ProposalHelperService proposalHelperService;


    @Override
    public CusJasperReportDef getProposalPdf(String uuid, String lang) throws ExecutionException, InterruptedException {
        Map<String, Object> parameterMap = new HashMap<String, Object>();
        CusJasperReportDef report = new CusJasperReportDef();

        Response<ResearcherProposalDetailsResponseDto> data = proposalService.getResearcherProposalDetailsByUuid(uuid);

        ResearcherProposalDetailsResponseDto ProposalDetailsResponseDto = data.getObj();

        /*
         * sdg goals
         * */
        String stSdgsGoalsId = ProposalDetailsResponseDto.getResearcherProposal().getStSdgsGoalsId();
        Integer[] ids = new Gson().fromJson(stSdgsGoalsId, Integer[].class);
        List<Integer> collect = Arrays.stream(ids).collect(Collectors.toList());
        String sdGoals = "";
        for (Integer id : collect) {
            Optional<String> d = ProposalHelperService.sdgsGoalsList.stream().filter(f -> f.getId() == id).map(m -> m.getName()).findFirst();
            if (d.isPresent()) {
                if (sdGoals.isEmpty()) {
                    sdGoals = d.get();
                } else {
                    sdGoals = sdGoals + "," + d.get();
                }

            }
        }
        ;
        data.getObj().setStSdgsGoals(sdGoals);
        /**/


        /*
         * Doc Type
         *
         * */
        List<ResearcherProposalUploadDocResponseDto> researcherProposalUploadDoc = ProposalDetailsResponseDto.getResearcherProposalUploadDoc();

        //extract Ids
        IdSetRequestBodyDTO idSetRequestBodyDTO = new IdSetRequestBodyDTO() {{
            setIds(researcherProposalUploadDoc.stream().map(ResearcherProposalUploadDocResponseDto::getStDocumentTypeId).collect(Collectors.toSet()));
        }};

        //getting document type by id set
        List<CommonTypesResponseDto> docType = proposalHelperService.getDocType(idSetRequestBodyDTO);

        if (!docType.isEmpty()) {
            for (ResearcherProposalUploadDocResponseDto i : data.getObj().getResearcherProposalUploadDoc()) {
                i.setStDocumentType(docType.stream().filter(f -> f.getId() == i.getStDocumentTypeId()).map(m -> m.getTypeName()).findFirst().get());
            }

        }
        /**/


        String jsonData = objectToJson(data);

        ByteArrayInputStream jsonDataStream = new ByteArrayInputStream(jsonData.getBytes());
        parameterMap.put("SUBREPORT_DIR", commonUtils.getResoucePath("report/rmsResearcherProposalReport"));

        report.setReportDir(commonUtils.getResoucePath("report/rmsResearcherProposalReport"));

        if (lang.equalsIgnoreCase("en")) {
            report.setReportName("rms_researcher_proposal_report");
            report.setOutputFilename("rms_researcher_proposal_report");
        }
        if (lang.equalsIgnoreCase("bn")) {
            report.setReportName("rms_researcher_proposal_report_bn");
            report.setOutputFilename("rms_researcher_proposal_report_bn");
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
