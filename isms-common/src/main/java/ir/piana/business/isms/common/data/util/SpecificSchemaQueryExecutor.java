package ir.piana.business.isms.common.data.util;

import com.zaxxer.hikari.HikariDataSource;
import ir.piana.business.isms.common.util.StringUtil;
import org.apache.commons.dbutils.BasicRowProcessor;
import org.apache.commons.dbutils.BeanProcessor;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.RowProcessor;
import org.apache.commons.dbutils.handlers.*;

import javax.persistence.Column;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class SpecificSchemaQueryExecutor {
    private HikariDataSource ds;

    public SpecificSchemaQueryExecutor(HikariDataSource ds) {
        this.ds = ds;
    }

    public HikariDataSource getDatasource() {
        return ds;
    }

    BeanListHandler fetchBeanListHandler(Class type) {
        Map<String, String> columnToPropertyOverrides = new LinkedHashMap<>();
        Field[] declaredFields = type.getDeclaredFields();
        for (Field field : declaredFields) {
            Column annotation = field.getAnnotation(Column.class);
            if(annotation != null)
                columnToPropertyOverrides.put(annotation.name(), field.getName());
            else
                columnToPropertyOverrides.put(StringUtil.camelToSnake(field.getName()), field.getName());
        }

        RowProcessor rowProcessor = new BasicRowProcessor(new BeanProcessor(columnToPropertyOverrides));
        BeanListHandler beanListHandler = new BeanListHandler<>(type, rowProcessor);
        return beanListHandler;
    }

    public List<String> queryListOfString(String query) throws SQLException {
        Connection conn = ds.getConnection();
        try {
            QueryRunner runner = new QueryRunner();

            return runner.query(conn, query, new ColumnListHandler<String>());
        } finally {
            ds.evictConnection(conn);
        }
    }

    public <T> List<T> queryList(String query, Class type) throws SQLException {
        return queryList(query, type, new Object[0]);
    }

    public <T> List<T> queryList(String query, Class type, Object[] sqlParams) throws SQLException {
        Connection conn = ds.getConnection();
        try {
            QueryRunner runner = new QueryRunner();

            BeanListHandler beanListHandler = fetchBeanListHandler(type);

            List list = (List<Object>)runner.query(conn, query, beanListHandler,sqlParams);
            return list;
        } finally {
            ds.evictConnection(conn);
        }
    }

    public <T> T queryObject(String query, Class type, Object[] sqlParams) throws SQLException {
        Connection conn = ds.getConnection();
        try {
            QueryRunner runner = new QueryRunner();
            BeanListHandler beanListHandler = fetchBeanListHandler(type);

            T object = (T)runner.query(conn, query, beanListHandler,sqlParams);
            return object;
        } finally {
            ds.evictConnection(conn);
        }
    }

    public Map<String, Object> queryMap(String query) throws SQLException {
        return queryMap(query, new Object[0]);
    }

    public Map<String, Object> queryMap(String query, Object[] sqlParams) throws SQLException {
        Connection conn = ds.getConnection();
        try {
            QueryRunner runner = new QueryRunner();
            MapHandler beanMapHandler = new MapHandler();

            return runner.query(conn, query, beanMapHandler, sqlParams);
        } finally {
            ds.evictConnection(conn);
        }
    }

    public List<Map<String, Object>> queryListOfMap(String query) throws SQLException {
        return queryListOfMap(query, new Object[0]);
    }

    public List<Map<String, Object>> queryListOfMap(String query, Object[] sqlParams) throws SQLException {
        Connection conn = ds.getConnection();
        try {
            QueryRunner runner = new QueryRunner();
            MapListHandler beanListHandler = new MapListHandler();

            return runner.query(conn, query, beanListHandler, sqlParams);
        } finally {
            ds.evictConnection(conn);
        }
    }

    public String queryString(String query) throws SQLException {
        Connection conn = ds.getConnection();
        try {
            QueryRunner runner = new QueryRunner();
            return runner.query(conn, query, new ScalarHandler<>());
        } finally {
            ds.evictConnection(conn);
        }
    }

    public int queryInt(String query) throws SQLException {
        Connection conn = ds.getConnection();
        try {
            QueryRunner runner = new QueryRunner();
            Object value = runner.query(conn, query, new ScalarHandler<>());
            return value instanceof BigDecimal ? ((BigDecimal)value).intValue() : (Integer) value;
        } finally {
            ds.evictConnection(conn);
        }
    }

    public long nextSequence(String sequenceName) throws SQLException {
        String query = String.format("select %s.nextvalue from dual", sequenceName);
        return queryLong(query, new Object[0]);
    }

    public long queryLong(String query) throws SQLException {
        return queryLong(query, new Object[0]);
    }

    public long queryLong(String query, Object[] sqlParams) throws SQLException {
        Connection conn = ds.getConnection();
        try {
            QueryRunner runner = new QueryRunner();
            Object value = runner.query(conn, query, sqlParams, new ScalarHandler<>());
            return value instanceof BigDecimal ? ((BigDecimal)value).longValue() : value instanceof Number ?
                    ((Number)value).longValue() : (Long) value;
        } finally {
            ds.evictConnection(conn);
        }
    }

    public double queryDouble(String query) throws SQLException {
        Connection conn = ds.getConnection();
        try {
            QueryRunner runner = new QueryRunner();
            BigDecimal value = runner.query(conn, query, new ScalarHandler<>());
            return value.doubleValue();
        } finally {
            ds.evictConnection(conn);
        }
    }

    public float queryFloat(String query) throws SQLException {
        Connection conn = ds.getConnection();
        try {
            QueryRunner runner = new QueryRunner();
            BigDecimal value = runner.query(conn, query, new ScalarHandler<>());
            return value.floatValue();
        } finally {
            ds.evictConnection(conn);
        }
    }

    public boolean queryBoolean(String query) throws SQLException {
        Connection conn = ds.getConnection();
        try {
            QueryRunner runner = new QueryRunner();
            BigDecimal value = runner.query(conn, query, new ScalarHandler<>());
            return value.longValue() != 0;
        } finally {
            ds.evictConnection(conn);
        }
    }

    public boolean execute(String query) throws SQLException {
        return execute(query, new Object[0]);
    }

    public boolean execute(String query, Object[] sqlParams) throws SQLException {
        Connection conn = ds.getConnection();
        try {
            QueryRunner runner = new QueryRunner();
            int execute = runner.execute(conn, query, sqlParams);
            return execute > 0;
        } finally {
            ds.evictConnection(conn);
        }
    }

    private static final String countQuery = "select count(*) from (%s)";

    public long countOfResults(String query) throws SQLException {
        Connection conn = ds.getConnection();
        try {
            QueryRunner runner = new QueryRunner();
            Long value = runner.query(conn, String.format(countQuery, query), new ScalarHandler<>());
            return value.longValue();
        } finally {
            ds.evictConnection(conn);
        }
    }
}
