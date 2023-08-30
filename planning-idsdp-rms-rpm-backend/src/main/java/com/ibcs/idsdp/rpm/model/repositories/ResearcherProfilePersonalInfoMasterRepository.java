package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProfileResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.rpm.model.domain.ResearcherProfilePersonalInfoMaster;

@Repository
public interface ResearcherProfilePersonalInfoMasterRepository	extends ServiceRepository<ResearcherProfilePersonalInfoMaster> {

	Page<ResearcherProfilePersonalInfoMaster> findAll(Pageable pageable);

	Optional<ResearcherProfilePersonalInfoMaster> findByUuid(String uuid);

	Page<ResearcherProfilePersonalInfoMaster> findAllByIsDeletedOrderByIdDesc(boolean isDeleted, Pageable pageable);

	Page<ResearcherProfilePersonalInfoMaster> findAllByIsDeletedAndCreatedByOrderByIdDesc(boolean isDeleted, String createdBy, Pageable pageable);

	Optional<ResearcherProfilePersonalInfoMaster> findByUserIdAndIsDeleted(Long userId, boolean isDeleted);
	Optional<ResearcherProfilePersonalInfoMaster> findByEmailAddressAndIsInstitutionalAndIsDeleted(String email, boolean isInstitutional, boolean isDeleted);

	@Query(value = "select mrppi.id, coalesce(mrppi.district_id, 0) as district_id, coalesce(mrppi.upzila_id, 0) as upzila_id, "
			+ "coalesce(mrppi.division_id, 0) as division_id, coalesce(mrppi.pre_district_id, 0) as pre_district_id, "
			+ "coalesce(mrppi.pre_upzila_id, 0) as pre_upzila_id, coalesce(mrppi.pre_division_id, 0) as pre_division_id "
			+ "from m1_researcher_profile_personal_info mrppi " + "where mrppi.is_deleted = false "
			+ "and mrppi.id in :profileIds", nativeQuery = true)
	List<Object[]> findByProfileIdIn(Set<Long> profileIds);

	@Query(value = "select coalesce(sum(coalesce(mrpre.total_research_exp, 0)), 0) as total "
			+ "from m1_researcher_profile_research_exp mrpre " + "where mrpre.is_deleted = false "
			+ "and mrpre.profile_personal_info_id = :profileId", nativeQuery = true)
	Integer findTotalResearchByProfileId(Long profileId);

	@Query(value = "select mrppe.is_gov_employee " + "from m1_researcher_profile_professional_exp mrppe "
			+ "where mrppe.is_deleted = false " + "and mrppe.is_continue = true "
			+ "and mrppe.profile_personal_info_id = :profileId " + "FETCH FIRST 1 ROW ONLY", nativeQuery = true)
	Integer findEmpTypeByProfileId(Long profileId);

	List<ResearcherProfilePersonalInfoMaster> findAllByUserIdAndIsDeleted(Long userId, Boolean isDeleted);

	@Query(value = "select r_profile.id,(select	id from	m1_researcher_profile_education_info where	profile_personal_info_id = r_profile.id fetch first 1 row only) as education_info_id, ( select id from	m1_researcher_profile_professional_exp	where profile_personal_info_id = r_profile.id fetch first 1 row only) as professional_exp_id,	(	select	id	from m1_researcher_profile_publication_info where profile_personal_info_id = r_profile.id fetch first 1 row only) as publication_info_id,( select id from m1_researcher_profile_relative_info where	profile_personal_info_id = r_profile.id fetch first 1 row only) as relative_info_id , (	select id from m1_researcher_profile_research_exp where	profile_personal_info_id = r_profile.id fetch first 1 row only) as research_exp_id ,(select	id from	m1_researcher_profile_training_info	where profile_personal_info_id = r_profile.id fetch first 1 row only) as training_info_id,(	select id from m1_researcher_profile_rsc_working_in_org where researcher_profile_id = r_profile.id fetch first 1 row only) as rsc_working_in_org_id from m1_researcher_profile_personal_info r_profile where uuid = :uuid", nativeQuery = true)
	Object getProfileStatusFindByUuid(String uuid);
}
