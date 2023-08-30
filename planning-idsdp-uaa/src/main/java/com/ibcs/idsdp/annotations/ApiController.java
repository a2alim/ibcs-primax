package com.ibcs.idsdp.annotations;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.lang.annotation.*;

//For Create api-test
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@RestController
public @interface ApiController {
}
