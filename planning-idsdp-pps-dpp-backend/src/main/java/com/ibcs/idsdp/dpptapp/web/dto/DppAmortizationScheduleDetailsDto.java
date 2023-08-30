package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.dpptapp.model.domain.DppAmortizationScheduleDetails;
import lombok.Data;

import java.util.List;

@Data
public class DppAmortizationScheduleDetailsDto {


    private String uuid;
    private Long loanPeriod;
    private Long rateOfInterest;
    private Long gracePeriod;

}
