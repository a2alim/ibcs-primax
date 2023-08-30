package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.rpm.model.domain.EducationInfo;
import com.ibcs.idsdp.rpm.model.domain.ProfessionalExperience;
import feign.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface ProfessionalExperienceRepository extends JpaRepository<ProfessionalExperience, Long> {

    Page<ProfessionalExperience> findAll(Pageable pageable);

    List<ProfessionalExperience> findAllByProfilePersonalInfoId(Long id);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM m1_researcher_profile_professional_exp u WHERE u.profile_personal_info_id= ?1", nativeQuery = true)
    void deleteByProfilePersonalInfoId( Long id);

    @Transactional
    void deleteAllByProfilePersonalInfoId(Long id);
}
