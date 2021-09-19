package ir.piana.business.isms.module.general.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SelectableModel<T> {
    private String title;
    private T value;
}
