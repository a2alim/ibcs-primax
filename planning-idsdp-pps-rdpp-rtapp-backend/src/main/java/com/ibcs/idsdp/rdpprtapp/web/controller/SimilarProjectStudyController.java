
package com.ibcs.idsdp.rdpprtapp.web.controller;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.services.SimilarProjectStudyService;
import com.ibcs.idsdp.rdpprtapp.web.dto.SimilarProjectStudyDto;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.SimilarProjectStudyRequest;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestApiController
@RequestMapping("/project-details-partb")
public class SimilarProjectStudyController {

    SimilarProjectStudyService similarProjectStudyService;


    // For Create Similar Project Study
    @PostMapping("/create-similar-project-study")
    public SimilarProjectStudyRequest createSimilarProjectStudy(@RequestBody SimilarProjectStudyRequest similarProjectStudyRequest) {
        System.out.println("DATA SAVE.......................");
        return similarProjectStudyService.saveSimilarProjectStudy(similarProjectStudyRequest);

    }


    // For Get Similar Project Study by Project Id;
    @GetMapping("/getSimilarProjectStudy/{projectId}")
    public ResponseWithResults getOtherImportantDetailsByProjectId(@PathVariable("projectId") String uuid) {
        System.out.println("controller hitted..................................");
        return similarProjectStudyService.getSimilarStudyByPcUuid(uuid);

    }

// Get major item annex 5b
    @GetMapping("/getMajorItem/{major}")
    public ResponseWithResults getList(@PathVariable Boolean major){
        return similarProjectStudyService.getByIsMajorItem(major);
    }

// Update Similar project study
    @PutMapping(path = "updateSimilarProjectStudy/{pcUuid}")
    public SimilarProjectStudyDto updateProjectStudy(@RequestBody SimilarProjectStudyDto dto,@PathVariable String pcUuid){
        return similarProjectStudyService.updateSimilarProjectStudy(dto, pcUuid);
    }

}
