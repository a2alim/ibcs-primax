package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.rpm.model.domain.RelativeInfo;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfilePersonalInfoMaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface RelativeInfoRepository extends JpaRepository<RelativeInfo, Long> {
    List<RelativeInfo> findAllByProfilePersonalInfoId(Long id);

    @Transactional
    void deleteAllByProfilePersonalInfoId(Long id);
}
