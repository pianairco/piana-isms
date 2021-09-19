package ir.piana.business.isms.common.util.sql;

import java.io.Serializable;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.*;
import java.util.regex.Pattern;

public class ParamMap implements Serializable {
    private Map<String, String> stringMap = new LinkedHashMap<>();
    private Map<String, BigDecimal> numberMap = new LinkedHashMap<>();
    Pattern calcSignPattern = Pattern.compile("[\\d\\+\\/\\*\\$\\-]");

    public Map<String, String> getStringMap() {
        return stringMap;
    }

    public Map<String, BigDecimal> getNumberMap() {
        return numberMap;
    }

    public ParamMap clone() {
        ParamMap paramMap = new ParamMap();
        paramMap.stringMap.putAll(stringMap);
        paramMap.numberMap.putAll(numberMap);
        return paramMap;
    }

    public void putFromOther(String rootKey, ParamMap other) {
        for( String key : other.keySet()) {
            if(key.contains(".") && key.split("\\.")[0].equalsIgnoreCase(rootKey)) {
                put(key, other.get(key));
            }
        }
    }

    public ParamMap clone(String keys) {
        ParamMap paramMap = new ParamMap();
        for(String key : keys.split(",")) {
            String[] split = key.trim().split(":");
            String val = split[0];
            if(val.startsWith("$")) {
                if(val.startsWith("$D")) {
                    paramMap.put(split.length > 1 ? split[1] : split[0], new BigDecimal(split[1].substring(2)));
                } else if(val.equals("$Z"))
                    paramMap.put(split.length > 1 ? split[1] : split[0], 0);
                else if (val.equals("$NS"))
                    paramMap.setString(split.length > 1 ? split[1] : split[0], null);
                else if (val.equals("$NN"))
                    paramMap.setNumber(split.length > 1 ? split[1] : split[0], null);
            } else if(calcSignPattern.matcher(val).find()) {
                paramMap.put(split.length > 1 ? split[1] : split[0], calc(val));
            } else {
                paramMap.put(split.length > 1 ? split[1] : split[0], get(val));
            }
        }
        return paramMap;
    }

    public ParamMap clone(String ...keys) {
        ParamMap paramMap = new ParamMap();
        for(String key : keys) {
            paramMap.put(key, get(key));
        }
//        paramMap.stringMap.putAll(stringMap);
//        paramMap.numberMap.putAll(numberMap);
        return paramMap;
    }

    public void putNull(String key) {
        setString(key, null);
    }

    public void putZero(String key) {
        setNumber(key, 0);
    }

    public void putIfNull(String key, Object value) {
        if(isNull(key))
            put(key, value);
    }

    public void putNullNumber(String key) {
        setNumber(key, null);
    }

    public void duplicate(String key, String fromKey) {
        if(stringMap.containsKey(fromKey.toUpperCase())) {
            stringMap.put(key.toUpperCase(), stringMap.get(fromKey.toUpperCase()));
        } else if(numberMap.containsKey(fromKey.toUpperCase())) {
            numberMap.put(key.toUpperCase(), numberMap.get(fromKey.toUpperCase()));
        }
    }

    public void replace(String key, String fromKey) {
        if(stringMap.containsKey(fromKey.toUpperCase())) {
            stringMap.put(key.toUpperCase(), stringMap.get(fromKey.toUpperCase()));
            stringMap.remove(fromKey.toUpperCase());
        } else if(numberMap.containsKey(fromKey.toUpperCase())) {
            numberMap.put(key.toUpperCase(), numberMap.get(fromKey.toUpperCase()));
            numberMap.remove(fromKey.toUpperCase());
        }

    }

    public void duplicateThenRemoveSource(String key, String fromKey) {
        put(key, remove(fromKey));
    }

    public <T> T remove(String key) {
        if(stringMap.containsKey(key))
            return (T) stringMap.remove(key.toUpperCase());
        else if (numberMap.containsKey(key.toUpperCase()))
            return (T) numberMap.remove(key.toUpperCase());
        return null;
    }

