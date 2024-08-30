# 2B. Create an SQL query

I have used two function to return the expected output.

### STRING_AGG(exp, seperator)

This function concatenates the values of string from a table's column and seperates the values by given _seperator_ parameter values.

### COALESCE(arg1, arg2, ...)

I have used this to handle the _null_ values. If there is a null values in a row result, the null value will be replaced by the first not null values, in my query it is 'N/A'.
