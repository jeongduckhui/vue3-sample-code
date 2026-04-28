SELECT 
    a.user_grp_id,
    COUNT(b.user_id) AS user_cnt
FROM mad_user_grp a
LEFT JOIN mad_user_grp_user_map b
    ON a.user_grp_id = b.user_grp_id
GROUP BY a.user_grp_id
ORDER BY a.user_grp_id;
