package com.ibcs.idsdp.projectconcept.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.projectconcept.constants.AmsConstant;
import com.ibcs.idsdp.projectconcept.services.implementation.AmsServiceImpl;
import com.ibcs.idsdp.projectconcept.web.dto.request.AmsUnapprovedProjectRequestDTO;
import com.ibcs.idsdp.projectconcept.web.dto.response.AmsUnapprovedProjectResponseDTO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@AllArgsConstructor
@RestApiController
@RequestMapping(AmsConstant.AMS_ENDPOINT)
public class AmsController {

    private final AmsServiceImpl amsService;

    @PostMapping(path = AmsConstant.AMS_UNAPPROVED_PROJECT_ENTRY, produces = "application/json")
    public AmsUnapprovedProjectResponseDTO amsUnapprovedProjectEntry(@RequestBody AmsUnapprovedProjectRequestDTO request) {
        return amsService.amsUnapprovedProjectEntry(request);
    }
}
