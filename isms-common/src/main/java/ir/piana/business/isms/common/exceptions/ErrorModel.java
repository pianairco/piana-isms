package ir.piana.business.isms.common.exceptions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ErrorModel {
    private String title;
    @JsonProperty("description")
    private String message;
    private String descriptionEN;
    private int errorCode;
    private String errorType;
    @JsonProperty("UUID")
    private String UUID;
    @JsonIgnore
    private ErrorCause errorCause;
    @JsonIgnore
    private String logObjectId;
}
