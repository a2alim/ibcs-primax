package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.trainninginstitute.model.domain.AgreementModel;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TrainingInstituteResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

/**
 * @author moniruzzaman.rony
 * @create 1/12/22
 * @github `https://github.com/moniruzzamanrony`
 */
public interface RmsDashboardService {
    ResponseEntity<List<TrainingInstituteResponse>>  getTrainingInstituteDataForDashboard();
}
