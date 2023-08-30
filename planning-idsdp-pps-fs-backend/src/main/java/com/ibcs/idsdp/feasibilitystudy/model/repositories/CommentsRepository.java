package com.ibcs.idsdp.feasibilitystudy.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.feasibilitystudy.model.domain.Comments;

import java.util.List;

public interface CommentsRepository extends ServiceRepository<Comments> {
    List<Comments> findAllByObserverAndIsDeleted(String observer, boolean isDeleted);
}
