package com.ibcs.idsdp.common.model.repositories;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;


@Repository
public interface AttachmentRepository extends JpaRepository<MinioAttachment, Long> {
    Optional<MinioAttachment> findById(MinioAttachment attachment);
    List<MinioAttachment> findAllByIdInAndIsDeleted(Set<Long> ids, Boolean isDeleted);
}
