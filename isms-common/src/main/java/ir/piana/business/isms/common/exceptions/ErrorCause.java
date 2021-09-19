package ir.piana.business.isms.common.exceptions;

import lombok.Getter;

@Getter
public enum ErrorCause {
    UNKNOWN(0),
    PULL_CUSTOMER_SERVER(1),
    CREATE_USER_SERVER(2),
    JSON_PARSE(3),
    NULL_POINTER(4),
    INVALID_APP_USER(5),
    ENTITY_NOT_FOUND(6),
    INTERNAL_ERROR(7),
    DATA_INVALID(8),
    DS_CODE_NOT_PRESENT(9),
    DATABASE_CONNECTION(10);

    private int code;

    ErrorCause(int code) {
        this.code = code;
    }
}
