package ir.piana.business.isms.common.model;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResponseModel<T> {
    private int code;
    private T data;
}
