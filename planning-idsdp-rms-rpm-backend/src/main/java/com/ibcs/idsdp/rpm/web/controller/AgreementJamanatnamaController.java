package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.AgreementJamanatnama;
import com.ibcs.idsdp.rpm.services.AgreementJamanatnamaService;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementJamanatnamaRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.AgreementJamanatnamaResponseDto;
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
@RequestMapping("api/agreement-jamanatnama")
public class AgreementJamanatnamaController extends BaseController<AgreementJamanatnama, AgreementJamanatnamaRequestDto, AgreementJamanatnamaResponseDto> {

    final private AgreementJamanatnamaService agreementJamanatnamaService;

    public AgreementJamanatnamaController(BaseService<AgreementJamanatnama, AgreementJamanatnamaRequestDto, AgreementJamanatnamaResponseDto> service, AgreementJamanatnamaService agreementJamanatnamaService) {
        super(service);
        this.agreementJamanatnamaService = agreementJamanatnamaService;
    }


    @PostMapping(value = "/create-jamanatnama", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Response agreementJamanatnama(@RequestParam("body") String body,
                                         @RequestParam("file") Optional<MultipartFile[]> files) {
        return agreementJamanatnamaService.saveJamanatnama(body, files);
    }

    @PutMapping(value = "/update-jamanatnama/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Response agreementJamanatnama(@PathVariable("id") Long id, @RequestParam("body") String body,
                                         @RequestParam("file") Optional<MultipartFile[]> files) {
        return agreementJamanatnamaService.updateJamanatnama(id, body, files);
    }
}
