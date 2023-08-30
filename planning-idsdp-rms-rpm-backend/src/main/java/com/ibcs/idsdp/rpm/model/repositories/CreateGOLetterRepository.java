package com.ibcs.idsdp.rpm.model.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.CreateGOLetter;

import java.util.Optional;

@Repository
public interface CreateGOLetterRepository extends ServiceRepository<CreateGOLetter> {

	@Query(value = "SELECT nextval('go_code_seqn')", nativeQuery = true)
	String getNextGOCode();

	Page<CreateGOLetter> findAllCreateGOLetterByIsDeleted(boolean isDeleted, Pageable pageable);

	Optional<CreateGOLetter> findByUuid(String uuid);
}
