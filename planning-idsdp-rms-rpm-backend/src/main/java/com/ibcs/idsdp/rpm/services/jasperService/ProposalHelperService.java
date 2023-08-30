package com.ibcs.idsdp.rpm.services.jasperService;

import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.dto.response.CommonTypesResponseDto;
import com.ibcs.idsdp.rpm.web.dto.request.SdgsGoals;
import com.ibcs.idsdp.util.Response;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by : rakibul.hasan on 1/25/2022 5:00 PM
 * github : https://github.com/rhmtechno
 */
@Service

public class ProposalHelperService {

    static final public List<SdgsGoals> sdgsGoalsList = Arrays.asList(
            new SdgsGoals(1, "No Poverty"),
            new SdgsGoals(2, "Zero Hunger"),
            new SdgsGoals(3, "Good Health and Well-being"),
            new SdgsGoals(4, "Quality Education"),
            new SdgsGoals(5, "Gender Equality"),
            new SdgsGoals(6, "Clean Water and Sanitation"),
            new SdgsGoals(7, "Affordable and Clean Energy"),
            new SdgsGoals(8, "Decent Work and Economic Growth"),
            new SdgsGoals(9, "Industry, Innovation and Infrastructure"),
            new SdgsGoals(10, "Reduced Inequality"),
            new SdgsGoals(11, "Sustainable Cities and Communities"),
            new SdgsGoals(12, "Responsible Consumption and Production"),
            new SdgsGoals(13, "Climate Action"),
            new SdgsGoals(14, "Life Below Water"),
            new SdgsGoals(15, "Life on Land"),
            new SdgsGoals(16, "Peace and Justice Strong Institutions"),
            new SdgsGoals(17, "Partnerships to achieve the Goal")
    );
    private RmsConfigurationClientService rmsConfigurationClientService;

    public ProposalHelperService(RmsConfigurationClientService rmsConfigurationClientService) {
        this.rmsConfigurationClientService = rmsConfigurationClientService;
    }

    public List<CommonTypesResponseDto> getDocType(IdSetRequestBodyDTO requestBodyDTO) {
        Response<CommonTypesResponseDto> commonTypeByIdSet = rmsConfigurationClientService.getCommonTypeByIdSet(requestBodyDTO);
        List<CommonTypesResponseDto> items = new ArrayList<>();
        if (commonTypeByIdSet.isSuccess()) {
            items = commonTypeByIdSet.getItems();
        }
        return items;
    }


}
