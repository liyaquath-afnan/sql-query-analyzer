const SQLQueryAnalyzer = require('./sql-query-analyzer/sql-query-analyzer.js');
const analyzer = new SQLQueryAnalyzer();

const columns = analyzer.analyzeQuery('SELECT TRIM(TRIM(v.year) || \' \' || TRIM(v.make_name) || \' \' || TRIM(v.model_name) || \' \' || TRIM(v.series_name)) AS YMMS, v.vin, v.vehicle_id, FLOOR(SYSDATE - TO_DATE(r2.response, \'MM/DD/YYYY\')) AS daysSinceCheckin FROM wf_interactions i INNER JOIN wf_interaction_responses r2 ON i.wf_interaction_id = r2.wf_interaction_id AND r2.question_key = \'returnDate\' INNER JOIN vehicles v ON v.vehicle_id = i.vehicle_id and v.active = 1 WHERE i.wf_interaction_status_id IN (1,4) AND (0 = 1 OR (v.vehicle_status_id IN (10,12) AND v.system_id = 2)) AND (196140 IS NULL OR i.organization_id LIKE 196140)');
console.log(columns); // ['name', 'age']

