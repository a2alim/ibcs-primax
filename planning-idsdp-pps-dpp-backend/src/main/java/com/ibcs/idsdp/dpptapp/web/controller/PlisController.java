package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.PlisConstant;
import com.ibcs.idsdp.dpptapp.services.PlisService;
import com.ibcs.idsdp.dpptapp.web.dto.request.PlisRequestDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.ResponseStatusDTO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@AllArgsConstructor
@RestApiController
@RequestMapping(PlisConstant.PLIS_ENDPOINT)
public class PlisController {

    private final PlisService plisService;

    @PostMapping(path = PlisConstant.SAVE_PLIS_PDF_URL, produces = "application/json")
    public ResponseStatusDTO savePlisPdfUrl(@RequestBody PlisRequestDTO request) {
        return plisService.savePlisPdfUrl(request);
    }
}

