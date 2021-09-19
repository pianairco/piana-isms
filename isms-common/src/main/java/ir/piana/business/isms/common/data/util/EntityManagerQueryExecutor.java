package ir.piana.business.isms.common.data.util;


import org.hibernate.transform.AliasToEntityMapResultTransformer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.StoredProcedureQuery;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Component
public class EntityManagerQueryExecutor {
    @Autowired
    List<EntityManager> entityManagers;

    public StoredProcedureQuery getStoredProcedureQuery(String name) {
        return this.entityManagers.get(0).createNamedStoredProcedureQuery(name);
    }

//    public <T> T mapToObject(String sql, Class<T> requiredType) {
//        T unwrap = entityManagers.get(0).createNativeQuery(sql).getResultList(requiredType);
//        return unwrap;
//    }

    public <T> T queryForObject(String sql) {
        /*T res = (T) entityManagers.get(0)
                .createNativeQuery(sql)
                .unwrap(Query.class)
                .getSingleResult();
        return res;*/
        return queryForObject(sql, null);
    }

    public <T> T queryForObject(String sql, Class<T> requiredType) {
        return queryForObject(sql, new Object[0], new int[0], requiredType);
    }

    public <T> T queryForObject(String sql, Object[] params, int[] types, Class<T> requiredType) {
        Query nativeQuery = entityManagers.get(0).createNativeQuery(sql);
        for(int i = 0; i < params.length; i++) {
            nativeQuery.setParameter(i + 1, params[i]);
        }
        T res = (T) nativeQuery
                .unwrap(org.hibernate.query.Query.class)
                .getSingleResult();
        if(requiredType == Long.class)
            return (T) new Long(((BigDecimal)res).longValue());
        else if(requiredType == Integer.class)
            return (T) new Integer(((BigDecimal)res).intValue());
        else if(requiredType == Short.class)
            return (T) new Short(((BigDecimal)res).shortValue());
        else if(requiredType == Boolean.class)
            return (T) new Boolean(((BigDecimal)res).intValue() == 0);
        else if(requiredType == Double.class)
            return (T) new Double(((BigDecimal)res).doubleValue());
        else if(requiredType == Float.class)
            return (T) new Float(((BigDecimal)res).floatValue());
        return res;
    }

    public <T> T findEntityById(Class<T> requirdeType, long id) {
        return entityManagers.get(0).find(requirdeType, id);
    }

    public <T> long findCountByHql(String hql) {
        Query query = entityManagers.get(0).createQuery(hql);
        List resultList = query.setMaxResults(1).getResultList();
        Long count = (Long) resultList.iterator().next();
        return count;
    }

    public <T> List<T> findEntityList(String jpql) {
        Query query = entityManagers.get(0).createQuery(jpql);
        return query.getResultList();
    }

    public <T> void saveEntity(T entity) {
        entityManagers.get(0).persist(entity);
    }

    public <T> void removeEntity(T entity) {
        entityManagers.get(0).remove(entity);
    }

    public <T> List<Map<String, T>> queryForList(String sql) {
        /*List<Map<String, T>> res = (List<Map<String, T>>) entityManagers.get(0)
                .createNativeQuery(sql)
                .unwrap(org.hibernate.query.Query.class)
                .setResultTransformer(
                        AliasToEntityMapResultTransformer.INSTANCE
                )
                .getResultList();
        return res;*/
        return queryForList(sql, new Object[0], new int[0]);
    }
    public <T> List<Map<String, T>> queryForList(String sql, Object[] params, int[] types) {
        Query nativeQuery = entityManagers.get(0).createNativeQuery(sql);
        for(int i = 0; i < params.length; i++) {
            nativeQuery.setParameter(i + 1, params[i]);
        }
        List<Map<String, T>> res = nativeQuery.unwrap(org.hibernate.query.Query.class)
                .setResultTransformer(
                        AliasToEntityMapResultTransformer.INSTANCE
                )
                .getResultList();
        return res;
    }

    public <T> Map<String, T> queryForMap(String sql) {
        /*Map<String, T> res = (Map<String, T>) entityManagers.get(0)
                .createNativeQuery(sql)
                .unwrap(org.hibernate.query.Query.class)
                .setResultTransformer(
                        AliasToEntityMapResultTransformer.INSTANCE
                )
                .getSingleResult();
        return res;*/
        return queryForMap(sql, new Object[0], new int[0]);
    }

    public <T> Map<String, T> queryForMap(String sql, Object[] params, int[] types) {
        Query nativeQuery = entityManagers.get(0).createNativeQuery(sql);
        for(int i = 0; i < params.length; i++) {
            nativeQuery.setParameter(i + 1, params[i]);
        }
        Map<String, T> res = (Map<String, T>) nativeQuery
                .unwrap(org.hibernate.query.Query.class)
                .setResultTransformer(
                        AliasToEntityMapResultTransformer.INSTANCE
                )
                .getSingleResult();
        return res;
    }

    public String getAppParamValueString(String paramCode) {
        return queryForObject("select PARAM_VALUE_STRING from app_param where param_code = '" + paramCode + "'", String.class);
    }

    public Double getAppParamValue(String paramCode) {
        return queryForObject("select PARAM_VALUE from app_param where param_code = '" + paramCode + "'", Double.class);
    }

/*    Tuple t = (Tuple)entityManagers.get(0).createNativeQuery("select * from menu", Tuple.class).getResultList().get(0);
t.getElements().get(0).getAlias();*/

    @Transactional(propagation = Propagation.REQUIRED)
    public int update(String sql, Object[] args, int[] argTypes) {
        Query nativeQuery = entityManagers.get(0).createNativeQuery(sql);
        for(int i = 0; i < args.length; i++) {
            nativeQuery.setParameter(i + 1, args[i]);
        }
        int i = nativeQuery.executeUpdate();
        return i;
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void flush() {
        entityManagers.get(0).flush();
    }
    /*public List<String> queryListOfString(String query) throws SQLException {
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
            return value instanceof BigDecimal ? ((BigDecimal)value).longValue() : (Long) value;
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
    }*/


}
