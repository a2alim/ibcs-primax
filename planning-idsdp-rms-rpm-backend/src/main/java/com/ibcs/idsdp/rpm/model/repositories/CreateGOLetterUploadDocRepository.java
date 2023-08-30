package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.CreateGOLetterUploadDoc;

@Repository
public interface CreateGOLetterUploadDocRepository extends ServiceRepository<CreateGOLetterUploadDoc> {

	List<CreateGOLetterUploadDoc> findAllByGoLetterIdAndIsDeleted(Long goLetterId, Boolean isDeleted);
}
