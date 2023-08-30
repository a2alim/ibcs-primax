package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.trainninginstitute.model.domain.CourseScheduleModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourseScheduleRepository extends JpaRepository<CourseScheduleModel, Long> {

    Optional<CourseScheduleModel> findAllById(Long uuid);
    Optional<CourseScheduleModel> findByIsDeletedAndId(Boolean isDeleted, Long id);

}
