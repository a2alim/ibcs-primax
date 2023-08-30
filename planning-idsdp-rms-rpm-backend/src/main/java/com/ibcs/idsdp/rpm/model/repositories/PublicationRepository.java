package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.rpm.model.domain.EducationInfo;
import com.ibcs.idsdp.rpm.model.domain.PublicationInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface PublicationRepository extends JpaRepository<PublicationInfo, Long> {
    Page<PublicationInfo> findAll(Pageable pageable);

    List<PublicationInfo> findAllByProfilePersonalInfoId(Long id);
    List<PublicationInfo> findAllByProfilePersonalInfoIdAndIsDeleted(Long id,Boolean isDeleted);

    @Transactional
    void deleteAllByProfilePersonalInfoId(Long id);
}
