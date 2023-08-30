package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.rpm.model.domain.ProfileTraining;
import com.ibcs.idsdp.rpm.model.domain.ResearchExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface ProfileTrainingRepository extends JpaRepository<ProfileTraining, Long> {
    List<ProfileTraining> findAllByProfilePersonalInfoId(Long id);

    @Transactional
    void deleteAllByProfilePersonalInfoId(Long id);
}
