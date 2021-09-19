package ir.piana.business.isms.common.model.form;

import lombok.*;

import java.util.List;
import java.util.Map;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SearchModel {
    private List<Map<String, Object>> records;
    private long count;
}
