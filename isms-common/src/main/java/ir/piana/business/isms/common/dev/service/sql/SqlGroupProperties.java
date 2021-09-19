package ir.piana.business.isms.common.dev.service.sql;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SqlGroupProperties {
    private String insert;
    private String update;
    private String delete;
    private String select;
}
