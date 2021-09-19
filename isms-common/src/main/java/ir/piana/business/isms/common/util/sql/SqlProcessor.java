package ir.piana.business.isms.common.util.sql;

import ir.piana.business.isms.common.data.util.EntityManagerQueryExecutor;
import ir.piana.business.isms.common.util.CommonUtils;
import ir.piana.business.isms.common.util.ResourceManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Types;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component("SqlProcessor")
public class SqlProcessor {
    @Autowired
    private ResourceManager resourceManager;

    private String getNormalQuery (String query, ParamMap params) {
        Matcher matcher = Pattern.compile("@\\s*(\\w+)").matcher(query);
        String normalQuery = query;
        int counter = 0;
        while (matcher.find())  {
            String group = matcher.group();
            int start = matcher.start();
            int end = matcher.end();
            String val = params.getString(group.substring(1));
            normalQuery = normalQuery.substring(0, start + counter)
                    .concat(val == null ? "null" : val)
                    .concat(normalQuery.substring(end + counter));
            counter += val == null ?
                    "null".length() - (group.length()) : val.length() - (group.length());
        }
        return normalQuery;
    }

    public QueryContainer createQueryContainer (
            String pre,
            String query,
            String post,
            ParamMap params) throws IOException {
        return createQueryContainer(getConditionProcessedQuery(pre + " " + query + " " + post, params), params);
    }

    public QueryContainer createQueryContainer (
            String pre,
            Class theClass, String resourcePath,
            String post,
            ParamMap params) throws IOException {
        String query = resourceManager.getResourceAsString(resourcePath, theClass);
//        String query = IOUtils.toString(
//                queryStream,
//                StandardCharsets.UTF_8.name());

        return createQueryContainer(getConditionProcessedQuery(pre + " " + query + " " + post, params), params);
    }

    public QueryContainer createQueryContainer (
            Class theClass, String resourcePath, ParamMap params) throws IOException {
        String query = resourceManager.getResourceAsString(resourcePath, theClass);
//        String query = IOUtils.toString(
//                queryStream,
//                StandardCharsets.UTF_8.name());

        return createQueryContainer(getConditionProcessedQuery(query, params), params);
        /*query = getNormalQuery(query, params);
        Map <Long, ParamDef> paramDefMap = new LinkedHashMap<>();
        String finalQuery = query;
        for(String key : params.keySet()) {
            Object val = params.get(key);
            Matcher matcher = Pattern.compile(key).matcher(query);
            Matcher finalMatcher = Pattern.compile(key).matcher(finalQuery);
            while (matcher.find())  {
                String group = matcher.group();
                int start = matcher.start();
                int end = matcher.end();
                paramDefMap.put(Long.valueOf(start), new ParamDef(start, end, key, val, getSqlType(val)));
            }
            if(finalMatcher.find()) {
                finalQuery = finalMatcher.replaceAll("?");
            }
            query.replaceAll(key, String.valueOf(params.get(key)));
        }
        SortedSet<Long> keys = new TreeSet(paramDefMap.keySet());
        int[] types = new int[keys.size()];
        Object[] values = new Object[keys.size()];
        Iterator<Long> iterator = keys.iterator();
        for(int ordinal = 0; iterator.hasNext(); ordinal++) {
            ParamDef paramDef = paramDefMap.get(iterator.next());
            types[ordinal] = getSqlType(paramDef.value);
            values[ordinal] = paramDef.value;
        }

        return new QueryContainer(finalQuery, values, types);*/
    }

