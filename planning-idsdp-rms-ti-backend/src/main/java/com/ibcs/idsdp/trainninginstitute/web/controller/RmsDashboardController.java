package com.ibcs.idsdp.trainninginstitute.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.trainninginstitute.model.domain.AgreementModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.AgreementStatus;
import com.ibcs.idsdp.trainninginstitute.services.AgreementService;
import com.ibcs.idsdp.trainninginstitute.services.RmsDashboardService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.AgreementRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.AgreementViewList;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TrainingInstituteResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@AllArgsConstructor
@RequestMapping("dashboard")
public class RmsDashboardController {
    private final RmsDashboardService rmsDashboardService;

    @GetMapping()
    public ResponseEntity<List<TrainingInstituteResponse>>  getTrainingInstituteDataForDashboard() {
        return rmsDashboardService.getTrainingInstituteDataForDashboard();
    }


}
