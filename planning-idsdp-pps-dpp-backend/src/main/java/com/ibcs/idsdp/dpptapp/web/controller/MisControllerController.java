package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.MisConstant;
import com.ibcs.idsdp.dpptapp.services.MisQueryService;
import com.ibcs.idsdp.dpptapp.web.dto.misDTO.MisQueryRequest;
import com.ibcs.idsdp.dpptapp.web.dto.pageable.PageableResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;


@AllArgsConstructor
@RestApiController
@RequestMapping(MisConstant.MIS_ENDPOINT)
public class MisControllerController {

    private final MisQueryService misQueryService;

    @PostMapping(path = MisConstant.APPLY_MIS_QUERY, produces = "application/json")
    public PageableResponse applyMisQuery(@RequestBody MisQueryRequest query) {
        return misQueryService.applyMisQuery(query);
    }

}
