package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.DppAmortizationSchedule;
import com.ibcs.idsdp.dpptapp.model.domain.DppAmortizationScheduleDetails;
import com.ibcs.idsdp.dpptapp.web.dto.DppAmortizationScheduleDetailsDto;
import com.ibcs.idsdp.dpptapp.web.dto.request.DppAmortizationScheduleRequest;

import java.util.List;

public interface DppAmortizationScheduleService {

    DppAmortizationScheduleRequest createAmortizationSchedule(DppAmortizationScheduleRequest request);

    DppAmortizationScheduleRequest updateAmortization(DppAmortizationScheduleRequest scheduleRequest, String id);

    ResponseWithResults getAmortizationSchedule(String pcUuid);
    List<DppAmortizationScheduleDetails> getDetails(Long id);

    ResponseWithResults getAmortizationScheduleReport(String uuid);
}
