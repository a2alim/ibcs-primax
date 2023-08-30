package com.ibcs.idsdp.rpm.services.implementation.jasperServiceImpl;

import com.ibcs.idsdp.rpm.client.UaaClientService;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;
import com.ibcs.idsdp.rpm.jasperConfig.CoreJasperService;
import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.jasperConfig.JasperExportFormat;
import com.ibcs.idsdp.rpm.services.ResearcherProfilePersonalInfoMasterService;
import com.ibcs.idsdp.rpm.services.jasperService.ResearcherProfileService;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProfilePersonalInfoMasterResponse;
import com.ibcs.idsdp.util.CommonFunctions;
import lombok.AllArgsConstructor;
import net.sf.jasperreports.engine.data.JsonDataSource;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
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
public class ResearcherProfileJasperServiceImpl implements ResearcherProfileService, CommonFunctions {

    private final UaaClientService uaaClientService;
    private final CoreJasperService coreJasperService;
    private final JasperCommonUtils commonUtils;
    private final ResearcherProfilePersonalInfoMasterService researcherProfilePersonalInfoMasterService;

    @Override
    public CusJasperReportDef getProfilePdf(String uuid, String lang) throws ExecutionException, InterruptedException {
        Map<String, Object> parameterMap = new HashMap<String, Object>();
        CusJasperReportDef report = new CusJasperReportDef();

        Map<String, Object> profileView = researcherProfilePersonalInfoMasterService.getProfileView(uuid);

        Object personalInfo = profileView.get("personalInfo");
        ResearcherProfilePersonalInfoMasterResponse data = new ResearcherProfilePersonalInfoMasterResponse();
        BeanUtils.copyProperties(personalInfo, data);
        Long userId = data.getUserId();
        //
        String userNameById = getUserNameById(userId);
        profileView.put("userName", userNameById);

        String jsonData = objectToJson(profileView);
        ByteArrayInputStream jsonDataStream = new ByteArrayInputStream(jsonData.getBytes());

        parameterMap.put("SUBREPORT_DIR", commonUtils.getResoucePath("report/rmsResearcherProfileReport"));
        report.setReportDir(commonUtils.getResoucePath("report/rmsResearcherProfileReport"));

        if (lang.equalsIgnoreCase("en") && !data.getIsInstitutional()) {
            report.setReportName("rms_researcher_profile_report");
            report.setOutputFilename("rms_researcher_profile_report");

        }
        if (lang.equalsIgnoreCase("bn") && !data.getIsInstitutional()) {
            report.setReportName("rms_researcher_profile_report_bn");
            report.setOutputFilename("rms_researcher_profile_report_bn");
        }
        
        if (lang.equalsIgnoreCase("en") && data.getIsInstitutional()) {
            report.setReportName("rms_institut_profile_report");
            report.setOutputFilename("rms_institut_profile_report");

        }
        if (lang.equalsIgnoreCase("bn") && data.getIsInstitutional()) {
            report.setReportName("rms_institut_profile_report_bn");
            report.setOutputFilename("rms_institut_profile_report_bn");
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


    private String getUserNameById(Long id) {

        ResponseEntity<UserResponse> user = uaaClientService.getUser(id);
        return user.getBody().getName();


    }


}
