package com.ibcs.idsdp.rpm.client;

import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.response.*;
import com.ibcs.idsdp.rpm.web.dto.response.PredefineTemplateResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.TemplateTypeResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.TrainingInstituteResponse;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.FiscalYearResponse;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.InstallmentTypeResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.SectorTypeResponse;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.SubSectorResponse;
import com.ibcs.idsdp.util.Response;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@FeignClient(value = "planning-idsdp-rms-configuration-backend", url = "http://localhost:8081/rms-configuration/api/")
@FeignClient(value = "planning-idsdp-rms-ti-backend", url = "${feign.client.rms-ti}")
public interface TranningInstitudeClientService {

	@GetMapping("proposals/all")
	@ResponseBody
	ResponseEntity<List<ProposalModel>> getAllProposalList();

	@GetMapping("dashboard")
	@ResponseBody
	ResponseEntity<List<TrainingInstituteResponse>> getTrainingInstituteDataForDashboard();

}
