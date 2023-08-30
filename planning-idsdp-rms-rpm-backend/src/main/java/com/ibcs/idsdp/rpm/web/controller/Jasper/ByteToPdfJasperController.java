package com.ibcs.idsdp.rpm.web.controller.Jasper;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.services.jasperService.ByteToPdfJasperService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

/**
 * Created by : rakibul.hasan on 12/12/2021 8:52 PM
 * github : https://github.com/rhmtechno
 */
@RestApiController
@AllArgsConstructor
@RequestMapping("byte-to-pdf")
public class ByteToPdfJasperController {
    private final ByteToPdfJasperService byteToPdfJasperService;


    @GetMapping(path = "profile/{uuid}/{lang}", produces = "application/json")
    public String SaveProfilePdf(@PathVariable(name = "uuid") String uuid, @PathVariable(name = "lang") String lang) throws IOException, ExecutionException, InterruptedException {
        byteToPdfJasperService.profileReport(uuid, lang);

        return "success";

    }


}
