package com.ibcs.idsdp.trainninginstitute.web.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ibcs.idsdp.trainninginstitute.enums.ProposalStatus;
import com.ibcs.idsdp.trainninginstitute.services.NominatedInstituteService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ViewResearchList;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.NominatedInstituteResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/nominated-institutes")
public class NominatedInstituteController {
    private final NominatedInstituteService nominatedInstituteService;

    @PutMapping("/change-shortlist-status/{id}")
    public ResponseEntity<ApiMessageResponse> changeShortListStatus(@PathVariable Long id, @RequestParam Boolean shortListStatus) {
        return nominatedInstituteService.changeShortListStatus(id, shortListStatus);
    }

    @PutMapping("/change-status/{id}")
    public ResponseEntity<ApiMessageResponse> changeStatus(@PathVariable Long id, @RequestParam Integer status) {
        return nominatedInstituteService.changeStatus(id, status);
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<List<NominatedInstituteResponse>>> getNominatedInstitutes(@RequestParam(required = false) Boolean isShortListed,
                                                                                                       @RequestParam(required = false) Long trainingInstituteId,
                                                                                                       @RequestParam(defaultValue = "0") Integer page,
                                                                                                       @RequestParam(defaultValue = "20") Integer size,
                                                                                                       @RequestParam(required = false) Long fiscalYearId) {
        return nominatedInstituteService.getNominatedInstitutes(isShortListed, trainingInstituteId, page, size, fiscalYearId);
    }
    
    
    @PostMapping("/grid-list")
    public Page<NominatedInstituteResponse> gridList(@RequestBody NominatedInstituteResponse request) {
        return nominatedInstituteService.gridList(request);
    }
}
