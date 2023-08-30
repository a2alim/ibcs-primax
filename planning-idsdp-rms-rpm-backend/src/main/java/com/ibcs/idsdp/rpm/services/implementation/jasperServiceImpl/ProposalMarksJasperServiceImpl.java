package com.ibcs.idsdp.rpm.services.implementation.jasperServiceImpl;

import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.response.*;
import com.ibcs.idsdp.rpm.constants.JasperConstant;
import com.ibcs.idsdp.rpm.jasperConfig.CoreJasperService;
import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.jasperConfig.JasperExportFormat;
import com.ibcs.idsdp.rpm.model.domain.ViewResearcherList;
import com.ibcs.idsdp.rpm.services.ViewResearcherService;
import com.ibcs.idsdp.rpm.services.jasperService.ProposalMarksHelperService;
import com.ibcs.idsdp.rpm.services.jasperService.ProposalMarksJasperService;
import com.ibcs.idsdp.util.CommonFunctions;
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
public class ProposalMarksJasperServiceImpl implements ProposalMarksJasperService, CommonFunctions {



    private final CoreJasperService coreJasperService;
    private final JasperCommonUtils commonUtils;
    private final ViewResearcherService viewResearcherService;
    private final ProposalMarksHelperService proposalMarksHelperService;

    @Override
    public CusJasperReportDef getProposalMarksPdf(ViewResearcherList viewResearcherList, String lang) throws
            ExecutionException, InterruptedException {
        viewResearcherList.setIsFinalSubmit(true);
        viewResearcherList.setPageableRequestBodyDTO(new PageableRequestBodyDTO() {{
            setPage(0);
            setSize(1000000);
        }});

        Map<String, Object> parameterMap = new HashMap<String, Object>();
        CusJasperReportDef report = new CusJasperReportDef();

        // Response<ViewResearcherProposalResponse> proposalByFiscalYearAndCategory = viewResearcherService.getProposalByFiscalYearAndCategory(viewResearcherList);
        //Response<ViewProfileProposalMarksResponse> marksByFiscalYear = viewResearcherService.getMarksByFiscalYear(viewResearcherList);
        List<ViewResearcherList> content = viewResearcherService.criteriaBasedSearch(viewResearcherList).getContent();


        if (!content.isEmpty()) {

            /*
             * category or subfield
             * */

            //extract Ids
            IdSetRequestBodyDTO idSetRequestBodyDTO = new IdSetRequestBodyDTO() {{
                setIds(content.stream().map(ViewResearcherList::getStSectorTypeId).collect(Collectors.toSet()));
            }};

            //getting document type by id set
            List<SectorTypeResponseDto> sector = proposalMarksHelperService.getSector(idSetRequestBodyDTO);

            /////////////////////////////////////////////////////////////////////////////////////////////////////////

            /*
             * Research Category
             * */

            //extract Ids for Research Category
            IdSetRequestBodyDTO idSetRequestBodyDTOS = new IdSetRequestBodyDTO() {{
                setIds(content.stream().map(ViewResearcherList::getStResearchCatTypeId).collect(Collectors.toSet()));
            }};

            //getting Research Category by id set
            List<ResearchCategoryTypeResponseDto> researchCategory = proposalMarksHelperService.getResearchCategory(idSetRequestBodyDTOS);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            /*
             * Sub Field
             * */

            //extract Ids for Sub Sector
            IdSetRequestBodyDTO idSetRequestBodyDTOSUB = new IdSetRequestBodyDTO() {{
                setIds(content.stream().map(ViewResearcherList::getStSubSectorsId).collect(Collectors.toSet()));
            }};

            //getting Research Category by id set
            List<SubSectorResponseDto> subSector = proposalMarksHelperService.getSubSector(idSetRequestBodyDTOSUB);

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


            /*
             * Fiscal Year
             * */

            //extract Ids for Fiscal Year
            IdSetRequestBodyDTO idSetRequestBodyDTOFISCAL = new IdSetRequestBodyDTO() {{
                setIds(content.stream().map(ViewResearcherList::getStFiscalYearId).collect(Collectors.toSet()));
            }};

            //getting Fiscal Year by id set
            List<FiscalResponseDto> fiscalYear = proposalMarksHelperService.getFiscalYear(idSetRequestBodyDTOFISCAL);

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            if (!sector.isEmpty()) {
                for (ViewResearcherList contentData : content) {
                    //filed
                    sector.stream().filter(f -> f.getId() == contentData.getStSectorTypeId()).
                            map(m -> m.getFieldName()).findFirst()
                            .ifPresent(contentData::setField);
                    //research category
                    researchCategory.stream().filter(f -> f.getId() == contentData.getStResearchCatTypeId()).
                            map(m -> m.getCategoryName()).findFirst()
                            .ifPresent(contentData::setStResearchCatType);
                    //subfield
                    subSector.stream().
                            filter(f -> f.getId() == contentData.getStSubSectorsId()).
                            map(m -> m.getSubFieldName()).findFirst().
                            ifPresent(contentData::setSubField);
                    //Fiscal Year
                    fiscalYear.stream().
                            filter(f -> f.getId() == contentData.getStFiscalYearId()).
                            map(m -> m.getFiscalYear()).findFirst()
                            .ifPresent(contentData::setStFiscalYear);

                    /*Address
                    * */
                    Long proposalId = contentData.getProposalId();
                    UserResponse permanentAddress = proposalMarksHelperService.getAddress(proposalId, JasperConstant.ADDRESS_PERMANENT);
                    UserResponse presentAddress = proposalMarksHelperService.getAddress(proposalId, JasperConstant.ADDRESS_PRESENT);
                    //set Present Address
                    contentData.getUserDto().setInstAddress(permanentAddress.getInstAddress());
                    contentData.getUserDto().setDivisionDto(permanentAddress.getDivisionDto());
                    contentData.getUserDto().setDistrictDto(permanentAddress.getDistrictDto());
                    contentData.getUserDto().setUpzilaDto(permanentAddress.getUpzilaDto());
                    contentData.getUserDto().setAnotherDetails(permanentAddress.getAnotherDetails());

                    //set Permanent Address
                    contentData.getUserDto().setPreDivisionDto(presentAddress.getDivisionDto());
                    contentData.getUserDto().setPreDistrictDto(presentAddress.getDistrictDto());
                    contentData.getUserDto().setPreUpzilaDto(presentAddress.getUpzilaDto());
                    contentData.getUserDto().setPreAnotherDetails(presentAddress.getPreAnotherDetails());


                }
            }
        }


        Map<String, Object> dataMap = new HashMap<>();
        //dataMap.put("proposal_info", proposalByFiscalYearAndCategory);
        //dataMap.put("marks_info", marksByFiscalYear);
        // String jsonData = objectToJson(dataMap);
        String jsonData = objectToJson(content);
        ByteArrayInputStream jsonDataStream = new ByteArrayInputStream(jsonData.getBytes());
        report.setReportDir(commonUtils.getResoucePath("report/rmsProposalMarks"));
        parameterMap.put("SUBREPORT_DIR", commonUtils.getResoucePath("report/rmsProposalMarks"));

        if (lang.equalsIgnoreCase("en")) {
            report.setReportName("rms_promotional_category");
            report.setOutputFilename("rms_promotional_category");

        }
        if (lang.equalsIgnoreCase("bn")) {
            report.setReportName("rms_promotional_category_bn");
            report.setOutputFilename("rms_promotional_category_bn");

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
