package com.ibcs.idsdp.common.model.repositories;

import com.ibcs.idsdp.common.model.domain.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    Optional<Attachment> findById(Attachment attachment);
}
