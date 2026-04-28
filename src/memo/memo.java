List<MadBbs> result = queryFactory
    .selectFrom(a)
    .where(
        JPAExpressions
            .selectOne()
            .from(b)
            .where(
                b.bbsNo.eq(a.postNo),
                b.userId.eq(userId)
            )
            .notExists()
    )
    .fetch();
