package com.ibcs.idsdp.rpm.services.implementation.jasperServiceImpl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.ibcs.idsdp.rpm.jasperConfig.CoreJasperService;
import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.jasperConfig.JasperExportFormat;
import com.ibcs.idsdp.rpm.services.ResearchFinalSubmissionService;
import com.ibcs.idsdp.rpm.services.ResearcherProposalService;
import com.ibcs.idsdp.rpm.services.implementation.ResearchFinalSubmissionServiceImpl;
import com.ibcs.idsdp.rpm.services.implementation.ResearcherProposalServiceImpl;
import com.ibcs.idsdp.rpm.services.jasperService.ResearchFinalSubmissionJsperService;
import com.ibcs.idsdp.rpm.web.dto.response.ResearchFinalSubmissionResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.util.CommonFunctions;
import com.ibcs.idsdp.util.Response;

import lombok.AllArgsConstructor;
import net.sf.jasperreports.engine.data.JsonDataSource;

@Service
@AllArgsConstructor
public class ResearchFinalSubmissionJsperServiceImpl implements ResearchFinalSubmissionJsperService, CommonFunctions {

	private final CoreJasperService coreJasperService;
	private final JasperCommonUtils commonUtils;
	private final ResearcherProposalServiceImpl researcherProposalServiceImpl;
	private final ResearchFinalSubmissionServiceImpl researchFinalSubmissionServiceImpl;

	@Override
	public CusJasperReportDef researchFinalSubmissionReport(Long proposalId, String proposalUuid, String lang) throws ExecutionException, InterruptedException {

		Map<String, Object> parameterMap = new HashMap<String, Object>();
		CusJasperReportDef report = new CusJasperReportDef();

		Map<String, Object> map = new HashMap<String, Object>();
		Response<ResearcherProposalResponseDto> researcherResponse = researcherProposalServiceImpl.getByUuid(proposalUuid);
		Response<ResearchFinalSubmissionResponseDto> researcherFinalSubminationResponse = researchFinalSubmissionServiceImpl.findByM1ResearcherProposalId(proposalId);
		
		
		if(researcherResponse.isSuccess() && researcherResponse.getObj() !=null) {
			map.put("proposalObj", researcherResponse.getObj());
		}else {
			map.put("proposalObj", new ResearcherProposalResponseDto());
		}
		
		if(researcherFinalSubminationResponse.isSuccess() && researcherFinalSubminationResponse.getObj() !=null) {
			map.put("finalReportOfProposalSubmission", researcherFinalSubminationResponse.getObj());
		}else {
			map.put("finalReportOfProposalSubmission", new ResearchFinalSubmissionResponseDto());
		}		

		String jsonData = objectToJson(map);
		ByteArrayInputStream jsonDataStream = new ByteArrayInputStream(jsonData.getBytes());

		parameterMap.put("SUBREPORT_DIR", commonUtils.getResoucePath("report/rmsSeminarView"));
		report.setReportDir(commonUtils.getResoucePath("report/rmsSeminarView"));

		if (lang.equalsIgnoreCase("en")) {
			report.setReportName("rms_seminar_view");
			report.setOutputFilename("rms_seminar_view");
		}

		if (lang.equalsIgnoreCase("bn")) {
			report.setReportName("rms_seminar_view_bn");
			report.setOutputFilename("rms_seminar_view_bn");

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
