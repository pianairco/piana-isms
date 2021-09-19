package ir.piana.business.isms.common.util;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.math.MathContext;
import java.util.regex.Pattern;

public class CommonUtils {
    private static Pattern numberPattern = Pattern.compile("-?\\d+(\\.\\d+)?");

    public static String reverseCodes(String code) {
        String[] parts = new String[50];
        int partsIndex = 0;
        StringBuffer newPart = new StringBuffer();
        for (int i = 0; i < code.length(); i++) {
            String newChar = code.substring(i, i + 1);
            if (!"-".equals(newChar) && !"/".equals(newChar) && !"_".equals(newChar) && !".".equals(newChar)) {
                if (i == code.length() - 1) {
                    newPart.append(newChar);
                    parts[partsIndex] = newPart.toString();
                    partsIndex++;
                } else {
                    newPart.append(newChar);
                }
            } else {
                parts[partsIndex] = newPart.toString();
                partsIndex++;
                newPart = new StringBuffer();
                parts[partsIndex] = newChar;
                partsIndex++;
            }
        }
        StringBuffer reverseCode = new StringBuffer();
        for (int i = partsIndex; i > 0; i--) {
            reverseCode.append(parts[i - 1]);
        }
        return reverseCode.toString();
    }

    public static boolean isNull(String str) {
        return (str == null || "".equals(str) || "null".equals(str));
    }

    public static boolean isNull(Object obj) {
        if (obj == null)
            return true;
        else if(obj instanceof String)
            return isNull((String)obj);
        return false;
    }

    public static boolean isNumber(Object obj) {
        if(obj == null) return false;
        if(obj instanceof Number)
            return true;
        return false;
    }

    public static boolean isNumber(String string) {
        return numberPattern.matcher(string).matches();
    }

    public static boolean isEqual(String toCompareStr, String ModelConststr) {
        return (!isNull(toCompareStr) && !isNull(ModelConststr)
                && normalizeString(ModelConststr).equals(normalizeString(toCompareStr)));
    }

    public static boolean isEqual(Object obj, String ModelConststr) {
        if (obj == null)
            return false;
        String str = obj.toString();
        return (isEqual(str, ModelConststr));
    }

    public static boolean isEqual(Object obj1, Object obj2) {
        return (isNull(obj1) && isNull(obj2)) || (obj1 != null && obj1.equals(obj2));
    }

    public static String normalizeString(String s) {
        return s.replace('ی', 'ي').replace('ک', 'ك');
    }

    public static String unormalizeString(String s) {
        return s.replace('ي', 'ی').replace('ك', 'ک');
    }

    public static boolean isNotNull(Object obj) {
        return !isNull(obj);
    }

    public static String throwableToString(Throwable e) {
        StringWriter trace = new StringWriter();
        e.printStackTrace(new PrintWriter(trace));
        return String.format("Type:%s, Message: %s, Trace: %s", e.getClass().getName(), e.getMessage(),
                trace.toString());
    }

    public static double multiply(double... values) {
        MathContext mathContext = new MathContext(10);
        BigDecimal result = new BigDecimal(1);
        for (double value : values) {
            BigDecimal term = new BigDecimal(value + "", mathContext);
            result = result.multiply(term);
        }
        return Math.floor(result.doubleValue());
    }
}
