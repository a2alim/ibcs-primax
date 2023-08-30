package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarParticipating;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarSendMail;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParticipatingSeminarRepository extends ServiceRepository<CreateSeminarParticipating> {
    Optional<CreateSeminarParticipating> findByM2CreateSeminarIdAndIsDeleted(CreateSeminar m2CreateSeminarId, Boolean isDeleted);
}
