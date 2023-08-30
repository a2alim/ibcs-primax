package com.ibcs.idsdp.trainninginstitute.model.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.trainninginstitute.model.domain.CourseScheduleModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;

@Repository
public interface CourseScheduleRepositoryNew extends ServiceRepository<CourseScheduleModel> {	
	
	Page<CourseScheduleModel> findAllByIsDeletedAndProposalModel(Boolean isDeleted, Pageable pageable, ProposalModel proposalModel);
	List<CourseScheduleModel> findAllByIsDeletedAndProposalModel(Boolean isDeleted, ProposalModel proposalModel);
	List<CourseScheduleModel> findAllByProposalModelAndIsDeleted(ProposalModel proposalModel1, boolean b);
}
