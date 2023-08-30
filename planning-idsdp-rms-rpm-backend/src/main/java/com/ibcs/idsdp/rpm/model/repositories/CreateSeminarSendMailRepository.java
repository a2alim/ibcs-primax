package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarParticipating;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarSendMail;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarTimeSchedule;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CreateSeminarSendMailRepository extends ServiceRepository<CreateSeminarSendMail> {
    Optional<CreateSeminarSendMail> findByM2CreateSeminarIdAndIsDeleted(CreateSeminar m2CreateSeminarId, Boolean isDeleted);

}
