package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.rdpprtapp.model.domain.RtappAnnexureTwoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RtappAnnexureTwoNewRepository extends JpaRepository<RtappAnnexureTwoEntity, Long> {

    List<RtappAnnexureTwoEntity> findAllByRtappIdAndRtappUuidAndIsDeleted(Long rtappId, String rtappUuid, boolean b);

    List<RtappAnnexureTwoEntity> findAllByRtappUuidAndIsDeleted(String rtappUuid, boolean b);

    Optional<RtappAnnexureTwoEntity> findByAttachment(Attachment attachment);

    void delete(RtappAnnexureTwoEntity rtappAnnexureTwoEntity);

}
