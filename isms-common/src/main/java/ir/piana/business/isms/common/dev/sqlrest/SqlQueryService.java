package ir.piana.business.isms.common.dev.sqlrest;

import ir.piana.business.isms.common.data.util.SpecificSchemaQueryExecutor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Service
public class SqlQueryService {
//    @Autowired
//    private JdbcTemplate jdbcTemplate;

//    @Autowired
//    HikariDataSource dataSource;

    @Autowired
    SpecificSchemaQueryExecutor executor;

    public <T> T execute(ServiceProperties.SQL sql, Object[] params) {
        if (sql.getType().equalsIgnoreCase("select")) {
            if (sql.getResultType().equalsIgnoreCase("object")) {
                return (T) select(sql.getQuery(), params);
            } else if (sql.getResultType().equalsIgnoreCase("list")) {
                return (T) list(sql.getQuery(), params);
            } else if (sql.getResultType().equalsIgnoreCase("string")) {
                return (T) selectObject(sql.getQuery(), params, String.class);
            } else if (sql.getResultType().equalsIgnoreCase("long")) {
                return (T) selectObject(sql.getQuery(), params, Long.class);
            } else if (sql.getResultType().equalsIgnoreCase("double")) {
                return (T) selectObject(sql.getQuery(), params, Double.class);
            } else if (sql.getResultType().equalsIgnoreCase("boolean")) {
                return (T) selectObject(sql.getQuery(), params, Boolean.class);
            }
        } else if (sql.getType().equalsIgnoreCase("insert")) {
            insert(sql.getQuery(), sql.getSequenceName(), params);
            return (T) AjaxController.AjaxReplaceType.INSERTED;
        } else if (sql.getType().equalsIgnoreCase("update")) {
            update(sql.getQuery(), params);
            return (T) AjaxController.AjaxReplaceType.UPDATED;
        } else if (sql.getType().equalsIgnoreCase("delete")) {
            delete(sql.getQuery(), params);
            return (T) AjaxController.AjaxReplaceType.UPDATED;
        }
        return (T) AjaxController.AjaxReplaceType.NO_RESULT;
    }

    public Map<String, Object> select(String query, Object[] sqlParams) {
        try {
            return executor.queryMap(query, sqlParams);
//            return executorMap.get(dataSource.getPoolName()).queryMap(query, sqlParams);
//            return jdbcTemplate.queryForMap(query, sqlParams);
        } catch (SQLException ex) {
            return null;
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }

    public List<Map<String, Object>> list(String query, Object[] sqlParams) {
        try {
            return executor.queryListOfMap(query, sqlParams);
//            return executorMap.get(dataSource.getPoolName()).queryListOfMap(query, sqlParams);
        } catch (SQLException e) {
            return null;
        }
//        return jdbcTemplate.queryForList(query, sqlParams);
    }

    public <T> T selectObject(String query, Object[] sqlParams, Class<T> requiredType) {
        try {
            return (T) executor.queryObject(query, requiredType, sqlParams);
//            return (T) executorMap.get(dataSource.getPoolName()).queryObject(query, requiredType, sqlParams);
//            return (T) jdbcTemplate.queryForObject(query, sqlParams, requiredType);
        } catch (EmptyResultDataAccessException ex) {
            return null;
        } catch (SQLException e) {
            return null;
        }
    }

    public Long selectSequenceValue(String sequenceName) {
        try {
            return executor.queryLong("select " + sequenceName + ".nextval from dual");
//            return executorMap.get(dataSource.getPoolName()).queryLong("select " + sequenceName + ".nextval from dual");
        } catch (SQLException e) {
            return null;
        }
//        return jdbcTemplate.queryForObject("select " + sequenceName + ".nextval from dual", Long.class);
    }

    public Long insert(String query, String sequenceName, Object[] sqlParams) {
//        Long id = null;
//        for(int i = 0; i< sqlParams.length; i++) {
//            if(sqlParams[i] == AjaxController.AjaxReplaceType.ITS_ID) {
//                id = jdbcTemplate.queryForObject("select " + sequenceName + ".nextval from dual", Long.class);
//                sqlParams[i] = id;
//                break;
//            }
//        }
        try {
            executor.execute(query, sqlParams);
//            executorMap.get(dataSource.getPoolName()).execute(query, sqlParams);
        } catch (SQLException e) {
            return 1l;
        }
//        jdbcTemplate.update(query, sqlParams);
//        jdbcTemplate.update(query, ArrayUtils.addAll(new Object[] {id}, sqlParams));
//        return id;
        return 0l;
    }

    public void update(String query, Object[] sqlParams) {
        try {
            executor.execute(query, sqlParams);
//            executorMap.get(dataSource.getPoolName()).execute(query, sqlParams);
        } catch (SQLException e) {
        }
//        jdbcTemplate.update(query, sqlParams);
    }

    public void delete(String query, Object[] sqlParams) {
        try {
            executor.execute(query, sqlParams);
//            executorMap.get(dataSource.getPoolName()).execute(query, sqlParams);
        } catch (SQLException e) {
        }
//        jdbcTemplate.update(query, sqlParams);
    }
}
