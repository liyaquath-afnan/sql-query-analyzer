/**
 * SQL Query Analyzer
 * Analyzes SQL SELECT queries and returns the column names that would be in the result set
 */

class SQLQueryAnalyzer {
    constructor() {
        // Keywords that might appear in SELECT clauses
        this.sqlKeywords = new Set([
            'FROM', 'WHERE', 'GROUP', 'HAVING', 'ORDER', 'LIMIT', 
            'OFFSET', 'UNION', 'INTERSECT', 'EXCEPT', 'JOIN', 'INNER',
            'LEFT', 'RIGHT', 'FULL', 'OUTER', 'ON', 'USING'
        ]);
    }

    /**
     * Main method to analyze a SQL query and extract column names
     * @param {string} query - The SQL SELECT query to analyze
     * @returns {string[]} - Array of column names that would be in the result set
     */
    analyzeQuery(query) {
        if (!query || typeof query !== 'string') {
            throw new Error('Query must be a non-empty string');
        }

        // Clean and normalize the query
        const cleanQuery = this.cleanQuery(query);
        
        // Validate it's a SELECT query
        if (!this.isSelectQuery(cleanQuery)) {
            throw new Error('Only SELECT queries are supported');
        }

        // Extract the SELECT clause
        const selectClause = this.extractSelectClause(cleanQuery);
        
        // Parse column names from the SELECT clause
        const columns = this.parseSelectColumns(selectClause);
        
        return columns;
    }

