@Transactional
public void updateAll(
        List<UserRoleUpdateRequest> requests
) {

    List<UserRoleId> ids = requests.stream()
            .map(UserRoleUpdateRequest::toId)
            .toList();

    Map<UserRoleId, UserRole> entityMap =
            repository.findAllById(ids)
                    .stream()
                    .collect(Collectors.toMap(
                            UserRole::getId,
                            Function.identity()
                    ));

    for (UserRoleUpdateRequest request : requests) {

        UserRole entity = entityMap.get(request.toId());

        if (entity == null) {
            continue;
        }

        entity.update(
                request.getUseYn(),
                request.getRemark()
        );
    }
}
