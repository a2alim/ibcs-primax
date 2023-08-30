package com.ibcs.idsdp.rpm.web.controller;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.CreateGOLetterConstant;
import com.ibcs.idsdp.rpm.model.domain.CreateGOLetter;
import com.ibcs.idsdp.rpm.services.CreateGOLetterService;
import com.ibcs.idsdp.rpm.web.dto.request.CreateGOLetterRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateGOLetterResponseDto;
import com.ibcs.idsdp.util.Response;

import java.util.List;

@RestApiController
@RequestMapping(CreateGOLetterConstant.GO_LETTER)
public class CreateGOLetterController extends BaseController<CreateGOLetter, CreateGOLetterRequestDto, CreateGOLetterResponseDto> {

    final private CreateGOLetterService createGOLetterService;

    public CreateGOLetterController(BaseService<CreateGOLetter, CreateGOLetterRequestDto, CreateGOLetterResponseDto> service, CreateGOLetterService createGOLetterService) {
        super(service);
        this.createGOLetterService = createGOLetterService;
    }

    @PostMapping(CreateGOLetterConstant.CREATE_GO_LETTER)
    public Response<CreateGOLetterResponseDto> create(@RequestBody CreateGOLetterRequestDto createGOLetterRequestDto) {
        return createGOLetterService.save(createGOLetterRequestDto);
    }

    @GetMapping(CreateGOLetterConstant.GET_GO_LETTER_BY_UUID)
    public CreateGOLetterResponseDto getGoByUuid(@PathVariable("uuid") String uuid) {
        return createGOLetterService.getGoByUuid(uuid);
    }


    @PostMapping(CreateGOLetterConstant.GET_ALL_GO_LETTER)
    public Page<CreateGOLetterResponseDto> getAllGoLetter(@RequestBody CreateGOLetterRequestDto createGOLetterRequestDto) {
        return createGOLetterService.getAllGoLetter(createGOLetterRequestDto);
    }


    @GetMapping(CreateGOLetterConstant.GET_GO_LETTER_BY_ID)
    public Response<CreateGOLetterResponseDto> getById(@PathVariable Long id) {
        return createGOLetterService.findById(id);
    }

    @DeleteMapping(CreateGOLetterConstant.DELETE_BY_ID)
    public Response<CreateGOLetterResponseDto> deleteById(@PathVariable Long id) {
        return createGOLetterService.deleteById(id);
    }

    @PutMapping(CreateGOLetterConstant.UPDATE_GO_LETTER)
    public Response<?> update(@PathVariable String uid,
                              @RequestBody CreateGOLetterRequestDto createGOLetterRequestDto) {
        createGOLetterService.update(uid, createGOLetterRequestDto);
        Response<Object> response = new Response<>();
        response.setMessage("success");
        response.setSuccess(Boolean.TRUE);
        return response;

    }
}
