QMadBbs a = QMadBbs.madBbs;
QMadUserBbsPopupRestr b = QMadUserBbsPopupRestr.madUserBbsPopupRestr;

List<MadBbs> result = queryFactory
    .selectFrom(a)
    .where(
        JPAExpressions
            .selectOne()
            .from(b)
            .where(
                b.bbsNo.eq(a.postNo),
                b.userId.eq(userId),

                // 👉 날짜 조건 추가
                Expressions.stringTemplate(
                    "to_char({0}, 'YYYYMMDD')",
                    b.reqTm
                ).eq(
                    Expressions.stringTemplate(
                        "to_char(sysdate, 'YYYYMMDD')"
                    )
                )
            )
            .notExists()
    )
    .fetch();
