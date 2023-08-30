package com.ibcs.idsdp.rdpprtapp.web.controller;


import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppTappPresentation;
import com.ibcs.idsdp.rdpprtapp.services.DppTappPresentationService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.DppTappPresentationDto;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@AllArgsConstructor
@RequestMapping("/presentations")
@RestApiController
public class DppTappPresentationController {

    DppTappPresentationService dppTappPresentationService;

    @PostMapping("/add-presentation")
    public ResponseWithResults savePresentation( @RequestParam("presentationFile") MultipartFile presentationFile, @RequestParam("body") String object){
        JsonObject jsonObject = new JsonObject();
        jsonObject.getAsJsonObject(object);
        DppTappPresentationDto dppTappPresentationDto = new Gson().fromJson(object, DppTappPresentationDto.class);
        DppTappPresentation dppTappPresentation = dppTappPresentationService.addNewPresentation(dppTappPresentationDto, presentationFile);
        return new ResponseWithResults(200,"Saved Successfully", dppTappPresentation);
    }

    @GetMapping("/get-presentation/{source-id}/{source-module}")
    public ResponseWithResults getPresentationBySourceId(@PathVariable("source-id") Long sourceId, @PathVariable("source-module") String sourceModule){
       List<DppTappPresentation> dppTappPresentationList = dppTappPresentationService.getPresentationBySource(sourceId, sourceModule);
        return new ResponseWithResults(200,"Date Found", dppTappPresentationList);
    }
}
