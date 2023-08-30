package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.AgreementParty;
import com.ibcs.idsdp.rpm.services.AgreementPartyService;
import com.ibcs.idsdp.rpm.services.AgreementUploadSignatureFilesService;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementPartyRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.AgreementPartyResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@RestApiController
@RequestMapping("api/agreement-upload")
public class AgreementUploadSignatureFilesController extends BaseController<AgreementParty, AgreementPartyRequestDto, AgreementPartyResponseDto> {

   private final AgreementUploadSignatureFilesService signatureFilesService;

    public AgreementUploadSignatureFilesController(BaseService<AgreementParty, AgreementPartyRequestDto, AgreementPartyResponseDto> service, AgreementUploadSignatureFilesService signatureFilesService) {
        super(service);
        this.signatureFilesService = signatureFilesService;
    }

    @PostMapping(value = "/create-files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Response agreementJamanatnama(@RequestParam("body") String body,
                                         @RequestParam("file") Optional<MultipartFile[]> files) {
        return signatureFilesService.saveSignature(body,files);
    }
}
