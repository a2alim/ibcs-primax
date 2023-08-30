package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppAmortizationScheduleDetails;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.DppAmortizationScheduleRequest;

import java.util.List;

public interface DppAmortizationScheduleService {

    DppAmortizationScheduleRequest createAmortizationSchedule(DppAmortizationScheduleRequest request);

    DppAmortizationScheduleRequest updateAmortization(DppAmortizationScheduleRequest scheduleRequest, Long id);

    ResponseWithResults getAmortizationSchedule(Long rdppId);

    List<DppAmortizationScheduleDetails> getDetails(Long id);

    ResponseWithResults getAmortizationScheduleReport(Long uuid);
}
