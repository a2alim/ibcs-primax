package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.CreateLetterForGed;
import com.ibcs.idsdp.rpm.services.CreateLetterForGedService;
import com.ibcs.idsdp.rpm.web.dto.request.CreateLetterForGedRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateLetterForGedResponseDto;
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
@RequestMapping("api/create-letter-ged")
public class CreateLetterForGedController extends BaseController<CreateLetterForGed, CreateLetterForGedRequestDto, CreateLetterForGedResponseDto> {

    final private CreateLetterForGedService createLetterForGedService;

    public CreateLetterForGedController(BaseService<CreateLetterForGed, CreateLetterForGedRequestDto, CreateLetterForGedResponseDto> service, CreateLetterForGedService createLetterForGedService) {
        super(service);
        this.createLetterForGedService = createLetterForGedService;
    }


    @PostMapping(value = "/create-letter", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Response saveResearcherProfilePersonal(@RequestParam("body") String body,
                                                  @RequestParam("file") Optional<MultipartFile[]> files) {
        return createLetterForGedService.saveLetter(body, files);
    }
}
