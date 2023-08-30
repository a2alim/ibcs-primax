package com.ibcs.idsdp.web.controller;

import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.constants.ImsModuleConstants;
import com.ibcs.idsdp.model.domain.Notice;
import com.ibcs.idsdp.services.BaseService;
import com.ibcs.idsdp.services.NoticeService;
import com.ibcs.idsdp.web.dto.NoticeDTO;
import com.ibcs.idsdp.web.dto.response.NoticeRequestDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;


@ApiController
@RequestMapping(ImsModuleConstants.NOTICE_ENDPOINT)
public class NoticeController extends BaseController<Notice, NoticeDTO> {

    private final NoticeService noticeService;

    public NoticeController(BaseService<Notice, NoticeDTO> baseService, NoticeService noticeService) {
        super(baseService);
        this.noticeService = noticeService;
    }

    @PostMapping(ImsModuleConstants.SEARCH_NOTICE)
    public List<NoticeDTO> getNoticeByCriteria(@RequestBody NoticeRequestDto noticeRequestDto){
        return noticeService.getNoticeByCriteria(noticeRequestDto);
    }

}
