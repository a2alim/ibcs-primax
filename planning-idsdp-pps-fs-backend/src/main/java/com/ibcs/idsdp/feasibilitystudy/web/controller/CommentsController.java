package com.ibcs.idsdp.feasibilitystudy.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.ValueHolderRequestDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.feasibilitystudy.constants.CommentsConstant;
import com.ibcs.idsdp.feasibilitystudy.model.domain.Comments;
import com.ibcs.idsdp.feasibilitystudy.services.CommentsService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.CommentsDTO;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestApiController
@RequestMapping(CommentsConstant.COMMENTS)
public class CommentsController extends BaseController<Comments, CommentsDTO> {

    private final CommentsService service;

    public CommentsController(BaseService<Comments, CommentsDTO> baseService, CommentsService service) {
        super(baseService);
        this.service = service;
    }

    @PostMapping(path = CommentsConstant.GET_BY_OBSERVER, produces = "application/json")
    public List<CommentsDTO> getCommentsByObserver(@RequestBody ValueHolderRequestDTO request) {
        return service.getCommentsByObserver(request);
    }

}
