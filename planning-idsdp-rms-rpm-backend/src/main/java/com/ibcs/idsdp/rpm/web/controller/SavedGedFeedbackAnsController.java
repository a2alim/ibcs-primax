package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.CreateLetterForGed;
import com.ibcs.idsdp.rpm.model.domain.SavedGedFeedbackAns;
import com.ibcs.idsdp.rpm.services.CreateLetterForGedService;
import com.ibcs.idsdp.rpm.services.SavedGedFeedbackAnsService;
import com.ibcs.idsdp.rpm.web.dto.request.CreateLetterForGedRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.SavedGedFeedbackAnsRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateLetterForGedResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.SavedGedFeedbackAnsResponseDto;
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
@RequestMapping("api/ged-feed-back")
public class SavedGedFeedbackAnsController extends BaseController<SavedGedFeedbackAns, SavedGedFeedbackAnsRequestDto, SavedGedFeedbackAnsResponseDto> {

    final private SavedGedFeedbackAnsService createLetterForGedService;

    public SavedGedFeedbackAnsController(BaseService<SavedGedFeedbackAns, SavedGedFeedbackAnsRequestDto, SavedGedFeedbackAnsResponseDto> service, SavedGedFeedbackAnsService createLetterForGedService) {
        super(service);
        this.createLetterForGedService = createLetterForGedService;
    }

    @PostMapping(value = "/create-feedback", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Response saveResearcherProfilePersonal(@RequestParam("body") String body,
                                                  @RequestParam("file") Optional<MultipartFile[]> files) {
        return createLetterForGedService.doSave(body,files);
    }
}
