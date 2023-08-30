package com.ibcs.idsdp.projectconcept.services;

import com.ibcs.idsdp.projectconcept.web.dto.CommentsDTO;
import com.ibcs.idsdp.projectconcept.web.dto.request.CommentBySourceIdAndSourceAndObserver;

import java.util.List;

public interface CommentsService {

    List<CommentsDTO> getCommentsByObserver(CommentBySourceIdAndSourceAndObserver request);
}
