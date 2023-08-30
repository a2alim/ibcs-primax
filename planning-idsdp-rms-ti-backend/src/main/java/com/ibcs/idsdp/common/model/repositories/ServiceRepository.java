package com.ibcs.idsdp.common.model.repositories;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.NoRepositoryBean;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import javax.persistence.QueryHint;

@NoRepositoryBean
public interface ServiceRepository<E extends BaseEntity> extends JpaRepository<E, Long> {

	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	Optional<E> findByUuidAndIsDeleted(String uuid, boolean isDeleted);

	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	Optional<E> findByIdAndIsDeleted(Long id, boolean isDeleted);

	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	List<E> findAllByIsDeleted(boolean isDeleted);

	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	Page<E> findAllByIsDeleted(boolean isDeleted, Pageable pageable);

	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	Page<E> findAllByIsDeletedOrderByIdDesc(boolean isDeleted, Pageable pageable);

	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	List<E> findAllByUuidInAndIsDeleted(Set<String> uuids, boolean isDeleted);

	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	List<E> findAllByIdInAndIsDeleted(Set<Long> ids, boolean isDeleted);
	
	


}
