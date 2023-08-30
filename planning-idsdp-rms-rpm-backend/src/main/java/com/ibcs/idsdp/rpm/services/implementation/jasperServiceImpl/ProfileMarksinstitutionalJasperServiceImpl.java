package com.ibcs.idsdp.rpm.services.implementation.jasperServiceImpl;

import com.ibcs.idsdp.rpm.constants.JasperConstant;
import com.ibcs.idsdp.rpm.jasperConfig.CoreJasperService;
import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.jasperConfig.JasperExportFormat;
import com.ibcs.idsdp.rpm.services.ResearcherProfileMarksService;
import com.ibcs.idsdp.rpm.services.ResearcherProposalService;
import com.ibcs.idsdp.rpm.services.jasperService.ProfileMarksJasperService;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProfileMarksResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
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
public class ProfileMarksinstitutionalJasperServiceImpl implements ProfileMarksJasperService, CommonFunctions {

    private final CoreJasperService coreJasperService;
    private final JasperCommonUtils commonUtils;
    private final ResearcherProposalService proposalService;
    private final ResearcherProfileMarksService researcherProfileMarksService;

    @Override
    public CusJasperReportDef getProfileMarksJasperServicePdf(String uuid, String lang, String category) throws ExecutionException, InterruptedException {
        Map<String, Object> parameterMap = new HashMap<String, Object>();
        CusJasperReportDef report = new CusJasperReportDef();
        Response<ResearcherProposalResponseDto> proposalResponse = proposalService.getProposalResponse(uuid);
        ResearcherProposalResponseDto proposalResponseDto = proposalResponse.getObj();
        ResearcherProfileMarksResponseDto researcherMarks = researcherProfileMarksService.getByResearcherProposalIdAndCategory(proposalResponseDto.getId(), proposalResponseDto.getStResearchCatTypeId()).getObj();

        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("obj", proposalResponseDto);
        dataMap.put("researcherMarks", researcherMarks);
        String jsonData = objectToJson(dataMap);
        ByteArrayInputStream jsonDataStream = new ByteArrayInputStream(jsonData.getBytes());
        parameterMap.put("SUBREPORT_DIR", commonUtils.getResoucePath("report/rmsProfileMarksInstitutional"));
        report.setReportDir(commonUtils.getResoucePath("report/rmsProfileMarksInstitutional"));

        switch (category) {
            case JasperConstant.CATEGORY_MPHILLPDD:
                if (lang.equalsIgnoreCase("en")) {
                    report.setReportName("rms_proposal_marks_setup");
                    report.setOutputFilename("rms_proposal_marks_setup");
                }
                if (lang.equalsIgnoreCase("bn")) {
                    report.setReportName("rms_proposal_marks_setup_bn");
                    report.setOutputFilename("rms_proposal_marks_setup_bn");
                }

                break;

            case JasperConstant.CATEGORY_PROMOTIONAL:
                if (lang.equalsIgnoreCase("en")) {
                    report.setReportName("rms_proposal_marks_setup_promotional");
                    report.setOutputFilename("rms_proposal_marks_setup_promotional");
                }
                if (lang.equalsIgnoreCase("bn")) {
                    report.setReportName("rms_proposal_marks_setup_promotional_bn");
                    report.setOutputFilename("rms_proposal_marks_setup_promotional_bn");
                }

                break;


            case JasperConstant.CATEGORY_FELLOWSHIP:
                if (lang.equalsIgnoreCase("en")) {
                    report.setReportName("rms_proposal_marks_setup_fellowship");
                    report.setOutputFilename("rms_proposal_marks_setup_fellowship");
                }
                if (lang.equalsIgnoreCase("bn")) {
                    report.setReportName("rms_proposal_marks_setup_fellowship_bn");
                    report.setOutputFilename("rms_proposal_marks_setup_fellowship_bn");
                }

                break;

            case JasperConstant.CATEGORY_INSTITUTIONAL:
                if (lang.equalsIgnoreCase("en")) {
                    report.setReportName("rms_proposal_marks_setup_Institutional");
                    report.setOutputFilename("rms_proposal_marks_setup_Institutional");
                }
                if (lang.equalsIgnoreCase("bn")) {
                    report.setReportName("rms_proposal_marks_setup_Institutional_bn");
                    report.setOutputFilename("rms_proposal_marks_setup_Institutional_bn");
                }

                break;




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
