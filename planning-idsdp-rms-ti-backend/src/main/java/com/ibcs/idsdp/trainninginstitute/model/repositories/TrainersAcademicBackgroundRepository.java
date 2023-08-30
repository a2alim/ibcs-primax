package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.trainninginstitute.model.domain.AcademicBackgroundModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TrainersAcademicBackgroundRepository extends JpaRepository<AcademicBackgroundModel, Long> {

}
