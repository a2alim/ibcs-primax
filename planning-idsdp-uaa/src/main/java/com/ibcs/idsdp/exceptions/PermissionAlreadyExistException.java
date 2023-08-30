package com.ibcs.idsdp.exceptions;

public class PermissionAlreadyExistException extends RuntimeException {
    public PermissionAlreadyExistException(String message) {
        super(message);
    }
}