    public void put(Map<String, Object> map) {
        for(String key: map.keySet()) {
            put(key, map.get(key));
        }
    }

    public void put(String key, Object value) {
        if(value == null){
            putNull(key);
        } else if(value instanceof String)
            setString(key, (String) value);
        else if (value instanceof BigDecimal) {
            setNumber(key, (BigDecimal) value);
        } else if (value instanceof Integer) {
            setNumber(key, (Integer) value);
        } else if (value instanceof Long) {
            setNumber(key, (Long) value);
        } else if (value instanceof Float) {
            setNumber(key, (Float) value);
        } else if (value instanceof Double) {
            setNumber(key, (Double) value);
        } else if(value instanceof Boolean) {
            setNumber(key, (boolean)value == true ? 1 : 0);
        } else if(value instanceof Map) {
            Map<String, Object> m = (Map)value;
            for(String k : m.keySet()) {
                put(key.concat(".").concat(k), m.get(k));
            }
        }
    }

    public void setString(String key, String value) {
        stringMap.put(key.toUpperCase(), value);
    }

    public void setNumber(String key, long value) {
        numberMap.put(key.toUpperCase(), new BigDecimal(value));
    }

    public void setNumber(String key, int value) {
        numberMap.put(key.toUpperCase(), new BigDecimal(value));
    }

    public void setNumber(String key, float value) {
        numberMap.put(key.toUpperCase(), new BigDecimal(value));
    }

    public void setNumber(String key, double value) {
        numberMap.put(key.toUpperCase(), new BigDecimal(value));
    }

    public void setNumber(String key, BigDecimal value) {
        numberMap.put(key.toUpperCase(), value);
    }

    Set<String> keySet() {
        Set<String> strings = new HashSet<>();
        strings.addAll(stringMap.keySet());
        strings.addAll(numberMap.keySet());
        return strings;
    }

    public Object getObject(String key) {
        Object val = stringMap.get(key.toUpperCase());
        return val != null ? val : numberMap.get(key.toUpperCase());
    }

    public <T> T get(String key) {
        T val = (T) stringMap.get(key.toUpperCase());
        return val != null ? val : (T)numberMap.get(key.toUpperCase());
    }

    public String getString(String key) {
        String val = stringMap.get(key.toUpperCase());
        if(val == null && numberMap.containsKey(key.toUpperCase()) && numberMap.get(key.toUpperCase()) != null)
            val = numberMap.get(key.toUpperCase()).toString();
        return val;
    }

    public boolean isNull(String key) {
        return stringMap.get(key.toUpperCase()) == null && numberMap.get(key.toUpperCase()) == null;
    }

    public BigDecimal getNumber(String key) {
        return numberMap.get(key.toUpperCase());
    }

    public BigDecimal getBigDecimal(String key) {
        return numberMap.get(key.toUpperCase());
    }

    public BigDecimal getBigDecimal(String key, BigDecimal ifNull) {
        return numberMap.get(key.toUpperCase()) != null ? numberMap.get(key.toUpperCase()) : ifNull;
    }

    public BigDecimal getBigDecimal(String key, long ifNull) {
        return numberMap.get(key.toUpperCase()) != null ?
                numberMap.get(key.toUpperCase()) : new BigDecimal(ifNull);
    }

    public long getLong(String key) {
        return numberMap.get(key.toUpperCase()).longValue();
    }

    public int getInt(String key) {
        return numberMap.get(key.toUpperCase()).intValue();
    }

    public float getFloat(String key) {
        return numberMap.get(key.toUpperCase()).floatValue();
    }

    public double getDouble(String key) {
        return numberMap.get(key.toUpperCase()).doubleValue();
    }

    private static List<String> operators = Arrays.asList("*", "/", "+", "-");
    private static List<String> separateOperators = Arrays.asList("**", "//", "++", "--", "$$", "^^");

    public static enum CompareSign {
        EQUAL("="),
        UNEQUAL("!="),
        GREATER(">"),
        GREATER_OR_EQUAL(">="),
        LESSER("<"),
        LESSER_OR_EQUAL("<=");

