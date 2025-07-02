/**
 * Test file for SQL Query Analyzer
 * Demonstrates various SQL query patterns and their column extraction
 */

const SQLQueryAnalyzer = require('./sql-query-analyzer.js');

function runTests() {
    const analyzer = new SQLQueryAnalyzer();
    
    console.log('SQL Query Analyzer - Comprehensive Test Suite');
    console.log('==============================================\n');

    const testCases = [
        {
            name: 'Simple SELECT with column names',
            query: 'SELECT name, age, email FROM users',
            expected: ['name', 'age', 'email']
        },
        {
            name: 'SELECT with table prefixes',
            query: 'SELECT u.name, u.email, u.created_at FROM users u',
            expected: ['name', 'email', 'created_at']
        },
        {
            name: 'SELECT with AS aliases',
            query: 'SELECT name AS customer_name, age AS customer_age, email AS contact_email FROM customers',
            expected: ['customer_name', 'customer_age', 'contact_email']
        },
        {
            name: 'SELECT with implicit aliases',
            query: 'SELECT name customer_name, age customer_age FROM customers',
            expected: ['customer_name', 'customer_age']
        },
        {
            name: 'SELECT with JOIN',
            query: 'SELECT u.name, u.email, p.title, p.content FROM users u JOIN posts p ON u.id = p.user_id',
            expected: ['name', 'email', 'title', 'content']
        },
        {
            name: 'SELECT with aggregate functions',
            query: 'SELECT COUNT(id), SUM(amount), AVG(price), MAX(created_at) FROM orders',
            expected: ['count', 'sum', 'avg', 'max']
        },
        {
            name: 'SELECT with function aliases',
            query: 'SELECT COUNT(id) AS total_orders, SUM(amount) AS total_revenue FROM orders',
            expected: ['total_orders', 'total_revenue']
        },
        {
            name: 'SELECT with calculated fields',
            query: 'SELECT price * quantity AS total, discount, price - discount AS final_price FROM order_items',
            expected: ['total', 'discount', 'final_price']
        },
        {
            name: 'SELECT with subquery as column',
            query: 'SELECT name, (SELECT COUNT(*) FROM orders WHERE user_id = u.id) AS order_count FROM users u',
            expected: ['name', 'order_count']
        },
        {
            name: 'SELECT with complex subquery',
            query: 'SELECT u.name, (SELECT SUM(amount) FROM orders o WHERE o.user_id = u.id AND o.status = "completed") total_spent FROM users u',
            expected: ['name', 'total_spent']
        },
        {
            name: 'SELECT with multiple JOINs',
            query: 'SELECT u.name, p.title, c.content FROM users u JOIN posts p ON u.id = p.user_id LEFT JOIN comments c ON p.id = c.post_id',
            expected: ['name', 'title', 'content']
        },
        {
            name: 'SELECT with CASE statement',
            query: 'SELECT name, CASE WHEN age >= 18 THEN "adult" ELSE "minor" END AS age_group FROM users',
            expected: ['name', 'age_group']
        },
        {
            name: 'SELECT with string functions',
            query: 'SELECT UPPER(name) AS name_upper, LOWER(email) email_lower, LENGTH(description) desc_length FROM products',
            expected: ['name_upper', 'email_lower', 'desc_length']
        },
        {
            name: 'SELECT with date functions',
            query: 'SELECT YEAR(created_at) AS year, MONTH(created_at) month, DAY(created_at) day FROM orders',
            expected: ['year', 'month', 'day']
        },
        {
            name: 'Complex query with mixed elements',
            query: `SELECT 
                u.name AS customer_name,
                COUNT(o.id) AS total_orders,
                SUM(o.amount) total_spent,
                AVG(o.amount) AS avg_order_value,
                (SELECT COUNT(*) FROM reviews r WHERE r.user_id = u.id) review_count
            FROM users u 
            LEFT JOIN orders o ON u.id = o.user_id`,
            expected: ['customer_name', 'total_orders', 'total_spent', 'avg_order_value', 'review_count']
        }
    ];

    let passedTests = 0;
    let totalTests = testCases.length;

    testCases.forEach((testCase, index) => {
        try {
            const result = analyzer.analyzeQuery(testCase.query);
            const passed = JSON.stringify(result.sort()) === JSON.stringify(testCase.expected.sort());
            
            console.log(`Test ${index + 1}: ${testCase.name}`);
            console.log(`Query: ${testCase.query.replace(/\s+/g, ' ').trim()}`);
            console.log(`Expected: [${testCase.expected.join(', ')}]`);
            console.log(`Got:      [${result.join(', ')}]`);
            console.log(`Status:   ${passed ? '✅ PASS' : '❌ FAIL'}`);
            console.log('-'.repeat(80));
            
            if (passed) passedTests++;
            
        } catch (error) {
            console.log(`Test ${index + 1}: ${testCase.name}`);
            console.log(`Query: ${testCase.query}`);
            console.log(`Status: ❌ ERROR - ${error.message}`);
            console.log('-'.repeat(80));
        }
    });

    console.log(`\nTest Summary: ${passedTests}/${totalTests} tests passed`);
    
    // Additional error handling tests
    console.log('\nError Handling Tests:');
    console.log('====================');
    
    const errorTests = [
        {
            name: 'Empty query',
            query: '',
            expectedError: 'Query must be a non-empty string'
        },
        {
            name: 'Non-SELECT query',
            query: 'INSERT INTO users (name) VALUES ("John")',
            expectedError: 'Only SELECT queries are supported'
        },
        {
            name: 'UPDATE query',
            query: 'UPDATE users SET name = "John" WHERE id = 1',
            expectedError: 'Only SELECT queries are supported'
        }
    ];

    errorTests.forEach((test, index) => {
        try {
            analyzer.analyzeQuery(test.query);
            console.log(`Error Test ${index + 1}: ${test.name} - ❌ FAIL (Should have thrown error)`);
        } catch (error) {
            const passed = error.message === test.expectedError;
            console.log(`Error Test ${index + 1}: ${test.name} - ${passed ? '✅ PASS' : '❌ FAIL'}`);
            if (!passed) {
                console.log(`  Expected: ${test.expectedError}`);
                console.log(`  Got: ${error.message}`);
            }
        }
    });
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}

module.exports = { runTests };
