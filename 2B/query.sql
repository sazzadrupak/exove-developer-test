   SELECT CONCAT(p.first_name, ' ', p.last_name) AS name,
          COALESCE(STRING_AGG(ph.number, ','), 'N/A') AS numbers
     FROM people p
LEFT JOIN phones ph ON p.id = ph.user_id
 GROUP BY p.id
 ORDER BY p.last_name;