    /**
     * Clean and normalize the SQL query
     * @param {string} query - Raw SQL query
     * @returns {string} - Cleaned query
     */
    cleanQuery(query) {
        return query
            .trim()
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\n/g, ' ')  // Replace newlines with spaces
            .replace(/\t/g, ' '); // Replace tabs with spaces
    }

    /**
     * Check if the query is a SELECT query
     * @param {string} query - SQL query
     * @returns {boolean} - True if it's a SELECT query
     */
    isSelectQuery(query) {
        return query.toUpperCase().trim().startsWith('SELECT');
    }

    /**
     * Extract the SELECT clause from the query
     * @param {string} query - SQL query
     * @returns {string} - SELECT clause content
     */
    extractSelectClause(query) {
        const upperQuery = query.toUpperCase();
        const selectStart = upperQuery.indexOf('SELECT') + 6;
        
        // Find the end of SELECT clause (before the main FROM, not subquery FROMs)
        let selectEnd = query.length;
        let parenthesesLevel = 0;
        let inQuotes = false;
        let quoteChar = '';
        
        // Start searching after SELECT keyword
        for (let i = selectStart; i < query.length - 4; i++) {
            const char = query[i];
            const prevChar = i > 0 ? query[i - 1] : '';
            
            // Handle quotes
            if ((char === '"' || char === "'") && prevChar !== '\\') {
                if (!inQuotes) {
                    inQuotes = true;
                    quoteChar = char;
                } else if (char === quoteChar) {
                    inQuotes = false;
                    quoteChar = '';
                }
            }
            
            if (!inQuotes) {
                // Track parentheses level
                if (char === '(') {
                    parenthesesLevel++;
                } else if (char === ')') {
                    parenthesesLevel--;
                }
                
                // Look for FROM only at the top level (not inside subqueries)
                if (parenthesesLevel === 0) {
                    const remaining = query.substring(i).toUpperCase();
                    if (remaining.startsWith(' FROM ')) {
                        selectEnd = i;
                        break;
                    }
                }
            }
        }

        return query.substring(selectStart, selectEnd).trim();
    }

    /**
     * Parse column names from the SELECT clause
     * @param {string} selectClause - The SELECT clause content
     * @returns {string[]} - Array of column names
     */
    parseSelectColumns(selectClause) {
        const columns = [];
        const columnParts = this.splitSelectColumns(selectClause);

        for (let part of columnParts) {
            const columnName = this.extractColumnName(part.trim());
            if (columnName) {
                columns.push(columnName);
            }
        }

        return columns;
    }

    /**
     * Split the SELECT clause into individual column parts
     * Handles commas inside parentheses (for functions and subqueries)
     * @param {string} selectClause - SELECT clause content
     * @returns {string[]} - Array of column parts
     */
    splitSelectColumns(selectClause) {
        const parts = [];
        let currentPart = '';
        let parenthesesLevel = 0;
        let inQuotes = false;
        let quoteChar = '';

        for (let i = 0; i < selectClause.length; i++) {
            const char = selectClause[i];
            const prevChar = i > 0 ? selectClause[i - 1] : '';

            // Handle quotes
            if ((char === '"' || char === "'") && prevChar !== '\\') {
                if (!inQuotes) {
                    inQuotes = true;
                    quoteChar = char;
                } else if (char === quoteChar) {
                    inQuotes = false;
                    quoteChar = '';
                }
            }

            if (!inQuotes) {
                // Track parentheses level
                if (char === '(') {
                    parenthesesLevel++;
                } else if (char === ')') {
                    parenthesesLevel--;
                }

                // Split on comma only if we're at the top level
                if (char === ',' && parenthesesLevel === 0) {
                    parts.push(currentPart.trim());
                    currentPart = '';
                    continue;
                }
            }

            currentPart += char;
        }

        // Add the last part
        if (currentPart.trim()) {
            parts.push(currentPart.trim());
        }

        return parts;
    }

    /**
     * Extract the final column name from a column expression
     * Handles aliases, functions, and table prefixes
     * @param {string} columnExpr - Column expression
     * @returns {string} - Final column name
     */
    extractColumnName(columnExpr) {
        // Handle subqueries - if it starts with (, it's likely a subquery
        if (columnExpr.trim().startsWith('(')) {
            // For subqueries, we need to check if there's an alias after the closing parenthesis
            const lastParenIndex = columnExpr.lastIndexOf(')');
            if (lastParenIndex !== -1) {
                const afterParen = columnExpr.substring(lastParenIndex + 1).trim();
                if (afterParen) {
                    // Check for AS keyword or implicit alias
                    const asMatch = afterParen.match(/^(?:AS\s+)?(\w+)$/i);
                    if (asMatch) {
                        return asMatch[1];
                    }
                    // Check for implicit alias (just the word after the parenthesis)
                    const implicitMatch = afterParen.match(/^(\w+)$/);
                    if (implicitMatch) {
                        return implicitMatch[1];
                    }
                }
            }
            return 'subquery_result'; // Default name for subqueries without aliases
        }

        // Check for AS alias
        const asRegex = /^(.+?)\s+AS\s+(\w+)$/i;
        const asMatch = columnExpr.match(asRegex);
        if (asMatch) {
            return asMatch[2]; // Return the alias
        }

        // Check for implicit alias (space-separated)
        const parts = columnExpr.split(/\s+/);
        if (parts.length >= 2) {
            const lastPart = parts[parts.length - 1];
            // Check if the last part is not a SQL keyword
            if (!this.sqlKeywords.has(lastPart.toUpperCase())) {
                // Check if it looks like an identifier (not a number or operator)
                if (/^[a-zA-Z_]\w*$/.test(lastPart)) {
                    return lastPart; // Return the implicit alias
                }
            }
        }

        // No alias found, extract the base column name
        const baseExpr = parts[0];

        // Handle function calls like COUNT(column), SUM(amount), etc.
        const funcMatch = baseExpr.match(/^(\w+)\s*\(/);
        if (funcMatch) {
            return funcMatch[1].toLowerCase(); // Return function name as column name
        }

        // Handle table.column format
        const dotIndex = baseExpr.lastIndexOf('.');
        if (dotIndex !== -1) {
            return baseExpr.substring(dotIndex + 1);
        }

        // Handle expressions with operators (like price * quantity)
        // For complex expressions without aliases, return a generic name
        if (/[+\-*/]/.test(baseExpr)) {
            return 'calculated_field';
        }

        // Return the column name as-is
        return baseExpr;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SQLQueryAnalyzer;
}

// Example usage and testing
if (require.main === module) {
    const analyzer = new SQLQueryAnalyzer();
    
    // Test cases
    const testQueries = [
        "SELECT name, age FROM users",
        "SELECT u.name, u.email, p.title FROM users u JOIN posts p ON u.id = p.user_id",
        "SELECT name AS customer_name, age AS customer_age FROM customers",
        "SELECT COUNT(id), SUM(amount) FROM orders",
        "SELECT price * quantity AS total, discount FROM order_items",
        "SELECT (SELECT COUNT(*) FROM orders WHERE user_id = u.id) AS order_count, u.name FROM users u"
    ];

    console.log('SQL Query Analyzer Test Results:');
    console.log('================================');
    
    testQueries.forEach((query, index) => {
        try {
            const columns = analyzer.analyzeQuery(query);
            console.log(`\nTest ${index + 1}:`);
            console.log(`Query: ${query}`);
            console.log(`Columns: [${columns.join(', ')}]`);
        } catch (error) {
            console.log(`\nTest ${index + 1} ERROR:`);
            console.log(`Query: ${query}`);
            console.log(`Error: ${error.message}`);
        }
    });
}
