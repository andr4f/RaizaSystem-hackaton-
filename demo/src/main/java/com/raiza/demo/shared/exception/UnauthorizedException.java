package com.raiza.demo.shared.exception;

public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException() {
        super("Authentication required");
    }

    public UnauthorizedException(String message) {
        super(message);
    }
}
