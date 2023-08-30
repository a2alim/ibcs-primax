package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarSendMail;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarUploadFilesSchedule;
import com.ibcs.idsdp.rpm.services.CreateSeminarSendMailService;
import com.ibcs.idsdp.rpm.services.CreateSeminarUploadFilesScheduleService;
import com.ibcs.idsdp.rpm.web.dto.request.CreateSeminarSendMailRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.CreateSeminarUploadFilesScheduleRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateSeminarSendMailResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateSeminarUploadFilesScheduleResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@RestApiController
@RequestMapping("api/create-seminar-upload-files")
public class CreateSeminarUploadFilesScheduleController extends BaseController<CreateSeminarUploadFilesSchedule, CreateSeminarUploadFilesScheduleRequestDto, CreateSeminarUploadFilesScheduleResponseDto> {

    private final CreateSeminarUploadFilesScheduleService createSeminarUploadFilesScheduleService;

    public CreateSeminarUploadFilesScheduleController(BaseService<CreateSeminarUploadFilesSchedule, CreateSeminarUploadFilesScheduleRequestDto, CreateSeminarUploadFilesScheduleResponseDto> service, CreateSeminarUploadFilesScheduleService createSeminarUploadFilesScheduleService) {
        super(service);
        this.createSeminarUploadFilesScheduleService = createSeminarUploadFilesScheduleService;
    }


    @PostMapping(value = "/create-files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Response agreementJamanatnama(@RequestParam("body") String body,
                                         @RequestParam("file") Optional<MultipartFile[]> files) {
        return createSeminarUploadFilesScheduleService.saveFiles(body,files);
    }


//    //for update arrayList
//    @PostMapping(path = "/update-list", produces = "application/json")
//    public ResponseEntity<Object> updateAgreementInstallment(@RequestBody List<CreateSeminarSendMailRequestDto> requestDto) {
//        Response<CreateSeminarSendMail> res = createSeminarSendMailService.doUpdate(requestDto);
//        return new ResponseEntity<>(res, HttpStatus.OK);
//    }

}
