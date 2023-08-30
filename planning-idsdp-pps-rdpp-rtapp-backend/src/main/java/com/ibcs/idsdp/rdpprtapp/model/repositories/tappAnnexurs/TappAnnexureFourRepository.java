package com.ibcs.idsdp.rdpprtapp.model.repositories.tappAnnexurs;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.rdpprtapp.model.domain.tappAnnexurs.TappAnnexureFour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TappAnnexureFourRepository extends JpaRepository<TappAnnexureFour, Long> {
    Optional<TappAnnexureFour> findByAttachment(Attachment attachment);
}
