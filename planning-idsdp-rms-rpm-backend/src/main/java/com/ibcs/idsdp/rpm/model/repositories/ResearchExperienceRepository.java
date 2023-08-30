package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.rpm.model.domain.ResearchExperience;
import com.ibcs.idsdp.rpm.model.domain.UploadCertificateImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface ResearchExperienceRepository extends JpaRepository<ResearchExperience, Long> {
    List<ResearchExperience> findAllByProfilePersonalInfoId(Long id);
    List<ResearchExperience> findAllByProfilePersonalInfoIdAndIsDeleted(Long id, Boolean isDeleted); 
    @Transactional
    void deleteAllByProfilePersonalInfoId(Long id);
}
