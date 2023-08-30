package com.ibcs.idsdp.trainninginstitute.web.controller;

import com.ibcs.idsdp.trainninginstitute.model.domain.GOLetterOldModel;
import com.ibcs.idsdp.trainninginstitute.services.GOLetterOldService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.GOLetterOldRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/go-letter")
public class GOLetterOldController {
	
    private final GOLetterOldService goLetterService;

    @PostMapping
    public ResponseEntity<ApiMessageResponse> createGOLetter(@RequestBody GOLetterOldRequest goLetterRequest){
        return goLetterService.createGOLetter(goLetterRequest);
    }

    @GetMapping("{id}")
    public ResponseEntity<GOLetterOldModel> getGOLetter(@PathVariable Long id){
        return goLetterService.getGOLetter(id);
    }

    @PutMapping("{id}")
    public ResponseEntity<ApiMessageResponse> updateGOLetter(@PathVariable Long id, @RequestBody GOLetterOldRequest goLetterRequest){
        return goLetterService.updateGOLetter(id, goLetterRequest);
    }
}