        private String sign;

        CompareSign(String sign) {
            this.sign = sign;
        }

        public static CompareSign bySign(String sign) {
            for (CompareSign c : CompareSign.values()) {
                if(c.sign.equals(sign))
                    return c;
            }
            throw new RuntimeException("CompareSign sign not found!");
        }
    }

    public static enum ComputationalSign {
        SUM("+"),
        SUB("-"),
        MUL("*"),
        DIV("/"),
        TRUNC("^"),
        ROUND("$");

        private String sign;

        ComputationalSign(String sign) {
            this.sign = sign;
        }

        public static ComputationalSign bySign(String sign) {
            for (ComputationalSign c : ComputationalSign.values()) {
                if(c.sign.equals(sign))
                    return c;
            }
            throw new RuntimeException("CompareSign sign not found!");
        }
    }

    public void putConditional(
            String key, String formula1, String sign, String formula2,
            String formulaIfTrue, String formulaIfFalse) {
        switch (CompareSign.bySign(sign)) {
            case EQUAL:
                put(key, calc(formula1).doubleValue() == calc(formula2).doubleValue() ?
                        calc(formulaIfTrue) : calc(formulaIfFalse));
                break;
            case UNEQUAL:
                put(key, calc(formula1).doubleValue() != calc(formula2).doubleValue() ?
                        calc(formulaIfTrue) : calc(formulaIfFalse));
                break;
            case GREATER:
                put(key, calc(formula1).doubleValue() > calc(formula2).doubleValue() ?
                        calc(formulaIfTrue) : calc(formulaIfFalse));
                break;
            case GREATER_OR_EQUAL:
                put(key, calc(formula1).doubleValue() >= calc(formula2).doubleValue() ?
                        calc(formulaIfTrue) : calc(formulaIfFalse));
                break;
            case LESSER:
                put(key, calc(formula1).doubleValue() < calc(formula2).doubleValue() ?
                        calc(formulaIfTrue) : calc(formulaIfFalse));
                break;
            case LESSER_OR_EQUAL:
                put(key, calc(formula1).doubleValue() <= calc(formula2).doubleValue() ?
                        calc(formulaIfTrue) : calc(formulaIfFalse));
                break;
        }
    }

    public BigDecimal calc(String key, String formula) {
        return numberMap.put(key.toUpperCase(), calc(formula));
    }

