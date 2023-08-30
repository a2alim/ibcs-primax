package com.ibcs.idsdp.rmsConfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYear;
import com.ibcs.idsdp.rmsConfigration.model.domain.UserSerialization;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;

import javax.persistence.QueryHint;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSerializationRepository extends ServiceRepository<UserSerialization>{

    List<UserSerialization> findAllByIsDeletedAndIsActive(boolean isDeleted, boolean isActive);


     @Query(value="select * from st_user_serialization where user_id=? or serial=?  and is_deleted=false",nativeQuery=true)
    List<UserSerialization> findUnique(Integer userId, Integer serial);


    @Query(value="select * from st_user_serialization where user_id=? or serial=?  and is_deleted=false  and id<>?",nativeQuery=true)
    List<UserSerialization> findUniqueforupdate(Integer userId, Integer serial,Long id);
}

