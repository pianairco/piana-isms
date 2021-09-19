package ir.piana.business.isms.common.model.form.structure;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SelectableItem<T> {
    private String title;
    private T value;
}
