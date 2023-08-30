package com.ibcs.idsdp.web.controller;

import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.constants.ImsModuleConstants;
import com.ibcs.idsdp.model.domain.Faq;
import com.ibcs.idsdp.model.domain.ImsModule;
import com.ibcs.idsdp.services.BaseService;
import com.ibcs.idsdp.services.FaqService;
import com.ibcs.idsdp.web.dto.FaqDTO;
import com.ibcs.idsdp.web.dto.request.ImsSearchDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@ApiController
@RequestMapping(ImsModuleConstants.FAQ_ENDPOINT)
public class FaqController extends BaseController<Faq, FaqDTO> {

    private final FaqService faqService;

    public FaqController(BaseService<Faq, FaqDTO> baseService, FaqService faqService) {
        super(baseService);
        this.faqService = faqService;
    }

    @GetMapping(path = ImsModuleConstants.SEARCH_BY_QUESTION_PAGEABLE + "/{page}" + "/{size}", produces = "application/json")
    public Page<Faq> getModulListByPageable(@PathVariable int page, @PathVariable int size) {
        return faqService.getModulListByPageable(page, size);
    }

    @PostMapping(path= ImsModuleConstants.SEARCH_BY_QUESTION, produces = "application/json")
    public List<FaqDTO> getActiveList(@RequestBody ImsSearchDTO searchDTO) {
        return faqService.searchByQuestion(searchDTO);
    }
}