    public BigDecimal calc(String ...formulas) {
        ComputationalSign computationalSign = null;
        BigDecimal temp = null;
        for(String part : formulas) {
            if (temp == null) {
                temp = calc(part);
            } else {
                if(operators.contains(part)) {
                    computationalSign = ComputationalSign.bySign(part);
                } else if (part.equals("^")) {
                    temp = temp.setScale(0, BigDecimal.ROUND_DOWN);
                } else if (part.equals("$")) {
                    temp = temp.round(new MathContext(0, RoundingMode.HALF_UP));
                } else {
                    switch (computationalSign) {
                        case SUM:
                            temp = temp.add(calc(part));
                            break;
                        case SUB:
                            temp = temp.subtract(calc(part));
                            break;
                        case MUL:
                            temp = temp.multiply(calc(part));
                            break;
                        case DIV:
                            temp = temp.divide(calc(part), RoundingMode.HALF_UP);
                            break;
                    }
                    computationalSign = null;
                }
            }
        }
        return temp;
    }

//    new BigDecimal(10.9).setScale(0, BigDecimal.ROUND_DOWN)
    public BigDecimal calc(String formula) {
        String[] strings = formula.split(" ");
        String operator = null;
        BigDecimal temp = null;
        List<Object> separates = new ArrayList<>();
        for(String part : strings) {
            if(operators.contains(part)) {
                operator = part;
            } else if (part.equals("^")) {
                temp = temp.setScale(0, BigDecimal.ROUND_DOWN);
            } else if (part.equals("$")) {
                temp = temp.round(new MathContext(0, RoundingMode.HALF_UP));
            } else if (separateOperators.contains(part)) {
                if(temp != null)
                    separates.add(temp);
                separates.add(part.substring(0, 1));
                temp = null;
            } else {
                BigDecimal val;
                if(part.startsWith("#"))
                    val = new BigDecimal(part.substring(1));
                else
                    val = numberMap.get(part.toUpperCase());
                if(operator != null) {
                    switch (operator) {
                        case "*":
                            temp = temp.multiply(val);
                            operator = null;
                            break;
                        case "/":
                            temp = temp.divide(val, RoundingMode.HALF_UP);
                            operator = null;
                            break;
                        case "+":
                            temp = temp.add(val);
                            operator = null;
                            break;
                        case "-":
                            temp = temp.subtract(val);
                            operator = null;
                            break;
                    }
                } else {
                    temp = val;
                }
            }
        }
        if(separates.isEmpty())
            return temp;
        if(temp != null)
            separates.add(temp);
        operator = null;
        temp = null;

        for(Object separate : separates) {
            if(separate instanceof BigDecimal) {
                if(operator != null) {
                    switch (operator) {
                        case "*":
                            temp = temp.multiply((BigDecimal)separate);
                            operator = null;
                            break;
                        case "/":
                            temp = temp.divide((BigDecimal)separate, RoundingMode.HALF_UP);
                            operator = null;
                            break;
                        case "+":
                            temp = temp.add((BigDecimal)separate);
                            operator = null;
                            break;
                        case "-":
                            temp = temp.subtract((BigDecimal)separate);
                            operator = null;
                            break;
                    }
                } else {
                    temp = (BigDecimal) separate;
                }
            } else {
                if (separate.equals("^")) {
                    temp = temp.setScale(0, BigDecimal.ROUND_DOWN);
                } else if (separate.equals("$")) {
                    temp = temp.round(new MathContext(0, RoundingMode.HALF_UP));
                } else {
                    operator = (String) separate;
                }
            }
        }
        return temp;
    }

    public boolean calcEqual(String formula, long value) {
        return calcEqual(formula, new BigDecimal(value));
    }

    public boolean calcEqual(String formula, BigDecimal value) {
        return calc(formula).compareTo(value) == 0;
    }

    public boolean calcGreater(String formula, BigDecimal value) {
        return calc(formula).compareTo(value) > 0;
    }

    public boolean calcGreaterOrEqual(String formula, BigDecimal value) {
        return calc(formula).compareTo(value) >= 0;
    }

    public boolean calcLesser(String formula, BigDecimal value) {
        return calc(formula).compareTo(value) < 0;
    }

    public boolean calcLesserOrEqual(String formula, BigDecimal value) {
        return calc(formula).compareTo(value) <= 0;
    }

    public BigDecimal inc(String key, long unit) {
        return numberMap.put(key.toUpperCase(), numberMap.get(key.toUpperCase()).add(new BigDecimal(unit)));
    }

    public BigDecimal subtractOtherKey(String key, String otherKey) {
        return numberMap.put(key.toUpperCase(), numberMap.get(key.toUpperCase()).subtract(numberMap.get(otherKey.toUpperCase())));
    }

    public BigDecimal subtract(String key, BigDecimal value) {
        return numberMap.put(key.toUpperCase(), numberMap.get(key.toUpperCase()).subtract(value));
    }

    public BigDecimal getSubtract(String key, String otherKey) {
        return numberMap.get(key.toUpperCase()).subtract(numberMap.get(otherKey.toUpperCase()));
    }

    public BigDecimal addOtherKey(String key, String otherKey) {
        return numberMap.put(key.toUpperCase(), numberMap.get(key.toUpperCase()).add(numberMap.get(otherKey.toUpperCase())));
    }

    public BigDecimal add(String key, BigDecimal value) {
        return numberMap.put(key.toUpperCase(), numberMap.get(key.toUpperCase()).add(value));
    }

    public BigDecimal getAdd(String key, String otherKey) {
        return numberMap.get(key.toUpperCase()).add(numberMap.get(otherKey.toUpperCase()));
    }

    public BigDecimal getAdd(String key, BigDecimal value) {
        return numberMap.get(key.toUpperCase()).add(value);
    }

