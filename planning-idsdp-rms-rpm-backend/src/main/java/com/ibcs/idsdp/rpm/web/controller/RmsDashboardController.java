package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.services.RmsDashboardService;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@RestApiController
@AllArgsConstructor
@RequestMapping("api/rms")
public class RmsDashboardController {
    private RmsDashboardService rmsDashboardService;

    @GetMapping( {"/dashboard/view/{fiscalYearId}","/dashboard/view"})
    public Response getRmsDashboardData(@PathVariable(name = "fiscalYearId") Optional<Long>  fiscalYearId) {
        return rmsDashboardService.getRmsDashboardData(fiscalYearId);
    }
}
