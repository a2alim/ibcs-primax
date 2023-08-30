package com.ibcs.idsdp.web.controller;

import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.model.domain.Urls;
import com.ibcs.idsdp.services.UrlService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.ibcs.idsdp.constants.UrlApiConstants.GET_ALL_URLS_ENDPOINT;

@AllArgsConstructor
@ApiController
@RestController
public class UrlsController {

    UrlService urlService;

    /**
     * For getting all urls
     * @return
     */
    @GetMapping(GET_ALL_URLS_ENDPOINT)
    public ResponseEntity<List<Urls>> getAllUrls(){
        return new ResponseEntity<>(urlService.getAllUrls(), HttpStatus.OK);
    }
}