    public BigDecimal getAdd(String key, long value) {
        return numberMap.get(key.toUpperCase()).add(BigDecimal.valueOf(value));
    }

    public BigDecimal getAdd(String key, double value) {
        return numberMap.get(key.toUpperCase()).add(BigDecimal.valueOf(value));
    }

    public BigDecimal multiplyOtherKey(String key, String otherKey) {
        return numberMap.put(key.toUpperCase(), numberMap.get(key.toUpperCase())
                .multiply(numberMap.get(otherKey.toUpperCase())));
    }

    public BigDecimal getMultiply(String key, long value) {
        return numberMap.get(key.toUpperCase()).multiply(BigDecimal.valueOf(value));
    }

    public BigDecimal getMultiply(String key, double value) {
        return numberMap.get(key.toUpperCase()).multiply(BigDecimal.valueOf(value));
    }

    public BigDecimal divideOtherKey(String key, String otherKey, RoundingMode roundingMode) {
        return numberMap.put(key.toUpperCase(), numberMap.get(key.toUpperCase())
                .divide(numberMap.get(otherKey.toUpperCase()), roundingMode));
    }

    public BigDecimal getDivide(String key, long value, RoundingMode roundingMode) {
        return numberMap.get(key.toUpperCase()).divide(BigDecimal.valueOf(value), roundingMode);
    }

    public BigDecimal getDivide(String key, double value, RoundingMode roundingMode) {
        return numberMap.get(key.toUpperCase()).divide(BigDecimal.valueOf(value), roundingMode);
    }

    public boolean isFalse(String key) {
        return numberMap.get(key.toUpperCase()).longValue() == 0;
    }

    public boolean isTrue(String key) {
        return !isFalse(key);
    }

    public boolean isEqual(String key, String value) {
        return stringMap.get(key.toUpperCase()).equalsIgnoreCase(value);
    }

    public boolean isEqual(String key, BigDecimal value) {
        return numberMap.get(key.toUpperCase()).equals(value);
    }

    public boolean isEqual(String key, long value) {
        return numberMap.get(key.toUpperCase()).longValue() == value;
    }

    public boolean isEqual(String key, int value) {
        return numberMap.get(key.toUpperCase()).intValue() == value;
    }

    public boolean isEqual(String key, float value) {
        return numberMap.get(key.toUpperCase()).floatValue() == value;
    }

    public boolean isEqual(String key, double value) {
        return numberMap.get(key.toUpperCase()).doubleValue() == value;
    }

    public boolean isZero(String key) {
        return numberMap.get(key.toUpperCase()).intValue() == 0;
    }

    public boolean isGreater(String key, BigDecimal value) {
        return numberMap.get(key.toUpperCase()).doubleValue() > value.doubleValue();
    }

    public boolean isGreater(String key, long value) {
        return isGreater(key, new BigDecimal(value));
    }

    public boolean isGreaterOrEqual(String key, BigDecimal value) {
        return numberMap.get(key.toUpperCase()).doubleValue() >= value.doubleValue();
    }

    public boolean isGreaterOrEqual(String key, String otherKey) {
        return numberMap.get(key.toUpperCase()).doubleValue() >= numberMap.get(otherKey.toUpperCase()).doubleValue();
    }

    public boolean isLesser(String key, BigDecimal value) {
        return numberMap.get(key.toUpperCase()).doubleValue() < value.doubleValue();
    }

    public boolean isLesser(String key, long value) {
        return isLesser(key, new BigDecimal(value));
    }

    public boolean isLesserOrEqual(String key, long value) {
        return isLesserOrEqual(key, new BigDecimal(value));
    }

    public boolean isLesserOrEqual(String key, BigDecimal value) {
        return numberMap.get(key.toUpperCase()).doubleValue() <= value.doubleValue();
    }

    public boolean isLesserOrEqual(String key, String otherKey) {
        return numberMap.get(key.toUpperCase()).doubleValue() <= numberMap.get(otherKey.toUpperCase()).doubleValue();
    }
}
