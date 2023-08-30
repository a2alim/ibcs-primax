package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.AgreementParty;
import com.ibcs.idsdp.rpm.services.AgreementPartyService;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementPartyRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.AgreementPartyResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */

@RestApiController
@RequestMapping("api/agreement-party")
public class AgreementPartyController extends BaseController<AgreementParty, AgreementPartyRequestDto, AgreementPartyResponseDto> {

    private final AgreementPartyService agreementPartyService;

    public AgreementPartyController(BaseService<AgreementParty, AgreementPartyRequestDto, AgreementPartyResponseDto> service, AgreementPartyService agreementPartyService) {
        super(service);
        this.agreementPartyService = agreementPartyService;
    }

    @PostMapping(value = "/create-party", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Response agreementJamanatnama(@RequestParam("body") String body, @RequestParam("file") Optional<MultipartFile[]> files) {
        return agreementPartyService.saveParty(body, files);
    }

    @PutMapping(value = "/update-party/{agreementId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Response updateAgreementJamanatnama(@PathVariable("agreementId") String agreementId,
                                               @RequestParam("body") String body,
                                               @RequestParam("file") Optional<MultipartFile[]> files) {
        return agreementPartyService.updateAgreementJamanatnama(agreementId,body, files);
    }
}
