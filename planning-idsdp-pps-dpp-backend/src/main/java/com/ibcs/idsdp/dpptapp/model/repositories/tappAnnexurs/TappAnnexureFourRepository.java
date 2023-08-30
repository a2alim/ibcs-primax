package com.ibcs.idsdp.dpptapp.model.repositories.tappAnnexurs;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.dpptapp.model.domain.tappAnnexurs.TappAnnexureFour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TappAnnexureFourRepository extends JpaRepository<TappAnnexureFour, Long> {
    Optional<TappAnnexureFour> findByAttachment(Attachment attachment);
    List<TappAnnexureFour> findAllByProjectConceptMasterIdAndProjectConceptUuidAndIsDeleted(Long pcId, String pcUuid, Boolean isDeleted);
    List<TappAnnexureFour> findAllByProjectConceptUuidAndIsDeleted(String pcUuid, Boolean isDeleted);
}
