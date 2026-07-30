const GridWrapper = styled.div`
  .ag-header-cell[col-id="NET_DIE"] {
    position: relative;
  }

  .ag-header-cell[col-id="NET_DIE"]::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;

    background: repeating-linear-gradient(
      to bottom,
      #bdc3c7 0,
      #bdc3c7 31px,
      transparent 31px,
      transparent 32px
    );

    z-index: 10;
    pointer-events: none;
  }
`;
