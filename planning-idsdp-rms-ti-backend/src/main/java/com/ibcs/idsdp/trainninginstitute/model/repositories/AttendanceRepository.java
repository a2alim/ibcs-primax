package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.trainninginstitute.model.domain.AttendanceModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<AttendanceModel, Long> {

    Optional<AttendanceModel> findByIsDeletedAndId(Boolean isDeleted, Long id);

    Page<AttendanceModel> findAllByIsDeleted(Boolean isDeleted, Pageable pageable);

    Optional<AttendanceModel> findByIsDeletedAndProposalModel_IdAndCourseScheduleModel_IdAndTrainer_Id(Boolean isDeleted, Long id, Long id1, Long id2);

    boolean existsByIsDeletedAndCourseScheduleModel_IdAndTrainer_Id(Boolean isDeleted, Long id, Long id1);

    boolean existsByIsDeletedAndTrainer_CourseScheduleModels_IdAndTrainer_IdAndDate(Boolean isDeleted, Long id, Long id1, LocalDate date);

    @Query(value = "select * from m3_attendance where id in (select mpa.m3_attendance_id from m3_participant_attendance mpa where mpa.m3_participant_id=:participantId) and is_deleted = false", nativeQuery = true)
    List<AttendanceModel>findAllByParticipantId(Long participantId);

    boolean existsByIsDeletedAndCourseScheduleModel_IdAndDate(boolean b, Long sessionId, LocalDate date);

    boolean existsByIsDeletedAndCourseScheduleModel_IdAndProposalModel_Id(boolean b, Long sessionId, Long proposalId);

}
