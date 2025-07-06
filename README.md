# SQL Query Analyzer

A JavaScript library that analyzes SQL SELECT queries and returns the column names that would be in the result set without executing the query.

# NPM package

[![npm version](https://img.shields.io/npm/v/sql-query-analyzer.svg)](https://www.npmjs.com/package/sql-query-analyzer)

install this package as a dependency to your project
```bash
npm i sql-query-analyzer
```

## Features

- ✅ Analyzes SQL SELECT queries to extract column names
- ✅ Handles column aliases (both `AS` keyword and implicit aliases)
- ✅ Supports table prefixes (e.g., `u.name`, `posts.title`)
- ✅ Handles aggregate functions (COUNT, SUM, AVG, MAX, MIN, etc.)
- ✅ Supports subqueries in SELECT clauses
- ✅ Handles JOINs and complex queries
- ✅ Processes calculated fields and expressions
- ✅ No query execution - pure parsing
- ✅ Comprehensive error handling

## Installation

Simply include the `sql-query-analyzer.js` file in your project:

```javascript
const SQLQueryAnalyzer = require('./sql-query-analyzer.js');
```

## Usage

### Basic Usage

```javascript
const SQLQueryAnalyzer = require('./sql-query-analyzer.js');
const analyzer = new SQLQueryAnalyzer();

// Simple query
const columns = analyzer.analyzeQuery('SELECT name, email, age FROM users');
console.log(columns); // ['name', 'email', 'age']
```

### Advanced Examples

#### Query with Aliases
```javascript
const query = 'SELECT name AS customer_name, email AS contact_email FROM customers';
const columns = analyzer.analyzeQuery(query);
console.log(columns); // ['customer_name', 'contact_email']
```

#### Query with JOINs
```javascript
const query = 'SELECT u.name, u.email, p.title FROM users u JOIN posts p ON u.id = p.user_id';
const columns = analyzer.analyzeQuery(query);
console.log(columns); // ['name', 'email', 'title']
```

#### Query with Aggregate Functions
```javascript
const query = 'SELECT COUNT(id) AS total_users, AVG(age) AS average_age FROM users';
const columns = analyzer.analyzeQuery(query);
console.log(columns); // ['total_users', 'average_age']
```

#### Query with Subqueries
```javascript
const query = 'SELECT name, (SELECT COUNT(*) FROM orders WHERE user_id = u.id) AS order_count FROM users u';
const columns = analyzer.analyzeQuery(query);
console.log(columns); // ['name', 'order_count']
```

#### Complex Query
```javascript
const query = `
    SELECT 
        u.name AS customer_name,
        COUNT(o.id) AS total_orders,
        SUM(o.amount) total_spent,
        AVG(o.amount) AS avg_order_value
    FROM users u 
    LEFT JOIN orders o ON u.id = o.user_id
`;
const columns = analyzer.analyzeQuery(query);
console.log(columns); // ['customer_name', 'total_orders', 'total_spent', 'avg_order_value']
```

## API Reference

### `SQLQueryAnalyzer`

#### Constructor
```javascript
const analyzer = new SQLQueryAnalyzer();
```

#### Methods

##### `analyzeQuery(query)`
Analyzes a SQL SELECT query and returns the column names.

**Parameters:**
- `query` (string): The SQL SELECT query to analyze

**Returns:**
- `string[]`: Array of column names that would be in the result set

**Throws:**
- `Error`: If the query is invalid or not a SELECT query

**Example:**
```javascript
const columns = analyzer.analyzeQuery('SELECT name, age FROM users');
```

## Supported SQL Features

### Column Types
- ✅ Simple column names (`name`, `email`)
- ✅ Table-prefixed columns (`u.name`, `posts.title`)
- ✅ Column aliases with AS (`name AS customer_name`)
- ✅ Implicit aliases (`name customer_name`)

### Functions
- ✅ Aggregate functions (`COUNT()`, `SUM()`, `AVG()`, `MAX()`, `MIN()`)
- ✅ String functions (`UPPER()`, `LOWER()`, `LENGTH()`)
- ✅ Date functions (`YEAR()`, `MONTH()`, `DAY()`)
- ✅ Custom functions

### Complex Queries
- ✅ JOINs (INNER, LEFT, RIGHT, FULL OUTER)
- ✅ Subqueries in SELECT clause
- ✅ CASE statements
- ✅ Calculated fields (`price * quantity`)
- ✅ Multi-line queries

### Limitations
- ❌ Does not support `SELECT *` (asterisk) - as per requirements
- ❌ Only supports SELECT queries (no INSERT, UPDATE, DELETE)
- ❌ Does not validate table/column existence
- ❌ Does not execute queries

## Error Handling

The analyzer throws errors for invalid inputs:

```javascript
try {
    const columns = analyzer.analyzeQuery('INSERT INTO users (name) VALUES ("John")');
} catch (error) {
    console.log(error.message); // "Only SELECT queries are supported"
}
```

Common error scenarios:
- Empty or null query
- Non-SELECT queries (INSERT, UPDATE, DELETE, etc.)
- Malformed SQL syntax

## Testing

Run the comprehensive test suite:

```bash
node test-sql-analyzer.js
```

Run usage examples:

```bash
node usage-example.js
```

Run the main analyzer with built-in test cases:

```bash
node sql-query-analyzer.js
```

## Files

- `sql-query-analyzer.js` - Main analyzer class
- `test-sql-analyzer.js` - Comprehensive test suite
- `usage-example.js` - Usage examples and demonstrations
- `README.md` - This documentation

## Requirements Met

✅ **Location**: Created in tests folder, outside ol-dataservices-batch-core  
✅ **Functionality**: Analyzes SQL queries and returns column names  
✅ **No Execution**: Pure parsing, no query execution  
✅ **Subqueries**: Handles subqueries in SELECT clauses  
✅ **JOINs**: Supports various types of JOINs  
✅ **No Asterisk**: Designed for queries without `*` wildcards  
✅ **SELECT Only**: Only processes SELECT queries  

## License

This project is provided as-is for educational and development purposes.
