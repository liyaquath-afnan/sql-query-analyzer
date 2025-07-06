/**
 * Usage Example for SQL Query Analyzer
 * Shows how to use the analyzer in your own projects
 */

const SQLQueryAnalyzer = require('./sql-query-analyzer.js');

// Create an instance of the analyzer
const analyzer = new SQLQueryAnalyzer();

console.log('SQL Query Analyzer - Usage Examples');
console.log('===================================\n');

// Example 1: Simple query
console.log('Example 1: Simple SELECT query');
const query1 = 'SELECT name, email, age FROM users';
const columns1 = analyzer.analyzeQuery(query1);
console.log(`Query: ${query1}`);
console.log(`Result columns: [${columns1.join(', ')}]\n`);

// Example 2: Query with aliases
console.log('Example 2: Query with aliases');
const query2 = 'SELECT name AS customer_name, email AS contact_email FROM customers';
const columns2 = analyzer.analyzeQuery(query2);
console.log(`Query: ${query2}`);
console.log(`Result columns: [${columns2.join(', ')}]\n`);

// Example 3: Query with JOIN
console.log('Example 3: Query with JOIN');
const query3 = 'SELECT u.name, u.email, p.title FROM users u JOIN posts p ON u.id = p.user_id';
const columns3 = analyzer.analyzeQuery(query3);
console.log(`Query: ${query3}`);
console.log(`Result columns: [${columns3.join(', ')}]\n`);

// Example 4: Query with functions
console.log('Example 4: Query with aggregate functions');
const query4 = 'SELECT COUNT(id) AS total_users, AVG(age) AS average_age FROM users';
const columns4 = analyzer.analyzeQuery(query4);
console.log(`Query: ${query4}`);
console.log(`Result columns: [${columns4.join(', ')}]\n`);

// Example 5: Query with subquery
console.log('Example 5: Query with subquery');
const query5 = 'SELECT name, (SELECT COUNT(*) FROM orders WHERE user_id = u.id) AS order_count FROM users u';
const columns5 = analyzer.analyzeQuery(query5);
console.log(`Query: ${query5}`);
console.log(`Result columns: [${columns5.join(', ')}]\n`);

// Example 6: Error handling
console.log('Example 6: Error handling');
try {
    const invalidQuery = 'INSERT INTO users (name) VALUES ("John")';
    analyzer.analyzeQuery(invalidQuery);
} catch (error) {
    console.log(`Invalid query: ${error.message}\n`);
}

// Example 7: CASE statement with quoted alias
console.log('Example 7: CASE statement with quoted alias');
const query7 = `SELECT name,
    CASE 
        WHEN age >= 0 AND age <= 18 THEN 'young'
        WHEN age >= 19 AND age <= 65 THEN 'adult'
        ELSE 'senior'
    END "Age_Group"
    FROM users`;
const columns7 = analyzer.analyzeQuery(query7);
console.log(`Query: ${query7.replace(/\s+/g, ' ').trim()}`);
console.log(`Result columns: [${columns7.join(', ')}]\n`);

// Example 8: Table.* syntax
console.log('Example 8: Table.* syntax');
const query8 = 'SELECT abc.*, def.name FROM table1 abc JOIN table2 def ON abc.id = def.id';
const columns8 = analyzer.analyzeQuery(query8);
console.log(`Query: ${query8}`);
console.log(`Result columns: [${columns8.join(', ')}]\n`);

// Example 9: Complex query with multiple CASE statements
console.log('Example 9: Multiple CASE statements');
const query9 = `SELECT 
    CASE WHEN status = 1 THEN 'active' ELSE 'inactive' END status_desc,
    CASE WHEN age >= 18 THEN 'adult' ELSE 'minor' END "age_category"
    FROM users`;
const columns9 = analyzer.analyzeQuery(query9);
console.log(`Query: ${query9.replace(/\s+/g, ' ').trim()}`);
console.log(`Result columns: [${columns9.join(', ')}]\n`);

// Example 10: Using in a function
console.log('Example 10: Using in a custom function');
function getQueryColumns(sqlQuery) {
    try {
        return analyzer.analyzeQuery(sqlQuery);
    } catch (error) {
        console.error('Error analyzing query:', error.message);
        return [];
    }
}

const testQuery = 'SELECT product_name, price * quantity AS total FROM order_items';
const result = getQueryColumns(testQuery);
console.log(`Custom function result: [${result.join(', ')}]`);
