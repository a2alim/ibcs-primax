package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.web.dto.response.IdentityResponse;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.TappConsultantConstant;
import com.ibcs.idsdp.dpptapp.model.domain.TappAnnexureThree;
import com.ibcs.idsdp.dpptapp.services.TappAnnexureThreeService;
import com.ibcs.idsdp.dpptapp.web.dto.request.TappAnnexureThreeDetailsRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.TappAnnexureThreeRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(TappConsultantConstant.CONSULTANT)
public class TappAnnexureThreeController {

    private final TappAnnexureThreeService tappConsultantService;

    public TappAnnexureThreeController(TappAnnexureThreeService tappConsultantService) {
        this.tappConsultantService = tappConsultantService;
    }

    @PostMapping("/create")
    private ResponseEntity<IdentityResponse> saveAnnualPhasing(@RequestBody List<TappAnnexureThreeDetailsRequest> tappAnnexureThreeDetailsRequests) {
        return tappConsultantService.createConsultant(tappAnnexureThreeDetailsRequests);
    }


    /**
     * Get Tapp Annexure Three Setup
     * @param id
     * @return
     */
    @GetMapping("getTappAnnexureThree/{id}")
    public TappAnnexureThreeRequest getAnnexureThreeByProjectConceptUuid(@PathVariable String id) {
        System.out.println("get Data");
        return tappConsultantService.getAnnexureThree(id);
    }

    /**
     * Delete Tapp Annexure Three Setup
     * @param uuid
     * @return
     */
    @DeleteMapping("deleteRow/{uuid}")
    public ResponseEntity<ResponseStatus> deleteRow(@PathVariable String uuid){
        return tappConsultantService.deleteRow(uuid);
    }

    /**
     * Delete Tapp Annexure Three Setup
     * @param request
     * @return
     */
    @PutMapping(path = "/updateConsultant", produces = "application/json")
    public TappAnnexureThreeRequest updateConsultant(@RequestBody TappAnnexureThreeRequest request){
        return tappConsultantService.updateConsultant(request);
    }






}
