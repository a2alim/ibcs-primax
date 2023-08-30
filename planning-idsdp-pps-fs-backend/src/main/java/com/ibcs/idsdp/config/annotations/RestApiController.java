package com.ibcs.idsdp.config.annotations;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@RestController
//@CrossOrigin(origins = "*")
public @interface RestApiController {
}
