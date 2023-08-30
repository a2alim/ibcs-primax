package com.ibcs.idsdp.config.exceptions.config;


import com.ibcs.idsdp.config.exceptions.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class CustomException {

    @ExceptionHandler(ForbiddenException.class)
    public final ResponseEntity<ExceptionMessage> permissionAlreadyExistException(ForbiddenException ex, WebRequest request) {
        ExceptionMessage error = new ExceptionMessage(HttpStatus.FORBIDDEN, ex.getMessage());
        return new ResponseEntity<ExceptionMessage>(error, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(EmailAlreadyExistException.class)
    public final ResponseEntity<ExceptionMessage> emailAlreadyExistException(EmailAlreadyExistException ex, WebRequest request) {
        ExceptionMessage error = new ExceptionMessage(HttpStatus.CONFLICT, ex.getMessage());
        return new ResponseEntity<ExceptionMessage>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public final ResponseEntity<ExceptionMessage> roleAlreadyExistException(UnauthorizedException ex, WebRequest request) {
        ExceptionMessage error = new ExceptionMessage(HttpStatus.UNAUTHORIZED, ex.getMessage());
        return new ResponseEntity<ExceptionMessage>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(RoleNotFoundException.class)
    public final ResponseEntity<ExceptionMessage> roleAlreadyExistException(RoleNotFoundException ex, WebRequest request) {
        ExceptionMessage error = new ExceptionMessage(HttpStatus.NOT_FOUND, ex.getMessage());
        return new ResponseEntity<ExceptionMessage>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public final ResponseEntity<ExceptionMessage> roleAlreadyExistException(ResourceNotFoundException ex, WebRequest request) {
        ExceptionMessage error = new ExceptionMessage(HttpStatus.NOT_FOUND, ex.getMessage());
        return new ResponseEntity<ExceptionMessage>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public final ResponseEntity<ExceptionMessage> roleAlreadyExistException(UserNotFoundException ex, WebRequest request) {
        ExceptionMessage error = new ExceptionMessage(HttpStatus.NOT_FOUND, ex.getMessage());
        return new ResponseEntity<ExceptionMessage>(error, HttpStatus.NOT_FOUND);
    }
}
