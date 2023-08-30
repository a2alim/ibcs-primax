package com.ibcs.idsdp.rpm.services.implementation.jasperServiceImpl;

import com.ibcs.idsdp.rpm.client.UaaClientService;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;
import com.ibcs.idsdp.rpm.constants.JasperConstant;
import com.ibcs.idsdp.rpm.jasperConfig.CoreJasperService;
import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.jasperConfig.JasperExportFormat;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import com.ibcs.idsdp.rpm.services.AgreementWithResearcherService;
import com.ibcs.idsdp.rpm.services.jasperService.ProposalMarksHelperService;
import com.ibcs.idsdp.rpm.services.jasperService.ResearcherAgreementJasperService;
import com.ibcs.idsdp.util.CommonFunctions;
import com.ibcs.idsdp.util.Response;
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
public class ResearcherAgreementJasperServiceImpl implements ResearcherAgreementJasperService, CommonFunctions {

    private final CoreJasperService coreJasperService;
    private final JasperCommonUtils commonUtils;
    private final AgreementWithResearcherService agreementWithResearcherService;
    private final ProposalMarksHelperService proposalMarksHelperService;
    private UaaClientService uaaClientService;

    @Override
    public CusJasperReportDef getAgreementPdf(String uuid, String lang) throws ExecutionException, InterruptedException {
        Map<String, Object> parameterMap = new HashMap<String, Object>();
        CusJasperReportDef report = new CusJasperReportDef();


        Response<Map<String, Object>> allTabData = agreementWithResearcherService.getAllTabData(uuid);

        /*
         * Injecting Address
         * */
        Map<String, Object> obj = allTabData.getObj();
        AgreementWithResearcher agreementWithResearcher = new AgreementWithResearcher();
        BeanUtils.copyProperties(obj.get("tabOne"), agreementWithResearcher);
        Long proposalId = agreementWithResearcher.getResearcherProposalId().getId();

        UserResponse userDto = new UserResponse();

        UserResponse permanentAddress = proposalMarksHelperService.getAddress(proposalId, JasperConstant.ADDRESS_PERMANENT);
        UserResponse presentAddress = proposalMarksHelperService.getAddress(proposalId, JasperConstant.ADDRESS_PRESENT);
        //set Present Address
        userDto.setInstAddress(permanentAddress.getInstAddress());
        userDto.setDivisionDto(permanentAddress.getDivisionDto());
        userDto.setDistrictDto(permanentAddress.getDistrictDto());
        userDto.setUpzilaDto(permanentAddress.getUpzilaDto());
        userDto.setAnotherDetails(permanentAddress.getAnotherDetails());

        //set Permanent Address
        userDto.setPreDivisionDto(presentAddress.getDivisionDto());
        userDto.setPreDistrictDto(presentAddress.getDistrictDto());
        userDto.setPreUpzilaDto(presentAddress.getUpzilaDto());
        userDto.setPreAnotherDetails(presentAddress.getPreAnotherDetails());

        /*
        * injecting user name
        * */
        Long userId = agreementWithResearcher.getResearcherProposalId().getResearcherProfilePersonalInfoMaster().getUserId();
        ResponseEntity<UserResponse> userResponse = uaaClientService.getUser(userId);
        UserResponse user = userResponse.getBody();
        if(user!=null){
            userDto.setName(user.getName());
        }
        Map<String,Object> newMap=new HashMap<>();
        newMap.put("obj",obj);
        newMap.put("userDto",userDto);
       // String jsonData = objectToJson(allTabData);
        String jsonData = objectToJson(newMap);

        ByteArrayInputStream jsonDataStream = new ByteArrayInputStream(jsonData.getBytes());
        parameterMap.put("SUBREPORT_DIR", commonUtils.getResoucePath("report/rmsAgreementReport"));
        report.setReportDir(commonUtils.getResoucePath("report/rmsAgreementReport"));

        if (lang.equalsIgnoreCase("en")) {
            report.setReportName("rms_researcher_agreement_report");
            report.setOutputFilename("rms_researcher_agreement_report");
        }
        if (lang.equalsIgnoreCase("bn")) {
            report.setReportName("rms_researcher_agreement_report_bn");
            report.setOutputFilename("rms_researcher_agreement_report_bn");
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
