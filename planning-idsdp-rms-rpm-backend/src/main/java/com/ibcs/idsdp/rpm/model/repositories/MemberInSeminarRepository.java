package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.model.domain.MemberInSeminar;

@Repository
public interface MemberInSeminarRepository extends ServiceRepository<MemberInSeminar>{
	
	List<MemberInSeminar>findAllByCreateSeminarIdAndIsDeleted(CreateSeminar createSeminarId , Boolean isDeleted);

}
