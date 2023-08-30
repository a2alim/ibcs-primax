package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.trainninginstitute.model.domain.CourseModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<CourseModel, Long> {
	
    Page<CourseModel> findByIsDeleted(Boolean isDeleted, Pageable pageable);
//  Page<CourseModel> findByIsDeletedAndCourseTitleLikeIgnoreCase(Boolean isDeleted, String courseTitle, Pageable pageable);//
//  Page<CourseModel> findByIsDeletedAndCourseTitleContainsIgnoreCase(Boolean isDeleted, String courseTitle, Pageable pageable);
    Optional<CourseModel> findByIsDeletedAndId(Boolean isDeleted, Long id);
    Optional<CourseModel> findAllById(Long id);
    List<CourseModel> findAllByFiscalYearId(Long fiscalId);
    List<CourseModel> findAllByFiscalYearIdAndIsDeleted(Long fiscalId,boolean isDeleted);
    Optional<CourseModel> findByIsDeletedAndProposalModel_Id(boolean b, Long proposalId);
}
