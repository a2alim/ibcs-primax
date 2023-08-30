package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.ParipatraVersionConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ParipatraVersion;
import com.ibcs.idsdp.idsdpconfigration.services.ParipatraVersionService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.ParipatraVersionDTO;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestApiController
@RequestMapping(ParipatraVersionConstant.paripatraVersion)
public class ParipatraVersionController extends BaseController<ParipatraVersion, ParipatraVersionDTO> {

    private final ParipatraVersionService paripatraVersionService;

    public ParipatraVersionController(BaseService<ParipatraVersion, ParipatraVersionDTO> baseService, ParipatraVersionService paripatraVersionService) {
        super(baseService);
        this.paripatraVersionService = paripatraVersionService;
    }

    /**
     * for get Active ParipatraVersion
     * @param page
     * @param size
     * @return
     */
    @GetMapping(path = ParipatraVersionConstant.GET_ACTIVE_PARIPATRA + "/{page}" + "/{size}", produces = "application/json")
    public Page<ParipatraVersionDTO> getActiveParipatraVersion(@PathVariable("page") int page, @PathVariable("size") int size) {
        return paripatraVersionService.getActiveParipatraVersion(new PageableRequestBodyDTO() {{
            setPage(page);
            setSize(size);
        }});
    }

    /**
     * for get Active Single ParipatraVersion
     */
    @GetMapping(ParipatraVersionConstant.GET_SINGLE_ACTIVE_PARIPATRA)
    public ResponseEntity<ParipatraVersionDTO> getActiveSingleParipatraVersion() {
        return paripatraVersionService.getActiveSingleParipatraVersion();
    }

    @GetMapping(path = ParipatraVersionConstant.GET_ACTIVE_PARIPATRA_LIST, produces = "application/json")
    public List<ParipatraVersionDTO> getActiveParipatraList() {
        return paripatraVersionService.getActiveParipatraList();
    }
}
