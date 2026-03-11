const groups = {
  all:["colA","colB","colC"],
  all2:["colD","colE","colF"]
};

const onCellValueChanged = (params)=>{

  const field = params.colDef.field;
  const node = params.node;
  const checked = params.newValue;

  // ALL 클릭
  if(groups[field]){
    groups[field].forEach(c=>node.setDataValue(c,checked));
    return;
  }

  // child 클릭 → ALL 계산
  Object.keys(groups).forEach(allField=>{

    const children = groups[allField];

    if(children.includes(field)){

      const allChecked = children.every(c=>node.data[c]);

      node.setDataValue(allField, allChecked);

    }

  });

};
