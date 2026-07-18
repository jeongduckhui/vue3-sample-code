/**
 * 두 컬럼이 특정 depth에서 같은 헤더 그룹인지 판단한다.
 *
 * @param headerPaths 컬럼별 헤더 경로
 * @param leftIndex 왼쪽 컬럼 index
 * @param rightIndex 오른쪽 컬럼 index
 * @param depthIndex depth index
 * @param maxDepth 최대 헤더 깊이
 * @return 같은 그룹이면 true
 */
private boolean isSameHeaderGroup(
        List<List<String>> headerPaths,
        int leftIndex,
        int rightIndex,
        int depthIndex,
        int maxDepth
) {

    // 왼쪽 컬럼의 헤더 경로를 가져온다.
    List<String> leftPath = headerPaths.get(leftIndex);

    // 오른쪽 컬럼의 헤더 경로를 가져온다.
    List<String> rightPath = headerPaths.get(rightIndex);

    // 헤더 경로가 없으면 같은 그룹으로 처리하지 않는다.
    if (leftPath == null || leftPath.isEmpty()
            || rightPath == null || rightPath.isEmpty()) {
        return false;
    }

    /*
     * 현재 depth가 두 컬럼 중 하나라도 실제 leaf 위치이면
     * 가로 병합하지 않는다.
     *
     * 짧은 headerPath 컬럼은 이후 세로 병합 대상이므로,
     * 여기서 가로 병합하면 병합 영역이 겹치게 된다.
     */
    if (depthIndex >= leftPath.size() - 1
            || depthIndex >= rightPath.size() - 1) {
        return false;
    }

    // 현재 depth까지의 상위 경로가 모두 같은지 확인한다.
    for (int index = 0; index <= depthIndex; index++) {

        String leftText = resolveHeaderTextAtDepth(
                leftPath,
                index,
                maxDepth
        );

        String rightText = resolveHeaderTextAtDepth(
                rightPath,
                index,
                maxDepth
        );

        // 현재 depth까지 헤더명이 하나라도 다르면 다른 그룹이다.
        if (!Objects.equals(leftText, rightText)) {
            return false;
        }
    }

    // 모든 상위 경로가 같으면 동일한 헤더 그룹이다.
    return true;
}
