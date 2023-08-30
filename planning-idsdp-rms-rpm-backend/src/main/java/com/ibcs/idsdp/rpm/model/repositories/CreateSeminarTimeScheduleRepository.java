package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarTimeSchedule;

@Repository
public interface CreateSeminarTimeScheduleRepository extends ServiceRepository<CreateSeminarTimeSchedule> {
	
	// g2
	List<CreateSeminarTimeSchedule> findAllByM2CreateSeminarIdAndIsDeleted(CreateSeminar m2CreateSeminarId, Boolean isDeleted);
	
	// g2
	@Query(value = "select DISTINCT  cts.m1_researcher_proposal_id , rp.research_title from m2_create_seminar_time_schedule cts left join m1_researcher_proposal rp on cts.m1_researcher_proposal_id =rp.id where cts.m2_create_seminar_id in (select cs.id from m2_create_seminar cs where cs.st_fiscal_year_id=:fiscalYearId ) and cts.m1_researcher_proposal_id is not null order by 1;",nativeQuery = true)
	List<Object> findAllResearchTittleList(Long fiscalYearId);
	
	// g2
	@Query(value = "select	distinct rppi.id as researcherProfilePersonalInfoMasterId ,	rppi.user_id from m2_create_seminar_time_schedule cts left join m1_researcher_proposal rp on cts.m1_researcher_proposal_id = rp.id left join m1_researcher_profile_personal_info rppi on rp.researcher_profile_personal_info_master_id = rppi.id where rp.id = :researcherProposalId order by 1",nativeQuery = true)
	List<Object> findAllResearcherNameList(Long researcherProposalId);
	
	//g2
	Boolean existsByM2CreateSeminarId(CreateSeminar m2CreateSeminarId);

	void deleteAllByM2CreateSeminarId(CreateSeminar m2CreateSeminarId);
	

}
