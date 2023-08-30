package com.ibcs.idsdp.projectconcept.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.projectconcept.model.domain.Comments;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommentsRepository extends ServiceRepository<Comments> {

    List<Comments> findAllByObserverAndIsDeleted(String observer, boolean isDeleted);

    @Query(value = "select * from comments c " +
            "where c.is_deleted = false " +
            "and c.observer = :observer " +
            "and c.source_id = :sourceId " +
            "and c.comments_source = :source", nativeQuery = true)
    List<Comments> findAllByObserverAndSourceIdAndCommentsSource(String observer, Long sourceId, int source);

}