    /**
     * ToDo => this method must be replaced by design pattern in the future
     */
    public String getConditionProcessedQuery (
            String query, ParamMap params) throws IOException {
        String normalQuery = query;
        int counter = 0;
        Pattern pattern = Pattern.compile("\\{(.*?)\\}", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(query);
        while (matcher.find()) {
            String[] split = matcher.group(1).split(":");
            int start = matcher.start();
            int end = matcher.end();
            if(split[0].equalsIgnoreCase("if")) {
                if(split[1].equalsIgnoreCase("not-null")) {
                    Object o = params.get(split[2].substring(1));
                    if (o != null && !CommonUtils.isNull(o)) {
                        normalQuery = normalQuery.substring(0, start + counter)
                                .concat(split[3])
                                .concat(normalQuery.substring(end + counter));
                        counter += split[3].length() - (matcher.group().length());
                    } else {
                        normalQuery = normalQuery.substring(0, start + counter)
                                .concat(normalQuery.substring(end + counter));
                        counter -= (matcher.group().length());
                    }
                } else if(split[1].equalsIgnoreCase("null")) {
                    Object o = params.get(split[2].substring(1));
                    if (o == null || CommonUtils.isNull(o)) {
                        normalQuery = normalQuery.substring(0, start + counter)
                                .concat(split[3])
                                .concat(normalQuery.substring(end + counter));
                        counter += split[3].length() - (matcher.group().length());
                    } else {
                        normalQuery = normalQuery.substring(0, start + counter)
                                .concat(normalQuery.substring(end + counter));
                        counter -= (matcher.group().length());
                    }
                }
            }
        }
        return normalQuery;
    }

    public QueryContainer createQueryContainer (
            String query, ParamMap params) throws IOException {
        query = getNormalQuery(query, params);
        Map <Long, ParamDef> paramDefMap = new LinkedHashMap<>();
        String finalQuery = query;
        for(String key : params.keySet()) {
            Object val = params.getObject(key);
            Matcher matcher = Pattern.compile("(?i)" + key + "(?=[\\s,)\\/]{1})").matcher(query.concat(" "));
            Matcher finalMatcher = Pattern.compile("(?i)" + key + "(?=[\\s,)\\/]{1})").matcher(finalQuery.concat(" "));
            while (matcher.find())  {
//                String group = matcher.group();
                int start = matcher.start();
                int end = matcher.end();
//                if(start == 0 || Arrays.asList("=", " ", ">", "<", "%").contains(query.substring(start-1, start)))
//                if(end == query.length() || Arrays.asList(" ", ",", ")").contains(query.substring(end, end + 1)))
                paramDefMap.put(Long.valueOf(start), new ParamDef(start, end, key, val, getSqlType(val)));
            }
            if(finalMatcher.find()) {
                    finalQuery = finalMatcher.replaceAll("?");
            }
//            query.replaceAll(key, params.getString(key));
        }
        SortedSet<Long> keys = new TreeSet(paramDefMap.keySet());
        int[] types = new int[keys.size()];
        Object[] values = new Object[keys.size()];
        Iterator<Long> iterator = keys.iterator();
        for(int ordinal = 0; iterator.hasNext(); ordinal++) {
            ParamDef paramDef = paramDefMap.get(iterator.next());
            types[ordinal] = getSqlType(paramDef.value);
            values[ordinal] = paramDef.value;
        }

        return new QueryContainer(finalQuery, values, types);
    }

    public int getSqlType(Object obj) {
        if (obj instanceof BigDecimal)
            return Types.BIGINT;
        else if(obj instanceof Integer || obj instanceof Long ||
                obj instanceof Short || obj instanceof Byte ||
                obj instanceof Double || obj instanceof Float)
            return Types.NUMERIC;
        else if(obj instanceof Boolean)
            return Types.NUMERIC;
        else if(obj instanceof String)
            return Types.VARCHAR;
        return Types.VARCHAR;
    }

    public List<Map<String, Object>> queryList(
            Class theClass, String resourcePath, ParamMap params,
            EntityManagerQueryExecutor entityManagerQueryExecutor)
            throws IOException {
        String inputStream = resourceManager.getResourceAsString(resourcePath, theClass);
        QueryContainer queryContainer = createQueryContainer(
                inputStream,
                params);
        return entityManagerQueryExecutor.queryForList(
                queryContainer.getQuery(), queryContainer.getValues(), queryContainer.getTypes());
    }

    public void queryFlatToMap(
            Class theClass, String resourcePath, ParamMap params,
            EntityManagerQueryExecutor entityManagerQueryExecutor)
            throws IOException {
        String inputStream = resourceManager.getResourceAsString(resourcePath, theClass);
        QueryContainer queryContainer = createQueryContainer(inputStream, params);
        Map<String, Object> map = entityManagerQueryExecutor.queryForMap(
                queryContainer.getQuery(), queryContainer.getValues(), queryContainer.getTypes());
        params.put(map);
    }

    public void queryFlatToMap(
            Class theClass, String resourcePath, ParamMap params,
            EntityManagerQueryExecutor entityManagerQueryExecutor, String key)
            throws IOException {
        String inputStream = resourceManager.getResourceAsString(resourcePath, theClass);
        QueryContainer queryContainer = createQueryContainer(inputStream, params);
        Map<String, Object> map = entityManagerQueryExecutor.queryForMap(
                queryContainer.getQuery(), queryContainer.getValues(), queryContainer.getTypes());
        params.put(key, map);
    }

    public void save (
            Class theClass, String resourcePath, ParamMap params,
            EntityManagerQueryExecutor entityManagerQueryExecutor)
            throws IOException {
        String inputStream = resourceManager.getResourceAsString(resourcePath, theClass);
        QueryContainer queryContainer = createQueryContainer(inputStream, params);
        entityManagerQueryExecutor.update(
                queryContainer.getQuery(), queryContainer.getValues(), queryContainer.getTypes());
    }

    private static class ParamDef {
        long start;
        long end;
        String param;
        Object value;
        int type;

        public ParamDef(long start, long end, String param, Object value, int type) {
            this.start = start;
            this.end = end;
            this.param = param;
            this.value = value;
            this.type = type;
        }
    }

    public static class QueryContainer {
        String query;
        Object[] values;
        int[] types;

        QueryContainer(String query, Object[] values, int[] types) {
            this.query = query;
            this.values = values;
            this.types = types;
        }

        public String getQuery() {
            return query;
        }

        public Object[] getValues() {
            return values;
        }

        public int[] getTypes() {
            return types;
        }
    }
}
