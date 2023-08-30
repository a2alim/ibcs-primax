package com.ibcs.idsdp.dpptapp.services.implementation;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibcs.idsdp.dpptapp.client.DripClientService;
import com.ibcs.idsdp.dpptapp.client.dto.request.DivisionRequest;
import com.ibcs.idsdp.dpptapp.client.dto.request.ZillaRequest;
import com.ibcs.idsdp.dpptapp.constants.DripApiConstant;
import com.ibcs.idsdp.dpptapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.dpptapp.services.*;
import com.ibcs.idsdp.dpptapp.web.dto.dripDTO.*;
import com.ibcs.idsdp.dpptapp.web.dto.response.LocationAndCostResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


@Service
@AllArgsConstructor
@Transactional
public class DripApiServiceImpl implements DripApiService {

    private final DppLocationServiceImp dppLocationService;
    private final DppObjectiveCostServiceImp dppObjectiveCostService;
    private final DripClientService dripClientService;

    private String getAccessToken() {
        String token = "";
        HttpClient client = HttpClient.newHttpClient();
        var objectMapper = new ObjectMapper();
        var values = new HashMap() {{
            put("username", "admin_sdpp_api");
            put("password", "sdppAPI@2022");
        }};

        try {
            String requestBody = objectMapper.writeValueAsString(values);
            java.net.http.HttpRequest mainRequest = java.net.http.HttpRequest.newBuilder()
                    .uri(URI.create(DripApiConstant.DRIP_AUTHENTICATE))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .header("Content-Type", "application/json")
                    .build();

            var response = client.send(mainRequest, HttpResponse.BodyHandlers.ofString());
            token = response.body();
        } catch (Exception ex) {
            String message = ex.getMessage();
        }

        return token;

//        Map<String,Object> headerMap = new HashMap<>();
//        headerMap.put("Content-Type", "application/json");
//
//        AuthenticateRequestDTO request = new AuthenticateRequestDTO();
//        request.setUsername("admin_sdpp_api");
//        request.setPassword("sdppAPI@2022");
//
//        return dripClientService.getAccessToken(headerMap, request);
    }

    @Override
    public List<IndicatorDTO> getIndicatorList() {
        List<IndicatorDTO> indicatorList = new ArrayList<>();
        String token = getAccessToken();
        HttpClient client = HttpClient.newHttpClient();
        java.net.http.HttpRequest mainRequest = java.net.http.HttpRequest.newBuilder()
                .uri(URI.create(DripApiConstant.DRIP_INDICATORS))
                .GET()
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer "+token)
                .build();
        try {
            var response = client.send(mainRequest, HttpResponse.BodyHandlers.ofString());
            ObjectMapper mapper = new ObjectMapper();
            indicatorList = mapper.readValue(response.body(), new TypeReference<List<IndicatorDTO>>(){});
        } catch (Exception ex) {
            String message = ex.getMessage();
        }

        return indicatorList;

//        String token = getAccessToken();
//        Map<String,Object> headerMap = new HashMap<>();
//        headerMap.put("Content-Type", "application/json");
//        headerMap.put("Authorization", "Bearer " + token);
//
//        return dripClientService.getIndicators(headerMap);
    }

    @Override
    public IndicatorUrlListDTO getIndicatorUrl(IndicatorUrlRequestDTO requestDTO) {
        List<String> indicatorUrl = new ArrayList<>();
        IndicatorUrlListDTO urlList = new IndicatorUrlListDTO();
        List<String> divisionZillaGeoCode = new ArrayList<>();

        DppObjectiveCost dppInfo = dppObjectiveCostService.getObjectiveCostByPcuuid(requestDTO.getPcUuid());
        LocationAndCostResponse location = dppLocationService.getLocationByObjectiveCostIdUsingProjectSummary(dppInfo.getProjectConceptMasterId());
        if (location == null || location.getDivisions().size() == 0) throw new RuntimeException("There is no location data for this project");

        for (DivisionRequest division : location.getDivisions()) {
            for (ZillaRequest zilla : division.getZillaList()) {
                divisionZillaGeoCode.add(division.getGeoCode()+zilla.getGeoCode());
            }
        }

        String token = getAccessToken();
        HttpClient client = HttpClient.newHttpClient();
        var objectMapper = new ObjectMapper();
        var values = new HashMap() {{
            put("AdminCodeList", divisionZillaGeoCode);
            put("IndicatorList", requestDTO.getIndicatorList());
            put("ProjectName", requestDTO.getProjectName());
            put("isBangla", requestDTO.isBangla());
        }};

        try {
            String requestBody = objectMapper.writeValueAsString(values);
            java.net.http.HttpRequest mainRequest = java.net.http.HttpRequest.newBuilder()
                    .uri(URI.create(DripApiConstant.DRIP_INDICATORS_URL))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer "+token)
                    .build();

            var response = client.send(mainRequest, HttpResponse.BodyHandlers.ofString());
            ObjectMapper mapper = new ObjectMapper();
            indicatorUrl = mapper.readValue(response.body(), new TypeReference<List<String>>(){});
            urlList.setUrlList(indicatorUrl);
        } catch (Exception ex) {
            String message = ex.getMessage();
        }

        return urlList;

//        List<String> divisionZillaGeoCode = new ArrayList<>();
//        DppObjectiveCost dppInfo = dppObjectiveCostService.getObjectiveCostByPcuuid(requestDTO.getPcUuid());
//        LocationAndCostResponse location = dppLocationService.getLocationByObjectiveCostIdUsingProjectSummary(dppInfo.getProjectConceptMasterId());
//        if (location == null || location.getDivisions().size() == 0) throw new RuntimeException("There is no location data for this project");
//
//        for (DivisionRequest division : location.getDivisions()) {
//            for (ZillaRequest zilla : division.getZillaList()) {
//                divisionZillaGeoCode.add(division.getGeoCode()+zilla.getGeoCode());
//            }
//        }
//
//        String token = getAccessToken();
//        Map<String,Object> headerMap = new HashMap<>();
//        headerMap.put("Content-Type", "application/json");
//        headerMap.put("Authorization", "Bearer " + token);
//        IndicatorUrlsRequestDTO request = new IndicatorUrlsRequestDTO();
//        request.setAdminCodeList(divisionZillaGeoCode);
//        request.setIndicatorList(requestDTO.getIndicatorList());
//        request.setProjectName(requestDTO.getProjectName());
//        request.setBangla(request.isBangla());
//
//        return dripClientService.getIndicatorsUrl(headerMap, request);
    }
}

