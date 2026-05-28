package com.raiza.demo.shared.exception;

public class ForbiddenException extends RuntimeException {

    public ForbiddenException() {
        super("Access denied: insufficient permissions");
    }

    public ForbiddenException(String message) {
        super(message);
    }
}
