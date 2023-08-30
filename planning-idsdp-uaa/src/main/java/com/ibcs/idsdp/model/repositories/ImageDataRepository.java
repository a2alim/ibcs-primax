package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.ImageData;
import com.ibcs.idsdp.model.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImageDataRepository extends JpaRepository<ImageData, Long> {
    Optional<ImageData> findById(ImageData profileImageData);
}
