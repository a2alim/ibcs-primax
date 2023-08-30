package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.services.ResearcherProfilePersonalInfoMasterService;
import com.ibcs.idsdp.rpm.web.dto.request.NotApplicableFormsRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.EducationInfoResponse;
import com.ibcs.idsdp.rpm.web.dto.response.NotApplicableFormsResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearchProfileWithRelatedInfoResponse;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ExecutionException;


@RestApiController
@AllArgsConstructor
@RequestMapping("researcher-profile")
public class ResearcherProfileViewController {

    private final ResearcherProfilePersonalInfoMasterService researcherProfilePersonalInfoMasterService;


    @GetMapping(value = "/profile-view/{uuId}", produces = "application/json")
    public ResponseEntity<Map<String, Object>> saveResearcherProfilePersonal(@PathVariable("uuId") String uuId) throws ExecutionException, InterruptedException {

        Map<String, Object> AllTab = researcherProfilePersonalInfoMasterService.getProfileView(uuId);
        return new ResponseEntity<Map<String, Object>>(AllTab, HttpStatus.OK);
    }

    @GetMapping(value = "/profile-info-with-related-info-by-id/{uuid}", produces = "application/json")
    public Response<ResearchProfileWithRelatedInfoResponse> getEducationInfoByProfileUuid(@PathVariable("uuid") String uuid) throws ExecutionException, InterruptedException {
        return researcherProfilePersonalInfoMasterService.getEducationInfoByProfileUuid(uuid);
    }

    @PostMapping(path = "not-applicable", produces = "application/json")
    public Response saveUpdateNotApplicable(@RequestBody NotApplicableFormsRequestDto notApplicableFormsRequestDto){
        return researcherProfilePersonalInfoMasterService.saveUpdateNotApplicable(notApplicableFormsRequestDto);
    }

    @GetMapping(value = "get-not-applicable-date/"+"{rmsProfileId}/{modelName}", produces = "application/json")
    public Response getNotApplicableData(@PathVariable("rmsProfileId") Long rmsProfileId, @PathVariable("modelName") String modelName){
        return researcherProfilePersonalInfoMasterService.getNotApplicable(rmsProfileId, modelName);
    }

}
