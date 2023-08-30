package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.rpm.model.domain.UploadUsersImage;
import com.ibcs.idsdp.rpm.model.domain.UserSignature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author moniruzzaman.rony
 * @create 10/5/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Repository
public interface UserSignatureRepository extends JpaRepository<UserSignature, Long> {
}
