const GridWrapper = styled.div`
  .ag-header-cell[col-id="NET_DIE"]::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;

    border-right: none !important;

    background: repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 7.75px,
      var(--ag-border-color) 7.75px,
      var(--ag-border-color) 23.25px,
      transparent 23.25px,
      transparent 31px
    );

    pointer-events: none;
  }
`;
