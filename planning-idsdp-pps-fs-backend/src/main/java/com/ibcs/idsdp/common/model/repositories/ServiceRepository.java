package com.ibcs.idsdp.common.model.repositories;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@NoRepositoryBean
public interface ServiceRepository<E extends BaseEntity>  extends JpaRepository<E, String> {
    Optional<E> findByUuidAndIsDeleted(String uuid, boolean isDeleted);
    Optional<E> findByIdAndIsDeleted(Long id, boolean isDeleted);
    List<E> findAllByIsDeleted(boolean isDeleted);
    Page<E> findAllByIsDeleted(boolean isDeleted, Pageable pageable);
    List<E> findAllByUuidInAndIsDeleted(Set<String> uuids, boolean isDeleted);
    List<E> findAllByIdInAndIsDeleted(Set<Long> ids, boolean isDeleted);
}
