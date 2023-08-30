package com.ibcs.idsdp.projectconcept.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.projectconcept.constants.CommentsConstant;
import com.ibcs.idsdp.projectconcept.model.domain.Comments;
import com.ibcs.idsdp.projectconcept.services.CommentsService;
import com.ibcs.idsdp.projectconcept.web.dto.CommentsDTO;
import com.ibcs.idsdp.projectconcept.web.dto.request.CommentBySourceIdAndSourceAndObserver;
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
    public List<CommentsDTO> getCommentsByObserver(@RequestBody CommentBySourceIdAndSourceAndObserver request) {
        return service.getCommentsByObserver(request);
    }

}