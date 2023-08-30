package com.ibcs.idsdp.services;

import com.ibcs.idsdp.model.domain.Urls;
import com.ibcs.idsdp.model.repositories.UrlsRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class UrlService {

    UrlsRepository urlsRepository;

    public List<Urls> getAllUrls(){
        return urlsRepository.findAll();
    }
}
