package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.services.LatterService;
import com.ibcs.idsdp.rpm.web.dto.request.LatterRequest;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * @author moniruzzaman.rony
 * @create 10/21/21
 * @github `https://github.com/moniruzzamanrony`
 */
@RestApiController
@AllArgsConstructor
@RequestMapping("api/latter")
public class LatterController {
    private LatterService latterService;

    @PostMapping("/save")
    public Response saveLatter(@RequestBody LatterRequest latterRequest) {
        return latterService.saveLatter(latterRequest);
    }

    @PutMapping("/{id}/update")
    public Response updateLetter(@PathVariable String id,@RequestBody LatterRequest latterRequest) {
        return latterService.updateLetter(Long.parseLong(id),latterRequest);
    }

    @GetMapping()
    public Response getLatter() {
        return latterService.getLatter();
    }

    @GetMapping("get-list/{catId}")
    public Response getLatter(@PathVariable Long catId) {
        return latterService.getLatterList(catId);
    }

    @DeleteMapping("/{id}")
    public Response deleteLatter(@PathVariable Long id) {
        return latterService.deleteLatter(id);
    }

    @GetMapping("/{id}")
    public Response getLetterById(@PathVariable Long id) {
        return latterService.getLetterById(id);
    }
    
    @GetMapping("letter-details/{id}")
    public Response getLetterDetailsById(@PathVariable Long id) {
        return latterService.getLetterDetailsById(id);
    }
}
