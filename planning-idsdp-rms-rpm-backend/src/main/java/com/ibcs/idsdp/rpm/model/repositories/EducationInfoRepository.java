package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.rpm.model.domain.EducationInfo;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfilePersonalInfoMaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface EducationInfoRepository extends JpaRepository<EducationInfo, Long> {
    Page<EducationInfo> findAll(Pageable pageable);

    List<EducationInfo> findAllByProfilePersonalInfoIdAndIsDeleted(Long id,Boolean isDeleted);

    @Transactional
    void deleteAllByProfilePersonalInfoId(Long id);
}
