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

// Example 7: Using in a function
console.log('Example 7: Using in a custom function');
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
