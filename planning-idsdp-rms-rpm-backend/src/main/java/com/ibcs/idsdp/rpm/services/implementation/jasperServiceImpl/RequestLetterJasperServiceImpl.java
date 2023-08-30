package com.ibcs.idsdp.rpm.services.implementation.jasperServiceImpl;

import com.google.gson.Gson;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.jasperConfig.CoreJasperService;
import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.jasperConfig.JasperExportFormat;
import com.ibcs.idsdp.rpm.model.domain.FywSectorSubSector;
import com.ibcs.idsdp.rpm.model.domain.FywSectorSubSectorSection;
import com.ibcs.idsdp.rpm.services.FywSectorSubSectorSectionService;
import com.ibcs.idsdp.rpm.services.FywSectorSubSectorService;
import com.ibcs.idsdp.rpm.services.jasperService.RequestLetterJasperService;
import com.ibcs.idsdp.rpm.web.dto.response.CustomSectorSubSectorResponse;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.SectorTypeResponse;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.SubSectorResponse;
import com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection.GetActiveDataResponse;
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
public class RequestLetterJasperServiceImpl implements RequestLetterJasperService, CommonFunctions {

    private final CoreJasperService coreJasperService;
    private final JasperCommonUtils commonUtils;
    private final FywSectorSubSectorService fywSectorSubSectorService;
    private final FywSectorSubSectorSectionService fywSectorSubSectorSectionService;
    private final RmsConfigurationClientService rmsConfigurationClientService;

    @Override
    public CusJasperReportDef getRequestLetterPdf(Long id, String type, String lang) throws ExecutionException, InterruptedException {
        Map<String, Object> parameterMap = new HashMap<String, Object>();
        CusJasperReportDef report = new CusJasperReportDef();
        Response<FywSectorSubSector> dataByFiscalYearWise = fywSectorSubSectorService.getDataByFiscalYearWise(id, false);
        /**/
        List<FywSectorSubSector> items = dataByFiscalYearWise.getItems();
        List<FywSectorSubSector> type1 = items.stream().filter(f -> f.getLetterFor().equalsIgnoreCase(type)).collect(Collectors.toList());
        type1.get(0).setFiscalyear(getFiscalYear(id));
        Response<FywSectorSubSector> newResponse = new Response<>();
        newResponse.setItems(type1);
        /**/


        /*
         * sector-sub sector*/

        //holding db data
        GetActiveDataResponse activeData = new GetActiveDataResponse();
        Response<SectorTypeResponse> activeSectorTypes = rmsConfigurationClientService.getActiveSectorTypes();
        activeData.setSectorTypes(activeSectorTypes.getItems());
        Response<SubSectorResponse> activeSubSectors = rmsConfigurationClientService.getActiveSubSectors();
        activeData.setSubSectors(activeSubSectors.getItems());

        //holding sector list
        List<SectorTypeResponse> sectorTypesData = new ArrayList<>();

        List<CustomSectorSubSectorResponse> sectorSubSectorResponses = new ArrayList<>();

        Response<FywSectorSubSectorSection> fywSectorSubSector = fywSectorSubSectorSectionService.getFywSectorSubSector(id, false);
        if (fywSectorSubSector.isSuccess()) {

            List<FywSectorSubSectorSection> itemsList = fywSectorSubSector.getItems();

            for (FywSectorSubSectorSection item : itemsList) {
                Long sectorIdN = item.getStSectorTypeId();
                Optional<SectorTypeResponse> first = activeData.getSectorTypes().stream().filter(f -> f.getId() == sectorIdN).findFirst();
                if (first.isPresent()) {
                    SectorTypeResponse sectorTypeResponse = first.get();
                    sectorTypesData.add(sectorTypeResponse);

                    Long[] splitSubSectorId = new Gson().fromJson(item.getStSubSectorId(), Long[].class);

                    String text = "";

                    for (Long spId : splitSubSectorId) {
                        Optional<String> s = activeData.getSubSectors().stream().filter(data ->
                                data.getId() == spId).map(m -> m.getSubFieldName()).findFirst();

                        if (s.isPresent()) {
                            if (text.equals("")) {
                                text = s.get();
                            } else {
                                text = text + "," + s.get();
                            }

                        }
                    }

                    String finalText = text;
                    sectorSubSectorResponses.add(
                            new CustomSectorSubSectorResponse() {{
                                setField(sectorTypeResponse.getFieldName());
                                setSubField(finalText);
                            }}
                    );
                }

            }

        }

        /*\*/
        Map<String, Object> map = new HashMap<>();

        map.put("body", newResponse.getItems().get(0));
        map.put("field", sectorTypesData);
        map.put("fieldSubField", sectorSubSectorResponses);

        String jsonData = objectToJson(map);
        ByteArrayInputStream jsonDataStream = new ByteArrayInputStream(jsonData.getBytes());
        parameterMap.put("SUBREPORT_DIR", commonUtils.getResoucePath("report/rmsFinalRequestLetter"));
        report.setReportDir(commonUtils.getResoucePath("report/rmsFinalRequestLetter"));

        if (lang.equalsIgnoreCase("en")) {
            report.setReportName("rms_final_request_letter");
            report.setOutputFilename("rms_final_request_letter");
        }
        if (lang.equalsIgnoreCase("bn")) {
            report.setReportName("rms_final_request_letter_bn");
            report.setOutputFilename("rms_final_request_letter_bn");

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


    private String getFiscalYear(Long id) {
        return rmsConfigurationClientService.getFiscalYearById(id).getObj().getFiscalYear();

    }
}
