package com.ibcs.idsdp.feasibilitystudy.services;

import com.ibcs.idsdp.common.web.dto.request.ValueHolderRequestDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.CommentsDTO;

import java.util.List;

public interface CommentsService {
    List<CommentsDTO> getCommentsByObserver(ValueHolderRequestDTO request);
}
