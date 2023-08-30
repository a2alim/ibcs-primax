package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.Resources;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ResourcesRepository extends ServiceRepository<Resources> {
    List<Resources> findAllByIsActiveAndIsDeletedOrderById(Boolean isActive, Boolean isDeleted);

    @Query(value = "select distinct r.category from resources r where r.is_active = true and r.is_deleted = false", nativeQuery = true)
    List<String> findDistinctCategoryList();

    @Query(value = "select distinct r.year from resources r where r.is_active = true and r.is_deleted = false", nativeQuery = true)
    List<String> findDistinctYearList();

    @Query(value = "select distinct r.month from resources r where r.is_active = true and r.is_deleted = false", nativeQuery = true)
    List<String> findDistinctMonthList();

    @Query(value = "select * from resources r \n" +
            "where r.is_deleted = :isDeleted and r.is_active = :isActive  \n" +
            "\t and (lower(r.category) like %:value% or lower(r.summary) like %:value% or lower(r.title) like %:value% \n" +
            "or lower(r.year) like %:value% or lower(r.month) like %:value%)",
            countQuery = "SELECT count(*) FROM resources", nativeQuery = true)
    Page<Resources> findAllByPageable(boolean isDeleted, boolean isActive, String value, Pageable pageable);


    @Query(value = "select distinct r.year from resources r where r.category = :category and r.is_active = true and r.is_deleted = false", nativeQuery = true)
    List<String> findDistinctByCategory(String category);

    @Query(value = "select distinct r.month from resources r where r.year = :year and r.is_active = true and r.is_deleted = false", nativeQuery = true)
    List<String> findDistinctByYear(String year);

    @Query(value = "select r.* from resources r\n" +
            "where r.category = case when cast(:category as varchar) is null then r.category else cast(:category as varchar) end\n" +
            "and r.year = case when cast(:year as varchar) is null then r.year else cast(:year as varchar) end\n" +
            "and r.month = case when cast(:month as varchar) is null then r.month else cast(:month as varchar) end\n" +
            "and r.is_active = true and r.is_deleted = false", nativeQuery = true)
    List<Resources> searchResources(String category, String year, String month);
}
